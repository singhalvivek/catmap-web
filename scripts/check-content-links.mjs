// check-content-links.mjs — fails when a hardcoded constant no longer matches MongoDB.
//
// Routes resolve a URL slug to a chapter *name* through src/constants, then query Mongo
// by that name. Nothing type-checks that pairing, and a mismatch is silent: the query
// returns nothing, the page calls notFound(), the build succeeds, and the URL 404s in
// production. Three quant chapters shipped that way — the constants said
// "Pipes/Trains/Boats" where the database says "Pipes, Trains & Boats" — and it was only
// caught by requesting all 248 sitemap URLs by hand.
//
// Run after editing src/constants/* or after any scrape that adds or renames content:
//   npm run check:content

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const { MongoClient } = require("mongodb");

function loadEnv() {
  const file = path.join(root, ".env.local");
  if (!fs.existsSync(file)) return process.env;
  const parsed = Object.fromEntries(
    fs
      .readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
      })
  );
  return { ...parsed, ...process.env };
}

// The constants are TypeScript, so they are parsed rather than imported — this script
// runs under plain node, before any build step exists.
function parsePracticeSubjects() {
  const src = fs.readFileSync(path.join(root, "src/constants/practiceChapters.ts"), "utf8");
  const marks = [...src.matchAll(/section:\s*"(Quant|DILR|VARC)"/g)].map((m) => [m[1], m.index]);
  return marks.map(([section, start], i) => {
    const block = src.slice(start, i + 1 < marks.length ? marks[i + 1][1] : src.length);
    const topics = [
      ...block.matchAll(/name:\s*"([^"]+)",\s*\n\s*slug:\s*"([^"]+)",\s*\n\s*chapters:\s*\[([\s\S]*?)\n\s*\],/g),
    ].map((t) => ({
      name: t[1],
      chapters: [...t[3].matchAll(/\{\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g)].map((c) => ({
        name: c[1],
        slug: c[2],
      })),
    }));
    return { section, topics };
  });
}

const env = loadEnv();
if (!env.MONGODB_URI || !env.MONGODB_DATABASE) {
  console.error("check:content needs MONGODB_URI and MONGODB_DATABASE — skipping.");
  process.exit(0);
}

const client = new MongoClient(env.MONGODB_URI);
await client.connect();
const db = client.db(env.MONGODB_DATABASE);

const problems = [];
const fail = (msg) => problems.push(msg);
const subjects = parsePracticeSubjects();

// Quant and VARC chapters must match percentyl_practice_questions. VARC stores the topic
// equal to the chapter; Quant stores a real topic grouping.
for (const s of subjects) {
  if (s.section === "DILR") continue;
  for (const t of s.topics) {
    for (const ch of t.chapters) {
      if (ch.slug === "reading-comprehensions") continue;
      const topic = s.section === "VARC" ? ch.name : t.name;
      const n = await db
        .collection("percentyl_practice_questions")
        .countDocuments({ section: s.section, topic, chapter: ch.name });
      if (n === 0) fail(`${s.section} chapter "${ch.name}" (/${ch.slug}) matches 0 questions — that page 404s`);
    }
  }
}

for (const s of subjects.filter((x) => x.section === "DILR")) {
  for (const t of s.topics) {
    for (const ch of t.chapters) {
      const n = await db.collection("percentyl_dilr_sets").countDocuments({ chapter: ch.name });
      if (n === 0) fail(`DILR chapter "${ch.name}" (/${ch.slug}) matches 0 sets — that page 404s`);
    }
  }
}

// Content in Mongo that no constants entry points at is content with no page at all.
const known = new Set();
for (const s of subjects) {
  for (const t of s.topics) {
    for (const ch of t.chapters) {
      known.add(`${s.section}|${s.section === "VARC" ? ch.name : t.name}|${ch.name}`);
    }
  }
}
const grouped = await db
  .collection("percentyl_practice_questions")
  .aggregate([{ $group: { _id: { s: "$section", t: "$topic", c: "$chapter" }, n: { $sum: 1 } } }])
  .toArray();
for (const r of grouped) {
  if (!known.has(`${r._id.s}|${r._id.t}|${r._id.c}`)) {
    fail(`${r.n} ${r._id.s} questions in "${r._id.t}"/"${r._id.c}" have no constants entry — unreachable`);
  }
}

const dilrKnown = new Set(
  subjects.filter((s) => s.section === "DILR").flatMap((s) => s.topics.flatMap((t) => t.chapters.map((c) => c.name)))
);
for (const ch of await db.collection("percentyl_dilr_sets").distinct("chapter")) {
  if (!dilrKnown.has(ch)) fail(`DILR chapter "${ch}" has sets in Mongo but no constants entry — unreachable`);
}

// PYQ slugs are the URL and the query key, so a mismatch both 404s and hides a paper.
const listed = [
  ...fs.readFileSync(path.join(root, "src/constants/pyqPapers.ts"), "utf8").matchAll(/slug:\s*"([^"]+)"/g),
].map((m) => m[1]);
const scraped = new Set(await db.collection("cracku_pyq_questions").distinct("paperSlug"));
for (const slug of listed) {
  if (!scraped.has(slug)) fail(`PYQ_PAPERS lists "${slug}" but Mongo has no questions — sitemap URL 404s`);
}
for (const slug of scraped) {
  if (!listed.includes(slug)) fail(`Mongo has paper "${slug}" missing from PYQ_PAPERS — unreachable`);
}

await client.close();

if (problems.length === 0) {
  console.log("check:content — constants and MongoDB agree.");
  process.exit(0);
}
console.error(`check:content — ${problems.length} problem(s):`);
for (const p of problems) console.error(`  ✗ ${p}`);
process.exit(1);
