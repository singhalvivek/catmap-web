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
          className="font-semibold text-slate-500"
          style={{ fontSize: 12, display: "block", marginBottom: 6 }}
        >
          Your answer
        </label>
        <div
          style={{
            minWidth: 120,
            padding: "9px 14px",
            borderRadius: 9,
            border: `1.5px solid ${isUnattempted ? "#CBD5E1" : isCorrect ? "#16A34A" : "#DC2626"}`,
            background: isUnattempted ? "#F8FAFC" : isCorrect ? "#F0FDF4" : "#FEF2F2",
            color: isUnattempted ? "#94A3B8" : isCorrect ? "#166534" : "#991B1B",
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
            className="font-semibold text-slate-500"
            style={{ fontSize: 12, display: "block", marginBottom: 6 }}
          >
            Correct answer
          </label>
          <div
            style={{
              minWidth: 120,
              padding: "9px 14px",
              borderRadius: 9,
              border: "1.5px solid #16A34A",
              background: "#F0FDF4",
              color: "#166534",
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
