// SectionSummaryRow — static per-section score/stats row on the results screen
import type { TestSection, SectionResult } from "../../../models/dailyChallenge";
import { formatDuration } from "@/lib/dateIST";

type Props = {
  testSection: TestSection;
  sectionResult: SectionResult;
};

export default function SectionSummaryRow({ testSection, sectionResult }: Props) {
  const sectionTimeSpent = Object.values(sectionResult.responses).reduce(
    (sum, r) => sum + r.timeSpentSeconds,
    0
  );
  const correct = Object.values(sectionResult.responses).filter((r) => r.correct).length;
  const wrong = Object.values(sectionResult.responses).filter(
    (r) => !r.correct && r.given !== null
  ).length;
  const unattempted = testSection.questions.length - correct - wrong;
  // A section scored exactly 0 is neither right nor wrong; only a real gain or loss
  // earns the correct/wrong scale.
  const scoreColor =
    sectionResult.score > 0
      ? "var(--correct-text)"
      : sectionResult.score < 0
      ? "var(--wrong-text)"
      : "var(--inert-text)";

  return (
    <div
      style={{
        padding: "14px 16px",
        border: "1.5px solid var(--rule)",
        background: "var(--paper)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <p className="font-extrabold" style={{ fontSize: 14, margin: 0, color: "var(--ink)" }}>
          {sectionResult.name}
        </p>
        <p className="ed-muted" style={{ fontSize: 11, marginTop: 2 }}>
          {correct} correct · {wrong} wrong · {unattempted} unattempted · {formatDuration(sectionTimeSpent)}
        </p>
      </div>
      <span
        className="font-bold"
        style={{ fontSize: 16, color: scoreColor }}
      >
        {sectionResult.score > 0 ? `+${sectionResult.score}` : sectionResult.score}
        <span className="font-normal ed-muted" style={{ fontSize: 13 }}>
          {" "}/ {sectionResult.totalMarks}
        </span>
      </span>
    </div>
  );
}
