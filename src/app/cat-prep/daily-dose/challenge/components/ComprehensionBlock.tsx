// ComprehensionBlock — renders the reading passage with its images placed inline
import type { Comprehension } from "../../../models/dailyChallenge";
import MathText from "./MathText";
import InlineImageText from "./InlineImageText";

export default function ComprehensionBlock({
  comprehension,
}: {
  comprehension: Comprehension;
}) {
  return (
    <div
      style={{
        background: "var(--paper-sunk)",
        border: "1.5px solid var(--rule-firm)",
        padding: "16px 18px",
        marginBottom: 20,
      }}
    >
      <span
        className="font-bold ed-muted"
        style={{
          fontSize: 10,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 10,
        }}
      >
        Passage
      </span>
      <InlineImageText
        text={comprehension.text}
        imageUrls={comprehension.imageUrls}
        imagePositions={comprehension.imagePositions}
        imgAlt="Passage illustration"
        imgStyle={{ maxWidth: "100%", borderRadius: 6, marginBottom: 12 }}
        renderParagraph={(segment, key) => (
          <p
            key={key}
            style={{
              fontSize: 14,
              color: "var(--ink-soft)",
              lineHeight: 1.85,
              margin: 0,
              marginBottom: 12,
              whiteSpace: "pre-line",
            }}
          >
            <MathText text={segment} />
          </p>
        )}
      />
    </div>
  );
}
