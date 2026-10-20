// ReviewQuestionPalette — numbered question navigation grid colour-coded by correctness
"use client";

import type { Question, QuestionResponse } from "../../../models/dailyChallenge";

type Status = "correct" | "wrong" | "unattempted";
type StatusStyle = { bg: string; color: string; border: string };

const STATUS_STYLES: Record<Status | "current", StatusStyle> = {
  correct:     { bg: "var(--correct-wash)", color: "var(--correct-text)", border: "var(--correct-text)" },
  wrong:       { bg: "var(--wrong-wash)", color: "var(--wrong-text)", border: "var(--wrong-text)" },
  unattempted: { bg: "var(--paper-sunk)", color: "var(--inert-text)", border: "var(--rule)" },
  current:     { bg: "var(--ink)", color: "var(--paper)", border: "var(--ink)" },
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
                background: isActive ? "var(--ink)" : "var(--paper-sunk)",
                color: isActive ? "var(--paper)" : "var(--ink-faint)",
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
        className="font-semibold ed-muted"
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
