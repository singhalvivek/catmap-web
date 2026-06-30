// QuestionPalette — numbered question navigation grid with colour-coded visit status
"use client";

import type { Question, VisitStatus } from "../../../models/dailyChallenge";

type StatusStyle = { bg: string; color: string; border: string };

const STATUS_STYLES: Record<VisitStatus | "current", StatusStyle> = {
  not_visited: { bg: "#F1F5F9", color: "#94A3B8", border: "#E2E8F0" },
  visited:     { bg: "#FEF9C3", color: "#854D0E", border: "#FDE047" },
  answered:    { bg: "#DCFCE7", color: "#166534", border: "#86EFAC" },
  marked_for_review: { bg: "#EDE9FE", color: "#5B21B6", border: "#A78BFA" },
  current:     { bg: "#1E3A5F", color: "#fff",    border: "#1E3A5F" },
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
        className="font-extrabold text-trust-navy"
        style={{ fontSize: 13, marginBottom: 2 }}
      >
        {sectionName}
      </p>
      <p
        className="font-semibold text-slate-400"
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
                borderRadius: 6,
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
                  borderRadius: 3,
                  background: s.bg,
                  border: `1.5px solid ${s.border}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: "#64748B" }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
