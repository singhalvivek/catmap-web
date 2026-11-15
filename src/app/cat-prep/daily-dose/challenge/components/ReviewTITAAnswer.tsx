// ReviewTITAAnswer — read-only your-answer vs correct-answer display for TITA review
type Props = {
  given: number | null;
  correctAnswer: number | null;
  isCorrect: boolean;
};

export default function ReviewTITAAnswer({ given, correctAnswer, isCorrect }: Props) {
  const isUnattempted = given === null;

  return (
    <div className="flex gap-3" style={{ paddingTop: 4 }}>
      <div>
        <label
          className="font-semibold ed-muted"
          style={{ fontSize: 12, display: "block", marginBottom: 6 }}
        >
          Your answer
        </label>
        <div
          style={{
            minWidth: 120,
            padding: "9px 14px",
            border: `1.5px solid ${isUnattempted ? "var(--rule-firm)" : isCorrect ? "var(--correct-text)" : "var(--wrong-text)"}`,
            background: isUnattempted ? "var(--paper-sunk)" : isCorrect ? "var(--correct-wash)" : "var(--wrong-wash)",
            color: isUnattempted ? "var(--inert-text)" : isCorrect ? "var(--correct-text)" : "var(--wrong-text)",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {isUnattempted ? "Not attempted" : given}
        </div>
      </div>

      {!isCorrect && (
        <div>
          <label
            className="font-semibold ed-muted"
            style={{ fontSize: 12, display: "block", marginBottom: 6 }}
          >
            Correct answer
          </label>
          <div
            style={{
              minWidth: 120,
              padding: "9px 14px",
              border: "1.5px solid var(--correct-text)",
              background: "var(--correct-wash)",
              color: "var(--correct-text)",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {correctAnswer}
          </div>
        </div>
      )}
    </div>
  );
}
