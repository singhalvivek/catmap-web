// QuestionPlayer — interactive question player for MCQ and para-jumble sequences, with cross-session state persistence
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PracticeQuestion, PracticeQuestionSolution, OptionsMap } from "@/app/cat-prep/models/practice";
import Link from "next/link";
import { usePracticeProgress } from "@/app/cat-prep/lib/usePracticeProgress";
import { PracticeOptionButton, type OptionState } from "@/app/cat-prep/components/practice/PracticeOptionButton";
import { PracticePalette, type PillState } from "@/app/cat-prep/components/practice/PracticePalette";

type OptionKey = keyof OptionsMap;
const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

// Marks a question checked without matching any real option letter or sequence, for the
// questions whose answer key is simply missing from the source data (10 Odd One Out).
const NO_ANSWER_SENTINEL = "—";

// Para Jumbles give four sentences and ask for their order, so the answer is a sequence
// like "2413" rather than an option. Stored in correct_text; correct_answer is null.
const JUMBLE_SEQUENCE = /^[1-4]{4}$/;

function isCompleteSequence(value: string): boolean {
  return JUMBLE_SEQUENCE.test(value) && new Set(value).size === 4;
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const color =
    difficulty === "Easy"
      ? { bg: "#D1FAE5", text: "#065F46" }
      : difficulty === "Medium"
        ? { bg: "#FEF3C7", text: "#92400E" }
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
        letterSpacing: "0.2px",
      }}
    >
      {difficulty}
    </span>
  );
}

