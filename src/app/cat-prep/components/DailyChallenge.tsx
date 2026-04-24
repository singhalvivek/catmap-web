// DailyChallenge — daily rotating quiz card; question selected by day-of-month % questions.length
"use client";

import { useState } from "react";
import { SUBJECT_META_BY_ABBR } from "../lib/subjectMeta";

type Challenge = {
  section: "QA" | "VARC" | "DILR";
  tag: string;
  q: string;
  options: string[];
  answer: number;
  explanation: string;
};

const CHALLENGES: Challenge[] = [
  {
    section: "QA",
    tag: "Percentages",
    q: "A shopkeeper marks a price 40% above cost and gives a 20% discount. What is the profit %?",
    options: ["12%", "16%", "20%", "8%"],
    answer: 0,
    explanation: "SP = 1.4C × 0.8 = 1.12C → Profit = 12%",
  },
  {
    section: "VARC",
    tag: "Reading Comprehension",
    q: 'Which of the following best describes the "central idea" approach in Reading Comprehension?',
    options: [
      "Finding the first sentence of each paragraph",
      "Identifying the author's primary argument across the passage",
      "Memorising every data point mentioned",
      "Focusing only on the conclusion paragraph",
    ],
    answer: 1,
    explanation:
      "Central idea = the author's overarching argument, not isolated facts or structure.",
  },
  {
    section: "DILR",
    tag: "Arrangements",
    q: "5 people sit in a row. A is to the left of B, and C is to the right of B. D is not adjacent to A. How many valid arrangements exist?",
    options: ["4", "6", "8", "12"],
    answer: 1,
    explanation:
      "With constraints A<B<C positionally and D not next to A, 6 arrangements satisfy all conditions.",
  },
  {
    section: "QA",
    tag: "Number System",
    q: "What is the remainder when 7^100 is divided by 48?",
    options: ["1", "7", "43", "25"],
    answer: 0,
    explanation: "7² = 49 ≡ 1 (mod 48), so 7^100 = (7²)^50 ≡ 1^50 = 1 (mod 48).",
  },
  {
    section: "DILR",
    tag: "Data Interpretation",
    q: "A pie chart shows sales: A=30%, B=25%, C=20%, D=15%, E=10%. If total sales = ₹4,00,000, how much more did A sell than E?",
    options: ["₹60,000", "₹80,000", "₹1,00,000", "₹40,000"],
    answer: 1,
    explanation: "A = 0.30×4L = 1.2L; E = 0.10×4L = 40K; Difference = 80,000.",
  },
];

export default function DailyChallenge() {
  const ch = CHALLENGES[new Date().getDate() % CHALLENGES.length];
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const sectionMeta = SUBJECT_META_BY_ABBR[ch.section];
  const color = sectionMeta?.color ?? "#1E3A5F";
  const bg    = sectionMeta?.light ?? "#EEF2FF";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: `1.5px solid ${color}25`,
        boxShadow: "0 4px 20px rgba(30,58,95,0.08)",
        marginBottom: 28,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          background: color,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span style={{ fontSize: 18 }}>⚡</span>
          <div>
            <div
              className="text-white font-extrabold"
              style={{ fontSize: 14, letterSpacing: "-0.2px" }}
            >
              Daily Challenge
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 500 }}>
              {today}
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[ch.section, ch.tag].map((badge) => (
            <span
              key={badge}
              className="text-white font-bold"
              style={{
                padding: "3px 10px",
                borderRadius: 100,
                background: "rgba(255,255,255,0.15)",
                fontSize: 11,
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "#fff", padding: "20px 20px 16px" }}>
        <p
          className="font-semibold text-trust-navy"
          style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}
        >
          {ch.q}
        </p>

        <div className="flex flex-col gap-2 mb-4">
          {ch.options.map((opt, i) => {
            let border = "1.5px solid #E2E8F0";
            let optBg = "#fff";
            let col = "#334155";

            if (revealed) {
              if (i === ch.answer) {
                border = "1.5px solid #10B981";
                optBg = "#ECFDF5";
                col = "#065F46";
              } else if (i === selected && i !== ch.answer) {
                border = "1.5px solid #EF4444";
                optBg = "#FEF2F2";
                col = "#991B1B";
              }
            } else if (selected === i) {
              border = `1.5px solid ${color}`;
              optBg = bg;
              col = color;
            }

            return (
              <button
                key={i}
                onClick={() => { if (!revealed) setSelected(i); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border,
                  background: optBg,
                  color: col,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: revealed ? "default" : "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: "1.5px solid currentColor",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                    opacity: 0.7,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {revealed && i === ch.answer && (
                  <span style={{ marginLeft: "auto", fontSize: 14 }}>✓</span>
                )}
                {revealed && i === selected && i !== ch.answer && (
                  <span style={{ marginLeft: "auto", fontSize: 14 }}>✗</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!revealed ? (
            <button
              onClick={() => { if (selected !== null) setRevealed(true); }}
              disabled={selected === null}
              aria-label="Check answer"
              className="font-bold"
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                background: selected !== null ? color : "#E2E8F0",
                color: selected !== null ? "#fff" : "#94A3B8",
                border: "none",
                fontSize: 13,
                cursor: selected !== null ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                transition: "background 0.2s",
              }}
            >
              Check Answer
            </button>
          ) : (
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 10,
                background: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
              }}
            >
              <span
                className="font-bold uppercase"
                style={{ fontSize: 11, color: "#94A3B8", letterSpacing: "0.5px" }}
              >
                Explanation{" "}
              </span>
              <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                {ch.explanation}
              </span>
            </div>
          )}
          {revealed && (
            <button
              onClick={() => { setSelected(null); setRevealed(false); }}
              className="font-semibold"
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                background: "#F1F5F9",
                color: "#64748B",
                border: "none",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
