// dailyQuizQueries — server-side functions: fetch quiz, grade attempt, retrieve result
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type {
  DailyTest,
  DailyChallengeResult,
  SerializedDailyChallengeResult,
  QuestionResponse,
} from "@/app/cat-prep/models/dailyChallenge";

// ---- MongoDB document types ----

type QuizDoc = {
  _id: ObjectId;
  date: string;
  subject: string;
  isComprehension: boolean;
  comprehensionId?: ObjectId;
  questionIds: ObjectId[];
};

type QuestionDoc = {
  _id: ObjectId;
  type: "mcq" | "tita";
  text: string;
  imageUrls: string[];
  options?: { index: number; text: string; imageUrls: string[] }[];
  correctOptionIndex?: number;
  correctAnswer?: string;
  comprehension_id?: ObjectId;
};

type ComprehensionDoc = {
  _id: ObjectId;
  text: string;
  imageUrls: string[];
};

// Stored attempt — includes full result object for easy retrieval
type AttemptDoc = {
  _id: ObjectId;
  date: string;
  userId: string;
  score: number;
  totalQuestions: number;
  totalMarks: number;
  totalTimeSeconds: number;
  createdAt: Date;
  result: SerializedDailyChallengeResult;
};

// ---- Time limit helpers ----

function getSectionTimeLimitSeconds(): number {
  const raw = process.env.DAILY_CHALLENGE_SECTION_TIME_SECONDS;
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 600;
}

function getQuestionTimeLimitSeconds(): number | null {
  const raw = process.env.DAILY_CHALLENGE_QUESTION_TIME_SECONDS;
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ---- Public API ----

/**
 * Fetch today's quiz from MongoDB and return a DailyTest (without correct answers).
 * Returns null when no quiz is scheduled for the given date.
 */
export async function fetchDailyTest(date: string): Promise<DailyTest | null> {
  const db = await getDb();

  const quiz = await db.collection<QuizDoc>("daily_quizzes").findOne({ date });
  if (!quiz) return null;

  const questionDocs = await db
    .collection<QuestionDoc>("cracku_pyq_questions")
    .find({ _id: { $in: quiz.questionIds } })
    .toArray();

  // Treat a quiz with no resolvable questions as "no challenge today" rather than
  // returning an empty test (an empty question set crashes the test player).
  if (questionDocs.length === 0) return null;

  // Sort questions to match the order declared in questionIds
  const questionOrder = new Map(
    quiz.questionIds.map((id, i) => [id.toString(), i])
  );
  questionDocs.sort(
    (a, b) =>
      (questionOrder.get(a._id.toString()) ?? 0) -
      (questionOrder.get(b._id.toString()) ?? 0)
  );

  let comprehension: { text: string; imageUrls: string[] } | null = null;
  if (quiz.isComprehension && quiz.comprehensionId) {
    const comp = await db
      .collection<ComprehensionDoc>("cracku_pyq_comprehensions")
      .findOne({ _id: quiz.comprehensionId });
    if (comp) {
      comprehension = { text: comp.text, imageUrls: comp.imageUrls };
    }
  }

  const questionTimeLimit = getQuestionTimeLimitSeconds();

  const questions = questionDocs.map((q, i) => ({
    questionId: q._id.toString(),
    order: i + 1,
    type: q.type,
    text: q.text,
    imageUrls: q.imageUrls,
    options: q.options
      ? q.options.map((o) => ({
          index: o.index,
          text: o.text ?? null,
          imageUrls: o.imageUrls,
        }))
      : null,
    timeLimitSeconds: questionTimeLimit,
    comprehension,
  }));

  return {
    testId: date,
    sections: [
      {
        name: quiz.subject,
        timeLimitSeconds: getSectionTimeLimitSeconds(),
        questions,
      },
    ],
  };
}

/**
 * Grade the user's answers, save the attempt to MongoDB, and return the full result.
 * Throws if the attempt already exists (duplicate submission).
 */
export async function gradeAndSaveAttempt(params: {
  date: string;
  uid: string;
  responses: Record<string, number | null>;
  timings: Record<string, number>;
  totalTimeSeconds: number;
}): Promise<DailyChallengeResult> {
  const { date, uid, responses, timings, totalTimeSeconds } = params;
  const db = await getDb();

  // Guard: reject duplicate attempts
  const existing = await db
    .collection<AttemptDoc>("quiz_attempts")
    .findOne({ date, userId: uid }, { projection: { _id: 1 } });
  if (existing) throw new DuplicateAttemptError();

  const quiz = await db.collection<QuizDoc>("daily_quizzes").findOne({ date });
  if (!quiz) throw new Error(`No quiz found for date: ${date}`);

  const questionDocs = await db
    .collection<QuestionDoc>("cracku_pyq_questions")
    .find({ _id: { $in: quiz.questionIds } })
    .toArray();

  const questionOrder = new Map(
    quiz.questionIds.map((id, i) => [id.toString(), i])
  );
  questionDocs.sort(
    (a, b) =>
      (questionOrder.get(a._id.toString()) ?? 0) -
      (questionOrder.get(b._id.toString()) ?? 0)
  );

  // Grade
  let totalScore = 0;
  const totalMarks = questionDocs.length * 3;
  const sectionResponses: Record<string, QuestionResponse> = {};

  for (const q of questionDocs) {
    const qid = q._id.toString();
    const given = responses[qid] ?? null;
    let correct = false;
    let marks = 0;
    let correctAnswer: number | null = null;

    if (q.type === "mcq") {
      correctAnswer =
        q.correctOptionIndex !== undefined ? q.correctOptionIndex : null;
      if (given !== null && correctAnswer !== null) {
        correct = given === correctAnswer;
        marks = correct ? 3 : -1;
      }
    } else {
      // TITA — correctAnswer stored as string in DB; compare rounded to 2dp
      const expectedNum =
        q.correctAnswer != null ? parseFloat(q.correctAnswer) : null;
      correctAnswer = expectedNum;
      if (given !== null && expectedNum !== null) {
        const g = Math.round(given * 100) / 100;
        const e = Math.round(expectedNum * 100) / 100;
        correct = g === e;
        marks = correct ? 3 : 0;
      }
    }

    totalScore += marks;
    sectionResponses[qid] = {
      type: q.type,
      given,
      correct,
      marks,
      correctAnswer,
      timeSpentSeconds: timings[qid] ?? 0,
    };
  }

  const completedAt = new Date();

  const result: DailyChallengeResult = {
    testId: date,
    score: totalScore,
    totalMarks,
    totalTimeSeconds,
    completedAt,
    sections: [
      {
        name: quiz.subject,
        score: totalScore,
        totalMarks,
        responses: sectionResponses,
      },
    ],
  };

  await db.collection("quiz_attempts").insertOne({
    date,
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
 * Retrieve a stored attempt result from MongoDB. Returns null if not found.
 */
export async function getStoredResult(
  uid: string,
  date: string
): Promise<DailyChallengeResult | null> {
  const db = await getDb();
  const doc = await db
    .collection<AttemptDoc>("quiz_attempts")
    .findOne({ date, userId: uid });
  if (!doc) return null;

  return { ...doc.result, completedAt: new Date(doc.result.completedAt) };
}

export class DuplicateAttemptError extends Error {
  constructor() {
    super("Attempt already submitted for this date.");
    this.name = "DuplicateAttemptError";
  }
}
