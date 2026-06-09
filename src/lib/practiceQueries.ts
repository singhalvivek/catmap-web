// practiceQueries — server-side MongoDB query functions for practice question collections
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type {
  PracticeQuestion,
  PracticeQuestionSolution,
  DilrSet,
  DilrQuestion,
  DilrSolution,
  RcPassage,
  RcQuestion,
  RcQuestionSolution,
  OptionsMap,
} from "@/app/cat-prep/models/practice";

// ---- Raw MongoDB document types ----

type PracticeQuestionDoc = {
  _id: ObjectId;
  section: string;
  topic: string;
  chapter: string;
  difficulty: string;
  batch_number: number;
  question_number: number;
  question_type: "mcq" | "jumble";
  question: string;
  options: OptionsMap;
  correct_answer: string;
  correct_text: string | null;
  explanation: string | null;
  solution_svg: string | null;
};

type DilrSetDoc = {
  _id: ObjectId;
  section: string;
  chapter: string;
  set_number: number;
  level: string;
  passage: string;
  question_svg: string | null;
  questions: Array<{
    number: number;
    question: string;
    options: OptionsMap;
    correct_answer: string;
    explanation: string | null;
  }>;
  solution_text: string;
  solution_svg: string | null;
};

type RcPassageDoc = {
  _id: ObjectId;
  section: string;
  chapter: string;
  rc_number: number;
  level: string;
  passage_paragraphs: string[];
  para_summaries: string[];
  questions: Array<{
    number: number;
    question: string;
    options: OptionsMap;
    correct_answer: string;
    explanation: string | null;
  }>;
};

// ---- Practice Questions ----

export async function fetchPracticeQuestions(
  section: string,
  topic: string,
  chapter: string
): Promise<PracticeQuestion[]> {
  const db = await getDb();
  const docs = await db
    .collection<PracticeQuestionDoc>("percentyl_practice_questions")
    .find({ section, topic, chapter })
    .sort({ question_number: 1 })
    .toArray();

  return docs.map(({ _id, correct_answer, correct_text, explanation, solution_svg, ...rest }) => ({
    ...rest,
    _id: _id.toString(),
    section: rest.section as PracticeQuestion["section"],
    difficulty: rest.difficulty as PracticeQuestion["difficulty"],
  }));
}

export async function fetchPracticeQuestionSolution(
  id: string
): Promise<PracticeQuestionSolution | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection<PracticeQuestionDoc>("percentyl_practice_questions")
    .findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return {
    _id: doc._id.toString(),
    correct_answer: doc.correct_answer,
    correct_text: doc.correct_text,
    explanation: doc.explanation,
    solution_svg: doc.solution_svg,
  };
}

// ---- DILR Sets ----

export async function fetchDilrSets(chapter: string): Promise<DilrSet[]> {
  const db = await getDb();
  const docs = await db
    .collection<DilrSetDoc>("percentyl_dilr_sets")
    .find({ chapter })
    .sort({ set_number: 1 })
    .toArray();

  return docs.map((doc) => ({
    _id: doc._id.toString(),
    section: "DILR" as const,
    chapter: doc.chapter,
    set_number: doc.set_number,
    level: doc.level as DilrSet["level"],
    passage: doc.passage,
    question_svg: doc.question_svg,
    questions: doc.questions.map(({ correct_answer, explanation, ...q }): DilrQuestion => q),
  }));
}

export async function fetchDilrSet(
  chapter: string,
  setNumber: number
): Promise<DilrSet | null> {
  const db = await getDb();
  const doc = await db
    .collection<DilrSetDoc>("percentyl_dilr_sets")
    .findOne({ chapter, set_number: setNumber });
  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    section: "DILR" as const,
    chapter: doc.chapter,
    set_number: doc.set_number,
    level: doc.level as DilrSet["level"],
    passage: doc.passage,
    question_svg: doc.question_svg,
    questions: doc.questions.map(({ correct_answer, explanation, ...q }): DilrQuestion => q),
  };
}

export async function fetchDilrSolution(
  chapter: string,
  setNumber: number
): Promise<DilrSolution | null> {
  const db = await getDb();
  const doc = await db
    .collection<DilrSetDoc>("percentyl_dilr_sets")
    .findOne({ chapter, set_number: setNumber });
  if (!doc) return null;

  const answers: Record<number, string> = {};
  for (const q of doc.questions) {
    answers[q.number] = q.correct_answer;
  }

  return {
    solution_text: doc.solution_text,
    solution_svg: doc.solution_svg,
    answers,
  };
}

// ---- RC Passages ----

export async function fetchRcPassage(rcNumber: number): Promise<RcPassage | null> {
  const db = await getDb();
  const doc = await db
    .collection<RcPassageDoc>("percentyl_rcs")
    .findOne({ rc_number: rcNumber });
  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    section: "VARC" as const,
    chapter: doc.chapter,
    rc_number: doc.rc_number,
    level: doc.level as RcPassage["level"],
    passage_paragraphs: doc.passage_paragraphs,
    para_summaries: doc.para_summaries,
    questions: doc.questions.map(({ correct_answer, explanation, ...q }): RcQuestion => q),
  };
}

export async function fetchRcQuestionSolution(
  rcNumber: number,
  qNum: number
): Promise<RcQuestionSolution | null> {
  const db = await getDb();
  const doc = await db
    .collection<RcPassageDoc>("percentyl_rcs")
    .findOne({ rc_number: rcNumber });
  if (!doc) return null;

  const q = doc.questions.find((q) => q.number === qNum);
  if (!q) return null;

  return {
    correct_answer: q.correct_answer,
    explanation: q.explanation,
  };
}
