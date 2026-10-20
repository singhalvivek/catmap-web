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
  const scorePositive = sectionResult.score >= 0;

  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 12,
        border: "1.5px solid #E8EAF0",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <p className="font-extrabold text-trust-navy" style={{ fontSize: 14, margin: 0 }}>
          {sectionResult.name}
        </p>
        <p className="ed-muted" style={{ fontSize: 11, marginTop: 2 }}>
          {correct} correct · {wrong} wrong · {unattempted} unattempted · {formatDuration(sectionTimeSpent)}
        </p>
      </div>
      <span
        className="font-bold"
        style={{ fontSize: 16, color: scorePositive ? "#166534" : "#991B1B" }}
      >
        {sectionResult.score > 0 ? `+${sectionResult.score}` : sectionResult.score}
        <span className="font-normal ed-muted" style={{ fontSize: 13 }}>
          {" "}/ {sectionResult.totalMarks}
        </span>
      </span>
    </div>
  );
}
