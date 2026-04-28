// SectionBreakdownCard — collapsible card showing section score, time, and per-question review
"use client";

import { useState } from "react";
import type { TestSection, SectionResult } from "../../models/dailyChallenge";
import QuestionReviewList from "./QuestionReviewList";

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

type Props = {
  testSection: TestSection;
  sectionResult: SectionResult;
  answers: Record<string, number>;
};

export default function SectionBreakdownCard({ testSection, sectionResult, answers }: Props) {
  const [expanded, setExpanded] = useState(false);

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
        borderRadius: 12,
        border: "1.5px solid #E8EAF0",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Header row — always visible, click to expand */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: "100%",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <div>
          <p className="font-extrabold text-trust-navy" style={{ fontSize: 14, margin: 0 }}>
            {sectionResult.name}
          </p>
          <p className="text-slate-400" style={{ fontSize: 11, marginTop: 2 }}>
            {correct} correct · {wrong} wrong · {unattempted} unattempted · {formatTime(sectionTimeSpent)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-bold"
            style={{ fontSize: 16, color: scorePositive ? "#166534" : "#991B1B" }}
          >
            {sectionResult.score > 0 ? `+${sectionResult.score}` : sectionResult.score}
            <span className="font-normal text-slate-400" style={{ fontSize: 13 }}>
              {" "}/ {sectionResult.totalMarks}
            </span>
          </span>
          <span style={{ fontSize: 14, color: "#94A3B8", transform: expanded ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.2s" }}>
            ▾
          </span>
        </div>
      </button>

      {/* Expandable question review */}
      {expanded && (
        <div style={{ padding: "0 16px 14px" }}>
          <QuestionReviewList
            questions={testSection.questions}
            responses={sectionResult.responses}
            answers={answers}
          />
        </div>
      )}
    </div>
  );
}
