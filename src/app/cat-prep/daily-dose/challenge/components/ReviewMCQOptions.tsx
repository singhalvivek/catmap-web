// ReviewMCQOptions — read-only option list for review screens; highlights selected vs correct answer
import type { QuestionOption } from "../../../models/dailyChallenge";
import MathText from "./MathText";

type Props = {
  options: QuestionOption[];
  selectedIndex: number | null;
  correctIndex: number | null;
};

export default function ReviewMCQOptions({ options, selectedIndex, correctIndex }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const isCorrect = opt.index === correctIndex;
        const isSelected = opt.index === selectedIndex;

        let border = "1.5px solid #E2E8F0";
        let background = "#fff";
        let color = "#334155";
        if (isCorrect) {
          border = "1.5px solid #16A34A";
          background = "#F0FDF4";
          color = "#166534";
        } else if (isSelected) {
          border = "1.5px solid #DC2626";
          background = "#FEF2F2";
          color = "#991B1B";
        }

        return (
          <div
            key={opt.index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 10,
              border,
              background,
              color,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                border: "1.5px solid currentColor",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 800,
                flexShrink: 0,
                opacity: isCorrect || isSelected ? 1 : 0.5,
              }}
            >
              {String.fromCharCode(65 + opt.index)}
            </span>

            {opt.imageUrls.length > 0 ? (
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                {opt.imageUrls.map((url) => (
                  /* image origin is scraper-supplied and unknown at build time */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={url}
                    src={url}
                    alt={`Option ${String.fromCharCode(65 + opt.index)}`}
                    style={{ maxHeight: 60, borderRadius: 4 }}
                  />
                ))}
              </span>
            ) : (
              <span style={{ flex: 1 }}>
                <MathText text={opt.text ?? ""} />
              </span>
            )}

            {(isSelected || isCorrect) && (
              <div className="flex gap-1" style={{ flexShrink: 0 }}>
                {isSelected && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(0,0,0,0.06)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Your answer
                  </span>
                )}
                {isCorrect && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(0,0,0,0.06)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Correct
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