function MathContent({ html, containerRef }: { html: string; containerRef: React.RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    type MathJaxInstance = {
      typesetPromise?: (els: HTMLElement[]) => Promise<void>;
      startup?: { promise?: Promise<void> };
    };
    const mjax = (window as Window & { MathJax?: MathJaxInstance }).MathJax;
    if (!mjax) return;
    const run = () => {
      if (typeof mjax.typesetPromise === "function" && el) {
        mjax.typesetPromise([el]).catch(() => {});
      }
    };
    if (mjax.startup?.promise) {
      mjax.startup.promise.then(run).catch(() => {});
    } else {
      run();
    }
  }, [html, containerRef]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function QuestionPlayer({
  questions,
  backHref,
  backLabel,
  storageKey,
}: {
  questions: PracticeQuestion[];
  backHref: string;
  backLabel: string;
  storageKey: string;
}) {
  // `?q=` is read from the URL after mount rather than through useSearchParams, which is
  // a dynamic API: using it during render opted this whole subtree out of prerendering,
  // so every practice chapter page served Googlebot a breadcrumb, a heading and no
  // questions at all. Starting at question 1 makes the first render deterministic, so the
  // page prerenders; a deep link still lands on its question immediately after hydration.
  const [currentNum, setCurrentNum] = useState(1);

  useEffect(() => {
    const q = parseInt(new URLSearchParams(window.location.search).get("q") ?? "1", 10);
    if (!isNaN(q) && q >= 1 && q <= questions.length) setCurrentNum(q);
  }, [questions.length]);

  const { answers, correctAnswers, setAnswer, setCorrectAnswer } = usePracticeProgress(storageKey);
  const [sessionSolutions, setSessionSolutions] = useState<Record<number, PracticeQuestionSolution>>({});
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const question = questions.find((q) => q.question_number === currentNum) ?? questions[0];
  const isJumble = question?.question_type === "jumble";
  // For an MCQ this is the chosen letter; for a jumble it is the typed sequence.
  const given = question ? (answers[question.question_number] ?? null) : null;
  const selected = isJumble ? null : (given as OptionKey | null);
  const sessionSolution = question ? (sessionSolutions[question.question_number] ?? null) : null;
  const isChecked = question ? !!correctAnswers[question.question_number] : false;
  const recordedAnswer = question ? correctAnswers[question.question_number] : undefined;
  const correctLetter = isJumble ? undefined : (recordedAnswer as OptionKey | undefined);
  const answerUnavailable = recordedAnswer === NO_ANSWER_SENTINEL;
  const canCheck = isJumble ? isCompleteSequence(given ?? "") : !!selected;

  // History is updated directly rather than through the router: this only records which
  // question is showing, and a router push would re-render the route for a value the
  // component already holds.
  const navigateTo = useCallback((num: number) => {
    setCurrentNum(num);
    const params = new URLSearchParams(window.location.search);
    params.set("q", String(num));
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, []);

  async function checkSolution() {
    if (!question || !canCheck) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/practice/questions/${question._id}/solution`);
      if (res.ok) {
        const data = (await res.json()) as PracticeQuestionSolution;
        setSessionSolutions((prev) => ({ ...prev, [question.question_number]: data }));
        // A jumble's answer lives in correct_text; the sentinel keeps a question with no
        // key at all from leaving the user on a button that does nothing.
        setCorrectAnswer(
          question.question_number,
          data.correct_answer ?? data.correct_text ?? NO_ANSWER_SENTINEL
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function getPillState(qNum: number): PillState {
    if (qNum === currentNum) return "current";
    const cl = correctAnswers[qNum];
    const ans = answers[qNum];
    // A question we could never grade counts as attempted, not as wrong.
    if (cl === NO_ANSWER_SENTINEL) return "answered";
    if (cl && ans) return ans === cl ? "correct" : "wrong";
    if (ans) return "answered";
    return "unanswered";
  }

  if (!question) return null;

  const optionState = (key: OptionKey): OptionState => {
    // With no key to grade against, the choice stays merely selected — marking it wrong
    // would be asserting something we don't know.
    if (correctLetter && !answerUnavailable) {
      if (key === correctLetter) return "correct";
      if (key === selected) return "wrong";
      return "idle";
    }
    return selected === key ? "selected" : "idle";
  };

  return (
    <div>
      {/* Content area — extra bottom padding so last element clears the fixed mobile bar */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          width: "100%",
          padding: "24px 16px",
          paddingBottom: "calc(24px + 60px + env(safe-area-inset-bottom, 0px))",
        }}
        className="md:[padding-bottom:24px]"
      >
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* Question area */}
          <div ref={containerRef} style={{ flex: 1, minWidth: 0 }}>
            {/* Back link */}
            <Link
              href={backHref}
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
              ← {backLabel}
            </Link>

            {/* Question header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span className="font-bold text-trust-navy" style={{ fontSize: 15 }}>
                Q{question.question_number}
              </span>
              <DifficultyBadge difficulty={question.difficulty} />
            </div>

            {/* Question text */}
            <div
              className="text-trust-navy"
              style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontWeight: 500 }}
            >
              <MathContent html={question.question} containerRef={containerRef} />
            </div>

            {/* Answer area — options for an MCQ, ordered sentences plus a sequence for a jumble */}
            {isJumble ? (
              <div>
                <ol style={{ listStyle: "none", padding: 0, margin: "0 0 18px" }}>
                  {OPTION_KEYS.map((key, i) => (
                    <li
                      key={key}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: "1.5px solid #E2E8F0",
                        marginBottom: 8,
                        fontSize: 14,
                        color: "#334155",
                        lineHeight: 1.7,
                      }}
                    >
                      <span className="font-bold" style={{ color: "#0F766E", flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ minWidth: 0 }}>
                        <MathContent html={question.options[key]} containerRef={containerRef} />
                      </span>
                    </li>
                  ))}
                </ol>

                <label
                  htmlFor="jumble-sequence"
                  style={{ display: "block", fontSize: 13, color: "#64748B", marginBottom: 6, fontWeight: 600 }}
                >
                  Enter the correct order (e.g. 2413)
                </label>
                <input
                  id="jumble-sequence"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  value={given ?? ""}
                  disabled={isChecked}
                  // Only digits 1-4 are meaningful, so anything else never reaches state.
                  onChange={(e) => {
                    const next = e.target.value.replace(/[^1-4]/g, "").slice(0, 4);
                    setAnswer(question.question_number, next);
                  }}
                  style={{
                    width: 140,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1.5px solid ${isChecked ? "#E2E8F0" : "#CBD5E1"}`,
                    background: isChecked ? "#F8FAFC" : "#fff",
                    color: "#1E3A5F",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "6px",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />

                {isChecked && (
                  <p
                    className="font-bold"
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: answerUnavailable ? "#92400E" : given === recordedAnswer ? "#065F46" : "#991B1B",
                    }}
                  >
                    {answerUnavailable
                      ? "The answer key is missing for this question."
                      : given === recordedAnswer
                        ? "Correct"
                        : `Incorrect — correct order: ${recordedAnswer}`}
                  </p>
                )}
              </div>
            ) : (
              <div>
                {OPTION_KEYS.map((key) => (
                  <PracticeOptionButton
                    key={key}
                    label={key}
                    state={optionState(key)}
                    disabled={isChecked}
                    onClick={() => !isChecked && setAnswer(question.question_number, key)}
                  >
                    <MathContent html={question.options[key]} containerRef={containerRef} />
                  </PracticeOptionButton>
                ))}
                {isChecked && answerUnavailable && (
                  <p className="font-bold" style={{ marginTop: 10, fontSize: 13, color: "#92400E" }}>
                    The answer key is missing for this question.
                  </p>
                )}
              </div>
            )}

            {/* Check Solution button — hidden once checked in any session */}
            {!isChecked && (
              <button
                onClick={checkSolution}
                disabled={!canCheck || loading}
                style={{
                  marginTop: 8,
                  padding: "11px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: canCheck ? "#1E3A5F" : "#E2E8F0",
                  color: canCheck ? "#fff" : "#94A3B8",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: canCheck ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  transition: "all 0.18s",
                }}
              >
                {loading ? "Loading…" : "Check Solution"}
              </button>
            )}

            {/* Explanation — only shown when fetched this session */}
            {sessionSolution && (
              <div
                style={{
                  marginTop: 20,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "#F8FAFC",
                  border: "1.5px solid #E2E8F0",
                }}
              >
                <div className="font-bold text-trust-navy" style={{ fontSize: 13, marginBottom: 8 }}>
                  Explanation
                </div>
                {sessionSolution.explanation ? (
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
                    <MathContent html={sessionSolution.explanation} containerRef={containerRef} />
                  </p>
                ) : (
                  <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>No explanation available.</p>
                )}
                {sessionSolution.solution_svg && (
                  <div
                    className="svg-diagram"
                    style={{ marginTop: 16 }}
                    dangerouslySetInnerHTML={{ __html: sessionSolution.solution_svg }}
                  />
                )}
              </div>
            )}

            {/* Prev / Next navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              <button
                onClick={() => currentNum > 1 && navigateTo(currentNum - 1)}
                disabled={currentNum <= 1}
                style={{
                  padding: "9px 20px",
                  borderRadius: 8,
                  border: "1.5px solid #E2E8F0",
                  background: "#fff",
                  color: currentNum <= 1 ? "#CBD5E1" : "#334155",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: currentNum <= 1 ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                ← Prev
              </button>
              <button
                onClick={() => currentNum < questions.length && navigateTo(currentNum + 1)}
                disabled={currentNum >= questions.length}
                style={{
                  padding: "9px 20px",
                  borderRadius: 8,
                  border: "1.5px solid #E2E8F0",
                  background: "#fff",
                  color: currentNum >= questions.length ? "#CBD5E1" : "#334155",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: currentNum >= questions.length ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Palette sidebar — desktop only */}
          <div
            className="hidden md:block"
            style={{
              width: 196,
              flexShrink: 0,
              background: "#fff",
              borderRadius: 12,
              border: "1.5px solid #E8EAF0",
              padding: "16px 14px",
              position: "sticky",
              top: 72,
            }}
          >
            <PracticePalette
              total={questions.length}
              getPillState={getPillState}
              currentNum={currentNum}
              onSelect={navigateTo}
              variant="sidebar"
            />
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom pill bar */}
      <PracticePalette
        total={questions.length}
        getPillState={getPillState}
        currentNum={currentNum}
        onSelect={navigateTo}
        variant="bottom-bar"
      />
    </div>
  );
}
