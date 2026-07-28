// essayQueries — server-side helpers: pick/fetch daily essay, save submissions, compute votes
import { ObjectId, type Db } from "mongodb";
import { getDb } from "./mongodb";
import type { DailyEssay, EssaySubmissionView } from "@/app/cat-prep/models/essay";

// ---- MongoDB document types ----

type EssayDoc = {
  _id: ObjectId;
  date: string;
  title: string;
  url: string;
  author: string;
  excerpt: string;
  fetchedAt: Date;
};

type UsedEssayDoc = {
  _id: ObjectId;
  url: string;
  usedAt: Date;
};

type SubmissionDoc = {
  _id: ObjectId;
  date: string;
  userId: string;
  displayName: string;
  photoUrl: string | null;
  answers: Record<string, string>;
  submittedAt: Date;
};

type VoteDoc = {
  _id: ObjectId;
  submissionId: string;
  questionId: string;
  voterId: string;
  value: 1 | -1;
};

// ---- RSS helpers ----

function extractCdata(block: string, tag: string): string | null {
  const escaped = tag.replace(":", "\\:");
  const re = new RegExp(`<${escaped}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${escaped}>`);
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function extractTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>([^<]+)<\\/${tag}>`);
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseRssItems(xml: string): { title: string; url: string; author: string; excerpt: string }[] {
  const items: { title: string; url: string; author: string; excerpt: string }[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;

  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title = extractCdata(block, "title") ?? extractTag(block, "title") ?? "";
    const url = extractTag(block, "link") ?? "";
    const author = extractCdata(block, "dc:creator") ?? "";
    const rawDesc = extractCdata(block, "description") ?? "";
    const excerpt = stripHtml(rawDesc).slice(0, 280).trim();

    if (url.includes("/essays/") && title && url) {
      items.push({ title, url, author, excerpt });
    }
  }

  return items;
}

async function fetchRandomUnusedItem(
  usedUrls: Set<string>
): Promise<{ title: string; url: string; author: string; excerpt: string } | null> {
  let xml: string;
  try {
    xml = await fetch("https://aeon.co/feed.rss", {
      headers: { "User-Agent": "StudyNaksha/1.0" },
    }).then((r) => r.text());
  } catch {
    return null;
  }

  const items = parseRssItems(xml);
  if (items.length === 0) return null;

  const unused = items.filter((i) => !usedUrls.has(i.url));
  const pool = unused.length > 0 ? unused : items; // recycle if all used
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---- Public API ----

/** True for a MongoDB duplicate-key error (another request won the insert race). */
function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === 11000;
}

// The unique index is what makes the upsert below race-safe: without it, two
// concurrent upserts on the same missing date can both insert. Created once per
// process, non-fatally — a pre-existing duplicate would make createIndex fail,
// and that must not take the essay pages down.
let essayIndexReady: Promise<void> | null = null;
function ensureEssayIndex(db: Db): Promise<void> {
  essayIndexReady ??= db
    .collection("daily_essays")
    .createIndex({ date: 1 }, { unique: true })
    .then(() => undefined)
    .catch((err: unknown) => {
      // Most likely cause: duplicate `date` docs already written by the old
      // unindexed insert path. Until they are removed and the index builds, the
      // upsert below is still an improvement but is NOT race-proof. Check with:
      //   db.daily_essays.aggregate([{$group:{_id:"$date",n:{$sum:1}}},{$match:{n:{$gt:1}}}])
      console.error(
        "[essayQueries] unique index on daily_essays.date NOT created — essay picks remain race-prone:",
        err
      );
    });
  return essayIndexReady;
}

/**
 * Reads the stored essay for a date. Never picks or writes — safe to call with
 * an unvalidated date. Returns null when no essay was stored for that date.
 */
export async function fetchDailyEssay(date: string): Promise<DailyEssay | null> {
  const db = await getDb();
  const doc = await db.collection<EssayDoc>("daily_essays").findOne({ date });
  if (!doc) return null;
  return {
    date: doc.date,
    title: doc.title,
    url: doc.url,
    author: doc.author,
    excerpt: doc.excerpt,
  };
}

/**
 * Returns today's essay, picking and saving a new one on the first request of the day.
 *
 * Writes on a miss, so only ever call this for today's date — a past or
 * arbitrary date would backfill a fresh essay under the wrong day and burn it
 * out of the pool. Use `fetchDailyEssay` everywhere else.
 */
export async function fetchOrPickDailyEssay(date: string): Promise<DailyEssay | null> {
  const existing = await fetchDailyEssay(date);
  if (existing) return existing;

  const db = await getDb();
  await ensureEssayIndex(db);

  const usedUrls = new Set(
    (await db.collection<UsedEssayDoc>("used_essays").find({}, { projection: { url: 1 } }).toArray()).map(
      (d) => d.url
    )
  );

  const picked = await fetchRandomUnusedItem(usedUrls);
  if (!picked) return null;

  const now = new Date();
  try {
    const upsert = await db.collection<Omit<EssayDoc, "_id">>("daily_essays").updateOne(
      { date },
      { $setOnInsert: { date, ...picked, fetchedAt: now } },
      { upsert: true }
    );

    // Only retire the URL if this request is the one that actually inserted;
    // otherwise a lost race would burn an essay nobody was ever served.
    if (upsert.upsertedCount === 1) {
      await db.collection<Omit<UsedEssayDoc, "_id">>("used_essays").insertOne({
        url: picked.url,
        usedAt: now,
      } as Omit<UsedEssayDoc, "_id">);
    }
  } catch (err) {
    if (!isDuplicateKeyError(err)) throw err;
    // Another request inserted between our read and our write — use theirs.
  }

  return fetchDailyEssay(date);
}

/**
 * Saves a user's essay response. Throws DuplicateEssaySubmissionError if already submitted.
 */
export async function saveEssaySubmission(params: {
  date: string;
  userId: string;
  displayName: string;
  photoUrl: string | null;
  answers: Record<string, string>;
}): Promise<string> {
  const db = await getDb();

  const exists = await db
    .collection<SubmissionDoc>("essay_submissions")
    .findOne({ date: params.date, userId: params.userId }, { projection: { _id: 1 } });
  if (exists) throw new DuplicateEssaySubmissionError();

  const result = await db.collection<Omit<SubmissionDoc, "_id">>("essay_submissions").insertOne({
    date: params.date,
    userId: params.userId,
    displayName: params.displayName,
    photoUrl: params.photoUrl,
    answers: params.answers,
    submittedAt: new Date(),
  } as Omit<SubmissionDoc, "_id">);

  return result.insertedId.toString();
}

/**
 * Returns all submissions for a date with per-question vote scores and the requesting user's votes.
 * Submissions are unsorted — the client sorts per-question answer lists by questionScores.
 */
export async function getEssaySubmissions(
  date: string,
  requestingUserId: string
): Promise<EssaySubmissionView[]> {
  const db = await getDb();

  const submissions = await db
    .collection<SubmissionDoc>("essay_submissions")
    .find({ date })
    .toArray();

  if (submissions.length === 0) return [];

  const submissionIds = submissions.map((s) => s._id.toString());

  // Fetch all votes for these submissions in one query
  const votes = await db
    .collection<VoteDoc>("essay_votes")
    .find({ submissionId: { $in: submissionIds } })
    .toArray();

  // Build per-submission, per-question vote maps
  // scoreMap[submissionId][questionId] = net score
  // userVoteMap[submissionId][questionId] = requesting user's vote
  const scoreMap: Record<string, Record<string, number>> = {};
  const userVoteMap: Record<string, Record<string, 1 | -1>> = {};

  for (const vote of votes) {
    if (!scoreMap[vote.submissionId]) scoreMap[vote.submissionId] = {};
    scoreMap[vote.submissionId][vote.questionId] =
      (scoreMap[vote.submissionId][vote.questionId] ?? 0) + vote.value;

    if (vote.voterId === requestingUserId) {
      if (!userVoteMap[vote.submissionId]) userVoteMap[vote.submissionId] = {};
      userVoteMap[vote.submissionId][vote.questionId] = vote.value;
    }
  }

  return submissions.map((s) => {
    const id = s._id.toString();
    return {
      id,
      userId: s.userId,
      displayName: s.displayName,
      photoUrl: s.photoUrl,
      answers: s.answers,
      submittedAt: s.submittedAt.toISOString(),
      questionScores: scoreMap[id] ?? {},
      questionUserVotes: userVoteMap[id] ?? {},
    };
  });
}

/**
 * Upserts a per-question vote. value=0 removes the vote. Users cannot vote on their own submissions.
 */
export async function saveEssayVote(params: {
  submissionId: string;
  questionId: string;
  voterId: string;
  value: 1 | -1 | 0;
}): Promise<void> {
  const db = await getDb();

  const { submissionId, questionId, voterId, value } = params;

  // Guard: no self-voting
  const sub = await db
    .collection<SubmissionDoc>("essay_submissions")
    .findOne({ _id: new ObjectId(submissionId) }, { projection: { userId: 1 } });
  if (!sub) throw new Error("Submission not found");
  if (sub.userId === voterId) throw new SelfVoteError();

  if (value === 0) {
    await db.collection<VoteDoc>("essay_votes").deleteOne({ submissionId, questionId, voterId });
  } else {
    await db.collection<VoteDoc>("essay_votes").updateOne(
      { submissionId, questionId, voterId },
      { $set: { value, submissionId, questionId, voterId } },
      { upsert: true }
    );
  }
}

export type EssayArchiveEntry = {
  date: string;
  title: string;
  url: string;
  author: string;
  responseCount: number;
};

/**
 * Dates of every essay whose archive page is publicly viewable — past dates only,
 * matching what `/cat-prep/daily-dose/essay/[date]` will actually serve. Feeds that
 * route's `generateStaticParams`; the sitemap deliberately does not list these pages.
 */
export async function getPastEssayDates(todayIST: string): Promise<string[]> {
  const db = await getDb();
  // `distinct`, not `find`: the collection currently holds two documents for
  // 2026-06-30, and one date is one page — a repeated <loc> is an invalid sitemap.
  const dates = await db
    .collection<EssayDoc>("daily_essays")
    .distinct("date", { date: { $lt: todayIST } });
  return dates.sort().reverse();
}

/**
 * Returns all past essays (excluding today) sorted newest-first, with response counts.
 */
export async function getEssayArchive(todayIST: string): Promise<EssayArchiveEntry[]> {
  const db = await getDb();

  const essays = await db
    .collection<EssayDoc>("daily_essays")
    .find({ date: { $lt: todayIST } })
    .sort({ date: -1 })
    .toArray();

  if (essays.length === 0) return [];

  const dates = essays.map((e) => e.date);

  // Aggregate response counts for all dates in one query
  const counts = await db
    .collection<SubmissionDoc>("essay_submissions")
    .aggregate<{ _id: string; count: number }>([
      { $match: { date: { $in: dates } } },
      { $group: { _id: "$date", count: { $sum: 1 } } },
    ])
    .toArray();

  const countMap = new Map(counts.map((c) => [c._id, c.count]));

  return essays.map((e) => ({
    date: e.date,
    title: e.title,
    url: e.url,
    author: e.author,
    responseCount: countMap.get(e.date) ?? 0,
  }));
}

export class DuplicateEssaySubmissionError extends Error {
  constructor() {
    super("Already submitted for this date.");
    this.name = "DuplicateEssaySubmissionError";
  }
}

export class SelfVoteError extends Error {
  constructor() {
    super("Cannot vote on your own submission.");
    this.name = "SelfVoteError";
  }
}
