// pyqQueries — server-side MongoDB query functions for cracku_pyq_* (PYQ paper) collections
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { PYQ_PAPERS, getPyqPaper } from "@/constants/pyqPapers";
import type {
  PyqSection,
  PyqQuestionType,
  PyqOption,
  PyqQuestion,
  PyqPaper,
  PyqSolvedPaper,
  PyqPaperSummary,
} from "@/app/cat-prep/models/pyq";
import type {
  DailyTest,
  TestSection,
  Question,
  DailyChallengeResult,
  SerializedDailyChallengeResult,
  QuestionResponse,
  SectionResult,
} from "@/app/cat-prep/models/dailyChallenge";

const SECTION_ORDER: PyqSection[] = ["VARC", "DILR", "QA"];

const QUESTIONS_COLLECTION = "cracku_pyq_questions";
const COMPREHENSIONS_COLLECTION = "cracku_pyq_comprehensions";
const ATTEMPTS_COLLECTION = "pyq_attempts";

// Fields a question doc carries that must never reach a browse/paper response.
const ANSWER_FIELDS = { correctOptionIndex: 0, correctAnswer: 0, explanation: 0 } as const;

// ---- Raw MongoDB document types ----

type PyqQuestionDoc = {
  _id: ObjectId;
  paperSlug: string;
  examYear: number;
  examSlot: number | null;
  section: PyqSection;
  questionNumber: number;
  type: PyqQuestionType;
  text: string | null;
  imageUrls: string[];
  imagePositions?: number[];
  options: PyqOption[] | null;
  correctOptionIndex?: number | null;
  correctAnswer?: string | null;
  explanation?: { text: string | null; imageUrls: string[]; imagePositions?: number[] };
  comprehensionId: ObjectId | null;
};

type PyqComprehensionDoc = {
  _id: ObjectId;
  text: string | null;
  imageUrls: string[];
  imagePositions?: number[];
};

// ---- Helpers ----

function toPyqQuestion(
  doc: PyqQuestionDoc,
  compMap: Map<string, PyqComprehensionDoc>
): PyqQuestion {
  const compId = doc.comprehensionId?.toString();
  const comp = compId ? compMap.get(compId) : undefined;
  if (compId && !comp) {
    console.warn(`[pyqQueries] question ${doc._id} references missing comprehension ${compId}`);
  }

  return {
    id: doc._id.toString(),
    questionNumber: doc.questionNumber,
    section: doc.section,
    type: doc.type,
    text: doc.text,
    imageUrls: doc.imageUrls,
    imagePositions: doc.imagePositions,
    options: doc.options
      ? doc.options.map(({ index, text, imageUrls }) => ({ index, text, imageUrls }))
      : null,
    comprehension: comp
      ? { id: comp._id.toString(), text: comp.text, imageUrls: comp.imageUrls, imagePositions: comp.imagePositions }
      : null,
  };
}

async function fetchComprehensionMap(
  questionDocs: PyqQuestionDoc[]
): Promise<Map<string, PyqComprehensionDoc>> {
  const compIds = [
    ...new Set(
      questionDocs.map((q) => q.comprehensionId?.toString()).filter((id): id is string => !!id)
    ),
  ];
  if (compIds.length === 0) return new Map();

  const db = await getDb();
  const compDocs = await db
    .collection<PyqComprehensionDoc>(COMPREHENSIONS_COLLECTION)
    .find({ _id: { $in: compIds.map((id) => new ObjectId(id)) } })
    .toArray();
  return new Map(compDocs.map((c) => [c._id.toString(), c]));
}

// ---- Public API ----

/**
 * Lists all scraped papers with per-section question counts, ordered by the
 * static PYQ_PAPERS list. Papers with no scraped data yet are omitted.
 */
