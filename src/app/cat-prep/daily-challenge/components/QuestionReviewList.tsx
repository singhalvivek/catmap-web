// QuestionReviewList — per-question review rows: status, marks, time, and answer comparison
"use client";

import type { Question, QuestionResponse } from "../../models/dailyChallenge";

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

function optionLabel(question: Question, idx: number | null): string {
  if (idx === null) return "—";
  const opt = question.options?.[idx];
  if (opt?.text) return opt.text;
  return `Option ${idx + 1}`;
}

type Props = {
  questions: Question[];
  responses: Record<string, QuestionResponse>;
};

export default function QuestionReviewList({ questions, responses }: Props) {
  return (
    <div className="flex flex-col" style={{ gap: 1, marginTop: 10 }}>
      {questions.map((q, idx) => {
        const resp = responses[q.questionId];
        const isUnattempted = resp?.given === null || resp === undefined;
        const isCorrect = resp?.correct === true;

        let statusColor = "#64748B";
        let statusLabel = "Unattempted";
        let marksColor = "#64748B";

        if (!isUnattempted) {
          if (isCorrect) {
            statusColor = "#166534";
            statusLabel = "Correct";
            marksColor = "#166534";
          } else {
            statusColor = "#991B1B";
            statusLabel = "Wrong";
            marksColor = "#991B1B";
          }
        }

        const marks = resp?.marks ?? 0;
        const timeSpent = resp?.timeSpentSeconds ?? 0;
        const correctAnswer = resp?.correctAnswer ?? null;

        return (
          <div
            key={q.questionId}
            style={{
              padding: "12px 14px",
              borderRadius: 8,
              background: isCorrect ? "#F0FDF4" : isUnattempted ? "#F8FAFC" : "#FEF2F2",
              border: `1px solid ${isCorrect ? "#BBF7D0" : isUnattempted ? "#E8EAF0" : "#FECACA"}`,
              marginBottom: 6,
            }}
          >
            {/* Row 1: Q number, type, time, status, marks */}
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-trust-navy" style={{ fontSize: 13 }}>
                  Q{idx + 1}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: 4,
                    background: "#EFF6FF",
                    color: "#1D4ED8",
                    letterSpacing: "0.3px",
                    textTransform: "uppercase",
                  }}
                >
                  {q.type}
                </span>
                <span className="text-slate-400" style={{ fontSize: 11 }}>
                  {formatTime(timeSpent)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, fontWeight: 600, color: statusColor }}>
                  {statusLabel}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: marksColor,
                    minWidth: 28,
                    textAlign: "right",
                  }}
                >
                  {marks > 0 ? `+${marks}` : marks}
                </span>
              </div>
            </div>

            {/* Row 2: question text */}
            <p
              className="text-trust-navy"
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                margin: "4px 0 8px",
                paddingBottom: 8,
                borderBottom: "1px solid #E8EAF0",
              }}
            >
              {q.text}
            </p>

            {/* Row 3: answer comparison */}
            {q.type === "mcq" ? (
              <div className="flex gap-4" style={{ fontSize: 12 }}>
                <span>
                  <span className="text-slate-400">Your answer: </span>
                  <span className="font-semibold" style={{ color: isUnattempted ? "#94A3B8" : isCorrect ? "#166534" : "#991B1B" }}>
                    {isUnattempted ? "—" : optionLabel(q, resp.given)}
                  </span>
                </span>
                {!isUnattempted && !isCorrect && (
                  <span>
                    <span className="text-slate-400">Correct: </span>
                    <span className="font-semibold" style={{ color: "#166534" }}>
                      {optionLabel(q, correctAnswer)}
                    </span>
                  </span>
                )}
              </div>
            ) : (
              <div className="flex gap-4" style={{ fontSize: 12 }}>
                <span>
                  <span className="text-slate-400">Your answer: </span>
                  <span className="font-semibold" style={{ color: isUnattempted ? "#94A3B8" : isCorrect ? "#166534" : "#991B1B" }}>
                    {isUnattempted ? "—" : resp.given}
                  </span>
                </span>
                {!isUnattempted && !isCorrect && (
                  <span>
                    <span className="text-slate-400">Correct: </span>
                    <span className="font-semibold" style={{ color: "#166534" }}>
                      {correctAnswer}
                    </span>
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
