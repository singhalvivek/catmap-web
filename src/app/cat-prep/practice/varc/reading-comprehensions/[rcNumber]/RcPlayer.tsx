// RcPlayer — interactive RC player with split passage/questions panel and cross-session persistence
"use client";

import { useState } from "react";
import type { RcPassage, RcQuestionSolution, OptionsMap } from "@/app/cat-prep/models/practice";
import Link from "next/link";
import { usePracticeProgress } from "@/app/cat-prep/lib/usePracticeProgress";
import { PracticeOptionButton, type OptionState } from "@/app/cat-prep/components/practice/PracticeOptionButton";
import DifficultyBadge from "@/app/cat-prep/components/practice/DifficultyBadge";
import { PRACTICE_INDEX } from "@/constants/routes";

type OptionKey = keyof OptionsMap;
const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

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
  const [openSummary, setOpenSummary] = useState<number | null>(null);

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
        <span className="font-bold" style={{ fontSize: 14, color: "var(--caution-text)" }}>Passage</span>
        <DifficultyBadge level={passage.level} />
      </div>
      {passage.passage_paragraphs.map((para, idx) => {
        const summary = passage.para_summaries[idx];
        const open = openSummary === idx;
        return (
          <div key={idx} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              {/*
                A real disclosure. This was onMouseEnter/onMouseLeave with no onClick, no
                onFocus and no name beyond the paragraph number — so on a phone, which is
                where RC actually gets read, the summaries could not be opened at all, and a
                keyboard user tabbed onto a focusable control that did nothing. A paragraph
                with no summary is a plain span now rather than a dead button.
              */}
              {summary ? (
                <button
                  type="button"
                  className="rc-para__marker"
                  aria-expanded={open}
                  aria-controls={`rc-summary-${idx}`}
                  onClick={() => setOpenSummary(open ? null : idx)}
                >
                  {idx + 1}
                  <span className="ed-sr-only">
                    {open ? "Hide" : "Show"} the summary of paragraph {idx + 1}
                  </span>
                </button>
              ) : (
                <span className="rc-para__marker" data-inert="true" aria-hidden="true">
                  {idx + 1}
                </span>
              )}
              <p className="rc-para__text">{para}</p>
            </div>
            {/* In flow, below its paragraph. The old tooltip was absolutely positioned
                inside a panel that scrolls, so where hover worked it was clipped. */}
            {summary && open && (
              <p id={`rc-summary-${idx}`} className="rc-para__summary">
                {summary}
              </p>
            )}
          </div>
        );
      })}
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
              border: `1.5px solid ${q.number === currentQ ? "var(--caution-text)" : "var(--rule)"}`,
              background: q.number === currentQ ? "var(--caution-text)" : "var(--paper)",
              color: q.number === currentQ ? "var(--paper)" : "var(--ink-soft)",
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
      <p style={{ fontSize: 15, color: "var(--ink)", fontWeight: 600, lineHeight: 1.6, marginBottom: 16 }}>
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

      {/*
        Conditioned on whether a solution is ON SCREEN, not on whether one was ever
        fetched. isChecked is persisted and sessionSolution is not, so after a reload a
        checked question showed a tinted grid, no explanation and no control to get one.
        Re-fetching is safe: setCorrectAnswer early-returns when an answer is recorded.
      */}
      {!sessionSolution && (
        <button
          onClick={checkAnswer}
          disabled={!question || !answers[question.number] || loading}
          className="ed-btn"
          data-weight="primary"
          style={{ marginTop: 12 }}
        >
          {loading ? "Loading…" : isChecked ? "Show the explanation" : "Check answer"}
        </button>
      )}

      <p aria-live="polite" className="ed-sr-only">
        {sessionSolution && question
          ? `Answer checked. The correct answer is ${correctAnswers[question.number] ?? "shown below"}.`
          : ""}
      </p>

      {/* Explanation — only shown when fetched this session */}
      {sessionSolution && question && sessionSolution.explanation && (
        <div
          style={{
            marginTop: 16,
            padding: "14px 18px",
            background: "var(--caution-wash)",
            border: "1.5px solid var(--rule-firm)",
          }}
        >
          <div className="font-bold" style={{ fontSize: 13, color: "var(--caution-text)", marginBottom: 8 }}>
            Explanation
          </div>
          {sessionSolution.explanation.split("\n").map((line, i) => (
            <p key={i} style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 4px", lineHeight: 1.6 }}>
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
        href={PRACTICE_INDEX}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--ink-soft)",
          textDecoration: "none",
          marginBottom: 20,
          fontWeight: 500,
        }}
      >
        ← All practice chapters
      </Link>

      {/* RC number header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span className="font-bold" style={{ fontSize: 15 }}>
          RC {passage.rc_number}
        </span>
        <DifficultyBadge level={passage.level} />
      </div>

      {/*
        Pinned under the masthead. This was an ordinary block at the top of the page, so on
        a phone the loop was: read down a six-paragraph passage, scroll all the way back up
        to reach the switch, change panel, answer, scroll up again.
      */}
      <div className="solve-tabs md:hidden" role="tablist" aria-label="Passage or questions">
        {(["passage", "questions"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`solve-tab-${tab}`}
            aria-selected={activeTab === tab}
            aria-controls={`solve-panel-${tab}`}
            className="solve-tabs__tab"
            onClick={() => setActiveTab(tab)}
          >
            {tab === "passage" ? "Passage" : "Questions"}
          </button>
        ))}
      </div>

      {/* Single responsive grid — B4: one DOM tree; CSS hides inactive panel on mobile */}
      <div className="grid md:grid-cols-2 gap-7">
        <div
          id="solve-panel-passage"
          role="tabpanel"
          aria-labelledby="solve-tab-passage"
          className={`${activeTab === "questions" ? "hidden md:block" : ""} solve-panel`}
        >
          {passageContent}
        </div>
        <div
          id="solve-panel-questions"
          role="tabpanel"
          aria-labelledby="solve-tab-questions"
          className={activeTab === "passage" ? "hidden md:block" : ""}
        >
          {questionsContent}
        </div>
      </div>

      {/* RC navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
        {passage.rc_number > 1 ? (
          <Link
            href={`/cat-prep/practice/varc/reading-comprehensions/${passage.rc_number - 1}`}
            style={{ padding: "9px 20px", border: "1.5px solid var(--rule)", color: "var(--ink-soft)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            ← Prev RC
          </Link>
        ) : (
          <span />
        )}
        {passage.rc_number < totalPassages && (
          <Link
            href={`/cat-prep/practice/varc/reading-comprehensions/${passage.rc_number + 1}`}
            style={{ padding: "9px 20px", border: "1.5px solid var(--rule)", color: "var(--ink-soft)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            Next RC →
          </Link>
        )}
      </div>
    </div>
  );
}