export async function fetchPyqPapersIndex(): Promise<PyqPaperSummary[]> {
  const db = await getDb();
  const rows = await db
    .collection<PyqQuestionDoc>(QUESTIONS_COLLECTION)
    .aggregate<{ _id: { paperSlug: string; section: PyqSection }; count: number }>([
      { $group: { _id: { paperSlug: "$paperSlug", section: "$section" }, count: { $sum: 1 } } },
    ])
    .toArray();

  const countsByPaper = new Map<string, Partial<Record<PyqSection, number>>>();
  for (const { _id, count } of rows) {
    const existing = countsByPaper.get(_id.paperSlug) ?? {};
    existing[_id.section] = count;
    countsByPaper.set(_id.paperSlug, existing);
  }

  return PYQ_PAPERS.filter((p) => countsByPaper.has(p.slug)).map((p) => ({
    paperSlug: p.slug,
    examYear: p.examYear,
    examSlot: p.examSlot,
    sectionCounts: countsByPaper.get(p.slug) ?? {},
  }));
}

// Loads a paper's question docs (ordered) with their comprehensions resolved.
// `includeAnswers` decides at the *query* level whether answer fields are read at all,
// so an answer-free caller cannot leak one by forgetting to strip a field when mapping.
async function loadPaperDocs(
  paperSlug: string,
  includeAnswers: boolean
): Promise<{ questionDocs: PyqQuestionDoc[]; compMap: Map<string, PyqComprehensionDoc> } | null> {
  const db = await getDb();
  const questionDocs = await db
    .collection<PyqQuestionDoc>(QUESTIONS_COLLECTION)
    .find({ paperSlug }, includeAnswers ? {} : { projection: ANSWER_FIELDS })
    .sort({ questionNumber: 1 })
    .toArray();
  if (questionDocs.length === 0) return null;

  return { questionDocs, compMap: await fetchComprehensionMap(questionDocs) };
}

function groupBySection<T>(
  questionDocs: PyqQuestionDoc[],
  map: (doc: PyqQuestionDoc) => T
): { name: PyqSection; questions: T[] }[] {
  const bySection = new Map<PyqSection, T[]>(SECTION_ORDER.map((name) => [name, []]));
  for (const doc of questionDocs) {
    bySection.get(doc.section)?.push(map(doc));
  }
  return SECTION_ORDER.map((name) => ({ name, questions: bySection.get(name) ?? [] }));
}

// The static PYQ_PAPERS entry is authoritative; the scraped doc is the fallback for a
// paper that has data but no constants entry yet.
function resolvePaperMeta(paperSlug: string, first: PyqQuestionDoc) {
  const meta = getPyqPaper(paperSlug);
  return {
    paperSlug,
    examYear: meta?.examYear ?? first.examYear,
    examSlot: meta?.examSlot ?? first.examSlot,
  };
}

/**
 * Fetches a full paper as flat per-section question lists (VARC -> DILR -> QA),
 * each question carrying its shared comprehension inline (if any). Answers and
 * explanations are excluded at the query level, not just omitted when mapping.
 */
export async function fetchPyqPaper(paperSlug: string): Promise<PyqPaper | null> {
  const loaded = await loadPaperDocs(paperSlug, false);
  if (!loaded) return null;
  const { questionDocs, compMap } = loaded;

  return {
    ...resolvePaperMeta(paperSlug, questionDocs[0]),
    sections: groupBySection(questionDocs, (doc) => toPyqQuestion(doc, compMap)),
  };
}

/**
 * The same paper with every answer key and explanation attached, for the server-rendered
 * "full paper with solutions" section. Kept separate from `fetchPyqPaper` so the browse
 * player and the mock test keep reading an answer-free shape.
 */
export async function fetchPyqPaperSolutions(paperSlug: string): Promise<PyqSolvedPaper | null> {
  const loaded = await loadPaperDocs(paperSlug, true);
  if (!loaded) return null;
  const { questionDocs, compMap } = loaded;

  return {
    ...resolvePaperMeta(paperSlug, questionDocs[0]),
    sections: groupBySection(questionDocs, (doc) => ({
      ...toPyqQuestion(doc, compMap),
      correctOptionIndex: doc.correctOptionIndex ?? null,
      correctAnswer: doc.correctAnswer ?? null,
      explanation: doc.explanation ?? { text: null, imageUrls: [] },
    })),
  };
}

// ---- Mock test ----

