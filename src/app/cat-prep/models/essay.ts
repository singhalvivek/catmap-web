// essay — types for daily Aeon essay and community responses

export type DailyEssay = {
  date: string;
  title: string;
  url: string;
  author: string;
  excerpt: string;
};

export type EssaySubmissionView = {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string | null;
  answers: Record<string, string>;
  submittedAt: string;
  // per-question vote data (keyed by questionId: "q1"–"q4")
  questionScores: Record<string, number>;
  questionUserVotes: Record<string, 1 | -1 | 0>;
};
