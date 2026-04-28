// QuestionRenderer — orchestrates comprehension, question text, image, and answer input
"use client";

import type { Question } from "../../models/dailyChallenge";
import ComprehensionBlock from "./ComprehensionBlock";
import MCQOptions from "./MCQOptions";
import TITAInput from "./TITAInput";

type Props = {
  question: Question;
  questionNumber: number;
  response: number | null;
  onMCQSelect: (optionIndex: number) => void;
  onTITAChange: (value: number | null) => void;
};

export default function QuestionRenderer({
  question,
  questionNumber,
  response,
  onMCQSelect,
  onTITAChange,
}: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1.5px solid #E8EAF0",
        padding: "22px 24px",
      }}
    >
      {question.comprehension && (
        <ComprehensionBlock comprehension={question.comprehension} />
      )}

      {/* Question label + text */}
      <div className="mb-4">
        <span
          className="font-bold text-slate-400"
          style={{
            fontSize: 11,
            letterSpacing: "0.4px",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 6,
          }}
        >
          Q{questionNumber} · {question.type === "mcq" ? "MCQ" : "TITA"}
        </span>
        <p
          className="font-semibold text-trust-navy"
          style={{ fontSize: 15, lineHeight: 1.75, margin: 0 }}
        >
          {question.text}
        </p>
      </div>

      {/* Question image */}
      {question.imageUrl && (
        /* imageUrl origin is user-supplied and unknown at build time */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={question.imageUrl}
          alt="Question diagram"
          style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 16 }}
        />
      )}

      {/* Answer input */}
      {question.type === "mcq" && question.options ? (
        <MCQOptions
          options={question.options}
          selected={response}
          onSelect={onMCQSelect}
        />
      ) : (
        <TITAInput value={response} onChange={onTITAChange} />
      )}
    </div>
  );
}
