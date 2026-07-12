// QuestionRenderer — orchestrates comprehension, question text, image, and answer input
"use client";

import type { Question } from "../../../models/dailyChallenge";
import ComprehensionBlock from "./ComprehensionBlock";
import InlineImageText from "./InlineImageText";
import MathText from "./MathText";
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
        <InlineImageText
          text={question.text}
          imageUrls={question.imageUrls}
          imagePositions={question.imagePositions}
          imgAlt="Question diagram"
          imgStyle={{ maxWidth: "100%", borderRadius: 8, marginTop: 12, marginBottom: 4 }}
          renderParagraph={(segment, key) => (
            <p
              key={key}
              className="font-semibold text-trust-navy"
              style={{ fontSize: 15, lineHeight: 1.75, margin: 0, marginBottom: 8 }}
            >
              <MathText text={segment} />
            </p>
          )}
        />
      </div>

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
