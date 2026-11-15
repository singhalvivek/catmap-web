// QuestionPalette — numbered question navigation grid with colour-coded visit status
"use client";

import type { Question, VisitStatus } from "../../../models/dailyChallenge";

type StatusStyle = { bg: string; color: string; border: string };

/* "answered" is not "correct" — nothing is graded until submit, so it takes the ink scale
   rather than the correct-answer green. Only the review palette may use --correct-*. */
const STATUS_STYLES: Record<VisitStatus | "current", StatusStyle> = {
  not_visited: { bg: "var(--paper-sunk)", color: "var(--inert-text)", border: "var(--rule)" },
  visited:     { bg: "var(--caution-wash)", color: "var(--caution-text)", border: "var(--caution-text)" },
  answered:    { bg: "var(--paper-sunk)", color: "var(--ink)", border: "var(--ink)" },
  marked_for_review: { bg: "var(--review-wash)", color: "var(--review-text)", border: "var(--review-text)" },
  current:     { bg: "var(--ink)", color: "var(--paper)", border: "var(--ink)" },
};

const LEGEND: Array<{ key: VisitStatus; label: string }> = [
  { key: "answered",          label: "Answered" },
  { key: "marked_for_review", label: "Review" },
  { key: "visited",           label: "Visited" },
  { key: "not_visited",       label: "Not visited" },
];

type Props = {
  sectionName: string;
  questions: Question[];
  visitStatus: Record<string, VisitStatus>;
  currentIndex: number;
  onSelect: (idx: number) => void;
};

export default function QuestionPalette({
  sectionName,
  questions,
  visitStatus,
  currentIndex,
  onSelect,
}: Props) {
  return (
    <div>
      <p
        className="font-extrabold"
        style={{ fontSize: 13, marginBottom: 2, color: "var(--ink)" }}
      >
        {sectionName}
      </p>
      <p
        className="font-semibold ed-muted"
        style={{ fontSize: 10, letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: 10 }}
      >
        Questions
      </p>

      <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 16 }}>
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const styleKey = isCurrent ? "current" : (visitStatus[q.questionId] ?? "not_visited");
          const s = STATUS_STYLES[styleKey];
          return (
            <button
              key={q.questionId}
              onClick={() => onSelect(idx)}
              style={{
                width: 32,
                height: 32,
                background: s.bg,
                color: s.color,
                border: `1.5px solid ${s.border}`,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        {LEGEND.map(({ key, label }) => {
          const s = STATUS_STYLES[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: s.bg,
                  border: `1.5px solid ${s.border}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
