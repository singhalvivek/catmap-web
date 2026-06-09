// DilrPlayer — interactive DILR set player with split panel, full-solution reveal, and cross-session persistence
"use client";

import { useRef, useState } from "react";
import type { DilrSet, DilrSolution, OptionsMap } from "@/app/cat-prep/models/practice";
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

export default function DilrPlayer({
  set,
  chapterSlug,
  totalSets,
  storageKey,
}: {
  set: DilrSet;
  chapterSlug: string;
  totalSets: number;
  storageKey: string;
}) {
  const [activeTab, setActiveTab] = useState<"passage" | "questions">("passage");
  const [currentQ, setCurrentQ] = useState(1);
  const { answers, correctAnswers, setAnswer, setCorrectAnswer } = usePracticeProgress(storageKey);
  const [sessionSolution, setSessionSolution] = useState<DilrSolution | null>(null);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const question = set.questions.find((q) => q.number === currentQ) ?? set.questions[0];
  const isChecked = question ? !!correctAnswers[question.number] : false;

  async function checkAnswer() {
    if (!question || !answers[question.number]) return;
    setLoading(true);
    try {
      let sol = sessionSolution;
      if (!sol) {
        const res = await fetch(
          `/api/practice/dilr/${set.set_number}/solution?chapter=${encodeURIComponent(set.chapter)}`
        );
        if (!res.ok) return;
        sol = (await res.json()) as DilrSolution;
        setSessionSolution(sol);
      }
      setCorrectAnswer(question.number, sol.answers[question.number]);
    } finally {
      setLoading(false);
    }
  }

  function optionState(qNum: number, key: OptionKey): OptionState {
    const correctLetter = correctAnswers[qNum] as OptionKey | undefined;
    if (correctLetter) {
      if (key === correctLetter) return "correct";
      if ((answers[qNum] as OptionKey | undefined) === key) return "wrong";
      return "idle";
    }
    return (answers[qNum] as OptionKey | undefined) === key ? "selected" : "idle";
  }

  // JSX variables instead of inline component definitions — avoids React remounting on each render (B2)
  const passageContent = (
    <div>
      <p
        style={{
          fontSize: 14,
          color: "#334155",
          lineHeight: 1.8,
          whiteSpace: "pre-line",
          margin: "0 0 16px",
        }}
      >
        {set.passage}
      </p>
      {set.question_svg && (
        <div
          ref={svgRef}
          className="svg-diagram"
          dangerouslySetInnerHTML={{ __html: set.question_svg }}
        />
      )}
    </div>
  );

  const questionsContent = (
    <div>
      {/* Q pill nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {set.questions.map((q) => (
          <button
            key={q.number}
            onClick={() => setCurrentQ(q.number)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `1.5px solid ${q.number === currentQ ? "#0F766E" : "#E2E8F0"}`,
              background: q.number === currentQ ? "#0F766E" : "#fff",
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
          state={optionState(question.number, key)}
          disabled={isChecked}
          onClick={() => !isChecked && setAnswer(question.number, key)}
        >
          {question.options[key]}
        </PracticeOptionButton>
      ))}

      {/* Check Answer — hidden once this question is checked */}
      {!isChecked && (
        <button
          onClick={checkAnswer}
          disabled={!question || !answers[question.number] || loading}
          style={{
            marginTop: 12,
            padding: "10px 22px",
            borderRadius: 10,
            border: "none",
            background: question && answers[question.number] ? "#0F766E" : "#E2E8F0",
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

      {/* Full solution — shown once fetched in this session */}
      {sessionSolution && isChecked && (
        <div
          style={{
            marginTop: 16,
            padding: "16px 20px",
            borderRadius: 12,
            background: "#F0FDFA",
            border: "1.5px solid #14B8A6",
          }}
        >
          <div className="font-bold" style={{ fontSize: 13, color: "#0F766E", marginBottom: 8 }}>
            Full Solution
          </div>
          <p style={{ fontSize: 14, color: "#334155", whiteSpace: "pre-line", lineHeight: 1.7, margin: "0 0 12px" }}>
            {sessionSolution.solution_text}
          </p>
          {sessionSolution.solution_svg && (
            <div className="svg-diagram" dangerouslySetInnerHTML={{ __html: sessionSolution.solution_svg }} />
          )}
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

      {/* Set header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span className="font-bold text-trust-navy" style={{ fontSize: 15 }}>
          Set {set.set_number}
        </span>
        <LevelBadge level={set.level} />
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden" style={{ display: "flex", gap: 0, marginBottom: 16, borderRadius: 8, overflow: "hidden", border: "1.5px solid #E2E8F0" }}>
        {(["passage", "questions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              background: activeTab === tab ? "#0F766E" : "#fff",
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
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`${activeTab === "questions" ? "hidden md:block" : ""} md:max-h-[70vh] md:overflow-y-auto md:pr-2`}>
          {passageContent}
        </div>
        <div className={activeTab === "passage" ? "hidden md:block" : ""}>
          {questionsContent}
        </div>
      </div>

      {/* Set navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
        {set.set_number > 1 ? (
          <Link
            href={`/cat-prep/practice/dilr/${chapterSlug}/${set.set_number - 1}`}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              color: "#334155",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← Prev Set
          </Link>
        ) : (
          <span />
        )}
        {set.set_number < totalSets && (
          <Link
            href={`/cat-prep/practice/dilr/${chapterSlug}/${set.set_number + 1}`}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              color: "#334155",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Next Set →
          </Link>
        )}
      </div>
    </div>
  );
}
