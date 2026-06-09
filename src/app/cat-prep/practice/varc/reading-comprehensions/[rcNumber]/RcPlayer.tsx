// RcPlayer — interactive RC player with split passage/questions panel and cross-session persistence
"use client";

import { useState } from "react";
import type { RcPassage, RcQuestionSolution, OptionsMap } from "@/app/cat-prep/models/practice";
import Link from "next/link";
import { usePracticeProgress } from "@/app/cat-prep/lib/usePracticeProgress";
import { PracticeOptionButton, type OptionState } from "@/app/cat-prep/components/practice/PracticeOptionButton";

type OptionKey = keyof OptionsMap;
const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

function LevelBadge({ level }: { level: string }) {
  const color =
    level === "Medium"
      ? { bg: "#FEF3C7", text: "#92400E" }
      : level === "Medium-Hard"
        ? { bg: "#FFEDD5", text: "#9A3412" }
        : { bg: "#FEE2E2", text: "#991B1B" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 6,
        background: color.bg,
        color: color.text,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {level}
    </span>
  );
}

export default function RcPlayer({
  passage,
  totalPassages,
  storageKey,
}: {
  passage: RcPassage;
  totalPassages: number;
  storageKey: string;
}) {
  const [activeTab, setActiveTab] = useState<"passage" | "questions">("passage");
  const [currentQ, setCurrentQ] = useState(1);
  const { answers, correctAnswers, setAnswer, setCorrectAnswer } = usePracticeProgress(storageKey);
  const [sessionSolutions, setSessionSolutions] = useState<Record<number, RcQuestionSolution>>({});
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<{ paraIdx: number } | null>(null);

  const question = passage.questions.find((q) => q.number === currentQ) ?? passage.questions[0];
  const isChecked = question ? !!correctAnswers[question.number] : false;
  const sessionSolution = question ? (sessionSolutions[question.number] ?? null) : null;

  async function checkAnswer() {
    if (!question || !answers[question.number]) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/practice/rcs/${passage.rc_number}/solution/${question.number}`
      );
      if (res.ok) {
        const data = (await res.json()) as RcQuestionSolution;
        setSessionSolutions((prev) => ({ ...prev, [question.number]: data }));
        setCorrectAnswer(question.number, data.correct_answer);
      }
    } finally {
      setLoading(false);
    }
  }

  function optionState(key: OptionKey): OptionState {
    if (!question) return "idle";
    const correctLetter = correctAnswers[question.number] as OptionKey | undefined;
    if (correctLetter) {
      if (key === correctLetter) return "correct";
      if ((answers[question.number] as OptionKey | undefined) === key) return "wrong";
      return "idle";
    }
    return (answers[question.number] as OptionKey | undefined) === key ? "selected" : "idle";
  }

  // JSX variables instead of inline component definitions — avoids React remounting on each render (B2)
  const passageContent = (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span className="font-bold" style={{ fontSize: 14, color: "#92400E" }}>Passage</span>
        <LevelBadge level={passage.level} />
      </div>
      {passage.passage_paragraphs.map((para, idx) => (
        <div key={idx} style={{ marginBottom: 16, position: "relative" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <button
              onMouseEnter={() => passage.para_summaries[idx] ? setTooltip({ paraIdx: idx }) : undefined}
              onMouseLeave={() => setTooltip(null)}
              style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "1.5px solid #E2E8F0",
                background: "#FFFBEB",
                color: "#92400E",
                fontSize: 11,
                fontWeight: 700,
                cursor: passage.para_summaries[idx] ? "help" : "default",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 3,
              }}
            >
              {idx + 1}
            </button>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: 0 }}>{para}</p>
          </div>
          {tooltip?.paraIdx === idx && passage.para_summaries[idx] && (
            <div
              style={{
                position: "absolute",
                left: 32,
                top: 0,
                zIndex: 10,
                maxWidth: 280,
                padding: "10px 14px",
                borderRadius: 10,
                background: "#1E3A5F",
                color: "#fff",
                fontSize: 12,
                lineHeight: 1.6,
                boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              }}
            >
              {passage.para_summaries[idx]}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const questionsContent = (
    <div>
      {/* Q pill nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {passage.questions.map((q) => (
          <button
            key={q.number}
            onClick={() => setCurrentQ(q.number)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `1.5px solid ${q.number === currentQ ? "#92400E" : "#E2E8F0"}`,
              background: q.number === currentQ ? "#92400E" : "#fff",
              color: q.number === currentQ ? "#fff" : "#334155",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {q.number}
          </button>
        ))}
      </div>

      {/* Question text */}
      <p style={{ fontSize: 15, color: "#1E3A5F", fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>
        {question?.question}
      </p>

      {/* Options */}
      {question && OPTION_KEYS.map((key) => (
        <PracticeOptionButton
          key={key}
          label={key}
          state={optionState(key)}
          disabled={isChecked}
          onClick={() => !isChecked && setAnswer(question.number, key)}
        >
          {question.options[key]}
        </PracticeOptionButton>
      ))}

      {/* Check Answer button — hidden once checked in any session */}
      {!isChecked && (
        <button
          onClick={checkAnswer}
          disabled={!question || !answers[question.number] || loading}
          style={{
            marginTop: 12,
            padding: "10px 22px",
            borderRadius: 10,
            border: "none",
            background: question && answers[question.number] ? "#92400E" : "#E2E8F0",
            color: question && answers[question.number] ? "#fff" : "#94A3B8",
            fontSize: 14,
            fontWeight: 700,
            cursor: question && answers[question.number] ? "pointer" : "not-allowed",
            fontFamily: "inherit",
          }}
        >
          {loading ? "Loading…" : "Check Answer"}
        </button>
      )}

      {/* Explanation — only shown when fetched this session */}
      {sessionSolution && question && sessionSolution.explanation && (
        <div
          style={{
            marginTop: 16,
            padding: "14px 18px",
            borderRadius: 12,
            background: "#FFFBEB",
            border: "1.5px solid #FDE68A",
          }}
        >
          <div className="font-bold" style={{ fontSize: 13, color: "#92400E", marginBottom: 8 }}>
            Explanation
          </div>
          {sessionSolution.explanation.split("\n").map((line, i) => (
            <p key={i} style={{ fontSize: 13, color: "#334155", margin: "0 0 4px", lineHeight: 1.6 }}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Back link */}
      <Link
        href="/cat-prep"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#64748B",
          textDecoration: "none",
          marginBottom: 20,
          fontWeight: 500,
        }}
      >
        ← Back to Roadmap
      </Link>

      {/* RC number header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span className="font-bold text-trust-navy" style={{ fontSize: 15 }}>
          RC {passage.rc_number}
        </span>
        <LevelBadge level={passage.level} />
      </div>

      {/* Mobile tabs */}
      <div
        style={{ display: "flex", gap: 0, marginBottom: 16, borderRadius: 8, overflow: "hidden", border: "1.5px solid #E2E8F0" }}
        className="md:hidden"
      >
        {(["passage", "questions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              background: activeTab === tab ? "#92400E" : "#fff",
              color: activeTab === tab ? "#fff" : "#334155",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Single responsive grid — B4: one DOM tree; CSS hides inactive panel on mobile */}
      <div className="grid md:grid-cols-2 gap-7">
        <div className={`${activeTab === "questions" ? "hidden md:block" : ""} md:max-h-[70vh] md:overflow-y-auto md:pr-2`}>
          {passageContent}
        </div>
        <div className={activeTab === "passage" ? "hidden md:block" : ""}>
          {questionsContent}
        </div>
      </div>

      {/* RC navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
        {passage.rc_number > 1 ? (
          <Link
            href={`/cat-prep/practice/varc/reading-comprehensions/${passage.rc_number - 1}`}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #E2E8F0", color: "#334155", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            ← Prev RC
          </Link>
        ) : (
          <span />
        )}
        {passage.rc_number < totalPassages && (
          <Link
            href={`/cat-prep/practice/varc/reading-comprehensions/${passage.rc_number + 1}`}
            style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #E2E8F0", color: "#334155", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            Next RC →
          </Link>
        )}
      </div>
    </div>
  );
}
