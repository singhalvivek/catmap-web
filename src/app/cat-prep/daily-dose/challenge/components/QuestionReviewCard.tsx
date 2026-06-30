// QuestionReviewCard — full question review card: mirrors the live test layout (passage,
// question, image, options) but with answers locked and correctness highlighted
import type { Question, QuestionResponse } from "../../../models/dailyChallenge";
import ComprehensionBlock from "./ComprehensionBlock";
import MathText from "./MathText";
import ReviewMCQOptions from "./ReviewMCQOptions";
import ReviewTITAAnswer from "./ReviewTITAAnswer";

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

type Props = {
  question: Question;
  response: QuestionResponse | undefined;
  questionNumber: number;
};

export default function QuestionReviewCard({ question, response, questionNumber }: Props) {
  const isUnattempted = response === undefined || response.given === null;
  const isCorrect = response?.correct === true;

  let statusColor = "#64748B";
  let statusLabel = "Unattempted";
  let cardBorder = "#E8EAF0";

  if (!isUnattempted) {
    if (isCorrect) {
      statusColor = "#166534";
      statusLabel = "Correct";
      cardBorder = "#BBF7D0";
    } else {
      statusColor = "#991B1B";
      statusLabel = "Wrong";
      cardBorder = "#FECACA";
    }
  }

  const marks = response?.marks ?? 0;
  const timeSpent = response?.timeSpentSeconds ?? 0;
  const given = response?.given ?? null;
  const correctAnswer = response?.correctAnswer ?? null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1.5px solid ${cardBorder}`,
        padding: "20px 22px",
        marginBottom: 14,
      }}
    >
      {/* Header: Q number, type, time, status, marks */}
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-2">
          <span
            className="font-bold text-slate-400"
            style={{ fontSize: 11, letterSpacing: "0.4px", textTransform: "uppercase" }}
          >
            Q{questionNumber} · {question.type === "mcq" ? "MCQ" : "TITA"}
          </span>
          <span className="text-slate-400" style={{ fontSize: 11 }}>
            {formatTime(timeSpent)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>{statusLabel}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: statusColor, minWidth: 28, textAlign: "right" }}>
            {marks > 0 ? `+${marks}` : marks}
          </span>
        </div>
      </div>

      {question.comprehension && <ComprehensionBlock comprehension={question.comprehension} />}

      <p
        className="font-semibold text-trust-navy"
        style={{ fontSize: 15, lineHeight: 1.75, margin: "0 0 14px" }}
      >
        <MathText text={question.text} />
      </p>

      {question.imageUrl && (
        /* imageUrl origin is user-supplied and unknown at build time */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={question.imageUrl}
          alt="Question diagram"
          style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 16 }}
        />
      )}

      {question.type === "mcq" && question.options ? (
        <ReviewMCQOptions options={question.options} selectedIndex={given} correctIndex={correctAnswer} />
      ) : (
        <ReviewTITAAnswer given={given} correctAnswer={correctAnswer} isCorrect={isCorrect} />
      )}

      {question.explanation?.text && (
        <div
          style={{
            marginTop: 16,
            padding: "14px 16px",
            borderRadius: 10,
            border: "1.5px solid #E2E8F0",
            background: "#F8FAFC",
          }}
        >
          <span
            className="font-bold text-slate-400"
            style={{
              fontSize: 10,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 8,
            }}
          >
            Explanation
          </span>
          <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>
            <MathText text={question.explanation.text} />
          </p>
          {question.explanation.imageUrls.map((url) => (
            /* imageUrl origin is scraper-supplied and unknown at build time */
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="Explanation diagram" style={{ maxWidth: "100%", borderRadius: 8, marginTop: 10 }} />
          ))}
        </div>
      )}
    </div>
  );
}
