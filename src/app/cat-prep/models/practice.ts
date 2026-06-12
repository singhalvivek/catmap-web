// practice — domain types for percentyl practice question collections

export type PracticeSection = "Quant" | "DILR" | "VARC";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Level = "Hard" | "Medium" | "Medium-Hard";

// Options dict stored in MongoDB
export type OptionsMap = { A: string; B: string; C: string; D: string };

// ---- percentyl_practice_questions ----

export type PracticeQuestion = {
  _id: string;
  section: PracticeSection;
  topic: string;
  chapter: string;
  difficulty: Difficulty;
  batch_number: number;
  question_number: number;
  question_type: "mcq" | "jumble";
  question: string;
  options: OptionsMap;
  // correct_answer and explanation are omitted from question responses;
  // only returned by the /solution endpoint
};

export type PracticeQuestionSolution = {
  _id: string;
  correct_answer: string;
  correct_text: string | null;
  explanation: string | null;
  solution_svg: string | null;
};

// ---- percentyl_dilr_sets ----

export type DilrQuestion = {
  number: number;
  question: string;
  options: OptionsMap;
};

export type DilrSet = {
  _id: string;
  section: "DILR";
  chapter: string;
  set_number: number;
  level: Level;
  passage: string;
  question_svg: string | null;
  questions: DilrQuestion[];
};

export type DilrSolution = {
  solution_text: string;
  solution_svg: string | null;
  answers: Record<number, string>;
};

// ---- percentyl_rcs ----

export type RcQuestion = {
  number: number;
  question: string;
  options: OptionsMap;
};

export type RcPassage = {
  _id: string;
  section: "VARC";
  chapter: string;
  rc_number: number;
  level: Level;
  passage_paragraphs: string[];
  para_summaries: string[];
  questions: RcQuestion[];
};

export type RcQuestionSolution = {
  correct_answer: string;
  explanation: string | null;
};
