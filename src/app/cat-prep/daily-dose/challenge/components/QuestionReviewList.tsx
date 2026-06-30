// QuestionReviewList — renders a full review card per question (passage, options, your answer vs correct)
"use client";

import type { Question, QuestionResponse } from "../../../models/dailyChallenge";
import QuestionReviewCard from "./QuestionReviewCard";

type Props = {
  questions: Question[];
  responses: Record<string, QuestionResponse>;
};

export default function QuestionReviewList({ questions, responses }: Props) {
  return (
    <div style={{ marginTop: 10 }}>
      {questions.map((q, idx) => (
        <QuestionReviewCard
          key={q.questionId}
          question={q}
          response={responses[q.questionId]}
          questionNumber={idx + 1}
        />
      ))}
    </div>
  );
}
