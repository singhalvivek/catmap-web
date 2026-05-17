// dailyChallenge — types for daily challenge tests and saved results

export type QuestionType = "mcq" | "tita";

export type VisitStatus =
  | "not_visited"
  | "visited"
  | "answered"
  | "marked_for_review";

export type QuestionOption = {
  index: number;
  text: string | null;
  imageUrl: string | null;
};

export type Comprehension = {
  text: string;
  imageUrl: string | null;
};

export type Question = {
  questionId: string;
  order: number;
  type: QuestionType;
  text: string;
  imageUrl: string | null;
  options: QuestionOption[] | null;
  timeLimitSeconds: number | null;
  comprehension: Comprehension | null;
};

export type TestSection = {
  name: string;
  timeLimitSeconds: number;
  questions: Question[];
};

export type DailyTest = {
  testId: string;
  sections: TestSection[];
};

export type QuestionResponse = {
  type: QuestionType;
  given: number | null; // option index for MCQ, number for TITA, null = unattempted
  correct: boolean;
  marks: number;
  correctAnswer: number | null; // revealed server-side after submission
  timeSpentSeconds: number;
};

export type SectionResult = {
  name: string;
  score: number;
  totalMarks: number;
  responses: Record<string, QuestionResponse>;
};

export type DailyChallengeDraft = {
  testId: string;
  sectionIndex: number;
  questionIndex: number;
  sectionTimeLeft: number;
  responses: Record<string, number | null>;
  visitStatus: Record<string, VisitStatus>;
};

export type DailyChallengeResult = {
  testId: string;
  score: number;
  totalMarks: number;
  totalTimeSeconds: number;
  completedAt: Date;
  sections: SectionResult[];
};

// Wire-format version used in API responses and localStorage; completedAt is an ISO string
export type SerializedDailyChallengeResult = Omit<DailyChallengeResult, "completedAt"> & {
  completedAt: string;
};
