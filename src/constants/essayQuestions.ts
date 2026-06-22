// essayQuestions — fixed set of reflection questions shown for every daily essay

export const ESSAY_QUESTIONS = [
  { id: "q1", text: "Summarise the essay in 2–3 sentences." },
  { id: "q2", text: "What is the author's central argument or claim?" },
  { id: "q3", text: "Do you agree or disagree with the author? Give one reason." },
  { id: "q4", text: "Pick one word or idea from the essay and explain why it stood out to you." },
] as const;

export type EssayQuestionId = (typeof ESSAY_QUESTIONS)[number]["id"];