function getPyqMockSectionTimeLimitSeconds(): number {
  const raw = process.env.PYQ_MOCK_SECTION_TIME_SECONDS;
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 2400;
}

/**
 * Builds a timed, 3-section mock test from the same flat paper data `fetchPyqPaper`
 * returns, just reshaped into the DailyTest sectioned-test format. Answers are
 * already excluded by `fetchPyqPaper`'s query-level projection.
 */
export async function fetchPyqMockTest(paperSlug: string): Promise<DailyTest | null> {
  const paper = await fetchPyqPaper(paperSlug);
  if (!paper) return null;

  const sectionTimeLimit = getPyqMockSectionTimeLimitSeconds();

  const sections: TestSection[] = paper.sections.map((s) => ({
    name: s.name,
    timeLimitSeconds: sectionTimeLimit,
    questions: s.questions.map((q, i) => ({
      questionId: q.id,
      order: i + 1,
      type: q.type,
      text: q.text ?? "",
      imageUrls: q.imageUrls,
      imagePositions: q.imagePositions,
      options: q.options
        ? q.options.map((o) => ({ index: o.index, text: o.text, imageUrls: o.imageUrls }))
        : null,
      // CAT has no per-question time limit — only a per-section budget
      timeLimitSeconds: null,
      comprehension: q.comprehension
        ? { text: q.comprehension.text ?? "", imageUrls: q.comprehension.imageUrls, imagePositions: q.comprehension.imagePositions }
        : null,
    })),
  }));

  return { testId: paperSlug, sections };
}

/**
 * Builds the same sectioned DailyTest shape as `fetchPyqMockTest`, but for the
 * post-submission review screen: answers and explanations are included since the
 * attempt is already graded, so there's nothing left to leak.
 */
export async function fetchPyqMockReviewTest(paperSlug: string): Promise<DailyTest | null> {
  const db = await getDb();
  const questionDocs = await db
    .collection<PyqQuestionDoc>(QUESTIONS_COLLECTION)
    .find({ paperSlug })
    .sort({ questionNumber: 1 })
    .toArray();
  if (questionDocs.length === 0) return null;

  const compMap = await fetchComprehensionMap(questionDocs);
  const sectionTimeLimit = getPyqMockSectionTimeLimitSeconds();

  const questionsBySection = new Map<PyqSection, Question[]>(
    SECTION_ORDER.map((name) => [name, []])
  );
  for (const doc of questionDocs) {
    const compId = doc.comprehensionId?.toString();
    const comp = compId ? compMap.get(compId) : undefined;
    questionsBySection.get(doc.section)?.push({
      questionId: doc._id.toString(),
      order: doc.questionNumber,
      type: doc.type,
      text: doc.text ?? "",
      imageUrls: doc.imageUrls,
      imagePositions: doc.imagePositions,
      options: doc.options
        ? doc.options.map((o) => ({ index: o.index, text: o.text, imageUrls: o.imageUrls }))
        : null,
      timeLimitSeconds: null,
      comprehension: comp ? { text: comp.text ?? "", imageUrls: comp.imageUrls, imagePositions: comp.imagePositions } : null,
      explanation: doc.explanation
        ? { text: doc.explanation.text, imageUrls: doc.explanation.imageUrls, imagePositions: doc.explanation.imagePositions }
        : null,
    });
  }

  const sections: TestSection[] = SECTION_ORDER.map((name) => ({
    name,
    timeLimitSeconds: sectionTimeLimit,
    questions: questionsBySection.get(name) ?? [],
  }));

  return { testId: paperSlug, sections };
}

/**
 * Grades the user's mock-test answers (+3/-1 MCQ, +3/0 TITA, matching real CAT
 * marking), saves the attempt, and returns the full result. Throws if an attempt
 * already exists for this (paperSlug, uid) pair.
 */
