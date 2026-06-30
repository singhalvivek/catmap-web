// ReviewQuestionPalette — numbered question navigation grid colour-coded by correctness
"use client";

import type { Question, QuestionResponse } from "../../../models/dailyChallenge";

type Status = "correct" | "wrong" | "unattempted";
type StatusStyle = { bg: string; color: string; border: string };

const STATUS_STYLES: Record<Status | "current", StatusStyle> = {
  correct:     { bg: "#DCFCE7", color: "#166534", border: "#86EFAC" },
  wrong:       { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
  unattempted: { bg: "#F1F5F9", color: "#94A3B8", border: "#E2E8F0" },
  current:     { bg: "#1E3A5F", color: "#fff",    border: "#1E3A5F" },
};

const LEGEND: Array<{ key: Status; label: string }> = [
  { key: "correct", label: "Correct" },
  { key: "wrong", label: "Wrong" },
  { key: "unattempted", label: "Unattempted" },
];

function statusOf(response: QuestionResponse | undefined): Status {
  if (!response || response.given === null) return "unattempted";
  return response.correct ? "correct" : "wrong";
}

type Props = {
  sectionNames: string[];
  activeSectionIndex: number;
  onSelectSection: (idx: number) => void;
  questions: Question[];
  responses: Record<string, QuestionResponse>;
  currentIndex: number;
  onSelect: (idx: number) => void;
};

export default function ReviewQuestionPalette({
  sectionNames,
  activeSectionIndex,
  onSelectSection,
  questions,
  responses,
  currentIndex,
  onSelect,
}: Props) {
  return (
    <div>
      <div className="flex gap-1.5" style={{ marginBottom: 12 }}>
        {sectionNames.map((name, idx) => {
          const isActive = idx === activeSectionIndex;
          return (
            <button
              key={name}
              onClick={() => onSelectSection(idx)}
              className="font-bold"
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 100,
                background: isActive ? "#1E3A5F" : "#F1F5F9",
                color: isActive ? "#fff" : "#64748B",
                border: "none",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
      <p
        className="font-semibold text-slate-400"
        style={{ fontSize: 10, letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: 10 }}
      >
        Questions
      </p>

      <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 16 }}>
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const styleKey = isCurrent ? "current" : statusOf(responses[q.questionId]);
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
