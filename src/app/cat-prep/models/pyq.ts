// pyq — domain types for scraped CAT previous-year-question papers (cracku_pyq_* collections)

export type PyqSection = "VARC" | "DILR" | "QA";
export type PyqQuestionType = "mcq" | "tita";

export type PyqOption = {
  index: number;
  text: string | null;
  imageUrls: string[];
};

export type PyqComprehension = {
  id: string;
  text: string | null;
  imageUrls: string[];
  imagePositions?: number[];
};

export type PyqQuestion = {
  id: string;
  questionNumber: number;
  section: PyqSection;
  type: PyqQuestionType;
  text: string | null;
  imageUrls: string[];
  imagePositions?: number[];
  options: PyqOption[] | null;
  comprehension: PyqComprehension | null;
};

// Flat, per-question shape (mirrors dailyChallenge's Question.comprehension) so this
// same data can feed both the browse player (which groups consecutive same-comprehension
// questions into a split-panel block as a presentation-only concern) and the mock-test
// transform (which wants a flat list) without one having to undo the other's grouping.
export type PyqSectionQuestions = {
  name: PyqSection;
  questions: PyqQuestion[];
};

export type PyqPaper = {
  paperSlug: string;
  examYear: number;
  examSlot: number | null;
  sections: PyqSectionQuestions[];
};

export type PyqExplanation = {
  text: string | null;
  imageUrls: string[];
  imagePositions?: number[];
};

export type PyqSolution = {
  type: PyqQuestionType;
  correctOptionIndex: number | null;
  correctAnswer: string | null;
  explanation: PyqExplanation;
};

// A question with its answer key attached. Only ever built for the server-rendered
// "full paper with solutions" section — the browse player and the mock test both read
// answer-free shapes so a solution can never reach them by accident.
export type PyqSolvedQuestion = PyqQuestion & {
  correctOptionIndex: number | null;
  correctAnswer: string | null;
  explanation: PyqExplanation;
};

export type PyqSolvedPaper = {
  paperSlug: string;
  examYear: number;
  examSlot: number | null;
  sections: { name: PyqSection; questions: PyqSolvedQuestion[] }[];
};

export type PyqPaperSummary = {
  paperSlug: string;
  examYear: number;
  examSlot: number | null;
  sectionCounts: Partial<Record<PyqSection, number>>;
};