export async function gradeAndSavePyqMockAttempt(params: {
  paperSlug: string;
  uid: string;
  responses: Record<string, number | null>;
  timings: Record<string, number>;
  totalTimeSeconds: number;
}): Promise<DailyChallengeResult> {
  const { paperSlug, uid, responses, timings, totalTimeSeconds } = params;
  const db = await getDb();

  const existing = await db
    .collection(ATTEMPTS_COLLECTION)
    .findOne({ paperSlug, userId: uid }, { projection: { _id: 1 } });
  if (existing) throw new DuplicatePyqAttemptError();

  const questionDocs = await db
    .collection<PyqQuestionDoc>(QUESTIONS_COLLECTION)
    .find({ paperSlug })
    .sort({ questionNumber: 1 })
    .toArray();
  if (questionDocs.length === 0) throw new Error(`No questions found for paper: ${paperSlug}`);

  let totalScore = 0;
  let totalMarks = 0;
  const sections: SectionResult[] = SECTION_ORDER.map((name) => {
    const sectionQuestions = questionDocs.filter((q) => q.section === name);
    let sectionScore = 0;
    const sectionMarks = sectionQuestions.length * 3;
    const sectionResponses: Record<string, QuestionResponse> = {};

    for (const q of sectionQuestions) {
      const qid = q._id.toString();
      const given = responses[qid] ?? null;
      let correct = false;
      let marks = 0;
      let correctAnswer: number | null = null;

      if (q.type === "mcq") {
        correctAnswer = q.correctOptionIndex ?? null;
        if (given !== null && correctAnswer !== null) {
          correct = given === correctAnswer;
          marks = correct ? 3 : -1;
        }
      } else {
        const expectedNum = q.correctAnswer != null ? parseFloat(q.correctAnswer) : null;
        correctAnswer = expectedNum;
        if (given !== null && expectedNum !== null) {
          const g = Math.round(given * 100) / 100;
          const e = Math.round(expectedNum * 100) / 100;
          correct = g === e;
          marks = correct ? 3 : 0;
        }
      }

      sectionScore += marks;
      sectionResponses[qid] = {
        type: q.type,
        given,
        correct,
        marks,
        correctAnswer,
        timeSpentSeconds: timings[qid] ?? 0,
      };
    }

    totalScore += sectionScore;
    totalMarks += sectionMarks;
    return { name, score: sectionScore, totalMarks: sectionMarks, responses: sectionResponses };
  });

  const completedAt = new Date();
  const result: DailyChallengeResult = {
    testId: paperSlug,
    score: totalScore,
    totalMarks,
    totalTimeSeconds,
    completedAt,
    sections,
  };

  await db.collection(ATTEMPTS_COLLECTION).insertOne({
    paperSlug,
    userId: uid,
    score: totalScore,
    totalQuestions: questionDocs.length,
    totalMarks,
    totalTimeSeconds,
    createdAt: completedAt,
    result: { ...result, completedAt: completedAt.toISOString() },
  });

  return result;
}

/**
 * Retrieves a stored PYQ mock-test attempt. Returns null if not found.
 */
export async function getStoredPyqMockResult(
  uid: string,
  paperSlug: string
): Promise<DailyChallengeResult | null> {
  const db = await getDb();
  const doc = await db
    .collection<{ result: SerializedDailyChallengeResult }>(ATTEMPTS_COLLECTION)
    .findOne({ paperSlug, userId: uid });
  if (!doc) return null;

  return { ...doc.result, completedAt: new Date(doc.result.completedAt) };
}

/**
 * Per-paper count of mock-test questions actually answered (given !== null),
 * across every attempt this user has submitted. Used for the PYQ progress bar.
 */
export async function getPyqMockAnsweredCounts(uid: string): Promise<Record<string, number>> {
  const db = await getDb();
  const docs = await db
    .collection<{ paperSlug: string; result: SerializedDailyChallengeResult }>(ATTEMPTS_COLLECTION)
    .find({ userId: uid }, { projection: { paperSlug: 1, "result.sections": 1 } })
    .toArray();

  const counts: Record<string, number> = {};
  for (const doc of docs) {
    counts[doc.paperSlug] = doc.result.sections.reduce(
      (sum, section) => sum + Object.values(section.responses).filter((r) => r.given !== null).length,
      0
    );
  }
  return counts;
}

export class DuplicatePyqAttemptError extends Error {
  constructor() {
    super("Mock test already submitted for this paper.");
    this.name = "DuplicatePyqAttemptError";
  }
}
