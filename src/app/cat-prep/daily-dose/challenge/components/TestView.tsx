// TestView — test-taking shell; drives section/question/timer state and hands off to ResultView
"use client";

import { useEffect, useRef, useState } from "react";
import type {
  DailyChallengeDraft,
  DailyTest,
  DailyChallengeResult,
  SerializedDailyChallengeResult,
  VisitStatus,
} from "../../../models/dailyChallenge";
import { useDailyChallengeTest, type TestHook } from "../lib/useDailyChallengeTest";
import { saveDailyChallengeDraft, clearDailyChallengeDraft, saveResultLocally } from "../../../lib/dailyChallengeStore";
import { trackEvent } from "@/app/components/analytics";
import SectionHeader from "./SectionHeader";
import QuestionPalette from "./QuestionPalette";
import QuestionRenderer from "./QuestionRenderer";
import ResultView from "./ResultView";

type Props = {
  test: DailyTest;
  date: string;
  uid: string;
  initialState?: DailyChallengeDraft;
};

/* "answered" is not "correct" — nothing is graded until submit, so it takes the ink scale
   rather than the correct-answer green. Only the review palette may use --correct-*. */
const PALETTE_STYLES: Record<VisitStatus | "current", { bg: string; color: string; border: string }> = {
  not_visited:       { bg: "var(--paper-sunk)", color: "var(--inert-text)", border: "var(--rule)" },
  visited:           { bg: "var(--caution-wash)", color: "var(--caution-text)", border: "var(--caution-text)" },
  answered:          { bg: "var(--paper-sunk)", color: "var(--ink)", border: "var(--ink)" },
  marked_for_review: { bg: "var(--review-wash)", color: "var(--review-text)", border: "var(--review-text)" },
  current:           { bg: "var(--ink)", color: "var(--paper)", border: "var(--ink)" },
};

export default function TestView({ test, date, uid, initialState }: Props) {
  const [result, setResult] = useState<DailyChallengeResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const collectTimingRef = useRef<TestHook["collectTimingSnapshot"] | null>(null);
  const mobilePaletteRef = useRef<HTMLDivElement>(null);

  const {
    section,
    question,
    sectionIndex,
    questionIndex,
    sectionTimeLeft,
    questionTimeLeft,
    visitStatus,
    responses,
    isComplete,
    goToQuestion,
    goToNextSection,
    setMCQAnswer,
    setTITAAnswer,
    toggleMarkForReview,
    submitChallenge,
    collectTimingSnapshot,
  } = useDailyChallengeTest(test, initialState);

  collectTimingRef.current = collectTimingSnapshot;

  const sectionTimeLeftRef = useRef(sectionTimeLeft);
  sectionTimeLeftRef.current = sectionTimeLeft;
  const questionIndexRef = useRef(questionIndex);
  questionIndexRef.current = questionIndex;
  const visitStatusRef = useRef(visitStatus);
  visitStatusRef.current = visitStatus;
  const responsesRef = useRef(responses);
  responsesRef.current = responses;

  const totalQuestions = test.sections.reduce((sum, s) => sum + s.questions.length, 0);

  const startParams = useRef({ initialState, challenge_date: date, total_questions: totalQuestions });
  useEffect(() => {
    if (!startParams.current.initialState) {
      trackEvent("daily_challenge_started", {
        challenge_date: startParams.current.challenge_date,
        total_questions: startParams.current.total_questions,
      });
    }
  }, []);

  // Keep the current question button centred in the mobile palette bar
  useEffect(() => {
    const container = mobilePaletteRef.current;
    if (!container) return;
    const btn = container.children[questionIndex] as HTMLElement | undefined;
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [questionIndex]);

  // Auto-save draft on every answer or section change (debounced 1s); skip when complete
  useEffect(() => {
    if (isComplete) return;
    const id = setTimeout(() => {
      saveDailyChallengeDraft(uid, date, {
        testId: test.testId,
        sectionIndex,
        questionIndex: questionIndexRef.current,
        sectionTimeLeft: sectionTimeLeftRef.current,
        responses,
        visitStatus: visitStatusRef.current,
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [responses, sectionIndex, isComplete, date, uid, test.testId]);

  // When the test ends: submit to API, save result to localStorage
  useEffect(() => {
    if (!isComplete || !collectTimingRef.current) return;

    async function finalise() {
      setSaving(true);
      setSaveError(false);
      try {
        const { timings, totalTimeSeconds } = collectTimingRef.current!();
        const res = await fetch("/api/submit-attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, uid, responses: responsesRef.current, timings, totalTimeSeconds }),
        });

        if (res.status === 409) {
          const stored = await fetch(
            `/api/daily-challenge-result?uid=${encodeURIComponent(uid)}&date=${encodeURIComponent(date)}`
          );
          if (stored.ok) {
            const data = (await stored.json()) as SerializedDailyChallengeResult;
            const computed: DailyChallengeResult = { ...data, completedAt: new Date(data.completedAt) };
            saveResultLocally(uid, date, computed);
            setResult(computed);
          }
          return;
        }

        if (!res.ok) throw new Error(`Submit failed: ${res.status}`);

        const data = (await res.json()) as SerializedDailyChallengeResult;
        const computed: DailyChallengeResult = { ...data, completedAt: new Date(data.completedAt) };
        saveResultLocally(uid, date, computed);
        clearDailyChallengeDraft(uid, date);
        setResult(computed);
        const correct = computed.sections.reduce((n, s) => n + Object.values(s.responses).filter((r) => r.correct).length, 0);
        trackEvent("daily_challenge_submitted", {
          challenge_date: date,
          total_questions: totalQuestions,
          correct_count: correct,
          score_percent: Math.round((correct / totalQuestions) * 100),
          time_taken_seconds: data.totalTimeSeconds ?? 0,
        });
      } catch (err) {
        console.error("[TestView] finalise failed:", err);
        setSaveError(true);
      } finally {
        setSaving(false);
      }
    }

    finalise();
  }, [isComplete, date, uid]);

  // --- Completed state ---
  if (isComplete) {
    if (saving || !result) {
      return (
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--paper)" }}
        >
          <p className="ed-muted text-sm">Evaluating your answers…</p>
        </div>
      );
    }

    return (
      <ResultView
        result={result}
        test={test}
        saveError={saveError}
        reviewHref={`/cat-prep/daily-dose/challenge/review?date=${encodeURIComponent(date)}`}
      />
    );
  }

  if (!section || !question) return null;

  const hasPrev = questionIndex > 0;
  const hasNext = questionIndex < section.questions.length - 1;
  const isLastSection = sectionIndex === test.sections.length - 1;

  // Right nav button state
  let rightBtnLabel = "Save & Next →";
  let rightBtnAction = () => goToQuestion(questionIndex + 1);
  let rightBtnDisabled = false;
  if (!hasNext) {
    if (isLastSection) {
      rightBtnLabel = "Save & Submit";
      rightBtnAction = () => setShowConfirmModal(true);
    } else {
      rightBtnDisabled = true;
    }
  }

  // Stats for submit confirm modal
  const answeredCount = section.questions.filter(
    (q) => responses[q.questionId] != null
  ).length;
  const markedCount = section.questions.filter(
    (q) => visitStatus[q.questionId] === "marked_for_review"
  ).length;
  const unansweredCount = section.questions.length - answeredCount;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <SectionHeader
        sectionName={section.name}
        sectionTimeLeft={sectionTimeLeft}
        questionTimeLeft={questionTimeLeft}
        onSubmitChallenge={() => setShowConfirmModal(true)}
      />

      {/*
        On mobile the fixed palette bar is ~60px tall. Add matching bottom padding
        so the last content element is never hidden behind it.
        env(safe-area-inset-bottom) handles iOS home-indicator overlap.
      */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          width: "100%",
          padding: "24px 16px",
          paddingBottom: "calc(24px + 60px + env(safe-area-inset-bottom, 0px))",
          flex: 1,
        }}
        className="md:[padding-bottom:24px]"
      >
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* Question area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <QuestionRenderer
              question={question}
              questionNumber={questionIndex + 1}
              response={responses[question.questionId] ?? null}
              onMCQSelect={(idx) => setMCQAnswer(question.questionId, idx)}
              onTITAChange={(val) => setTITAAnswer(question.questionId, val)}
            />

            {/* Navigation row */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => goToQuestion(questionIndex - 1)}
                disabled={!hasPrev}
                className="font-semibold disabled:opacity-40"
                style={{
                  padding: "9px 20px",
                  background: "var(--paper-sunk)",
                  color: "var(--ink)",
                  border: "1px solid var(--rule-firm)",
                  fontSize: 13,
                  cursor: hasPrev ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                }}
              >
                ← Prev
              </button>

              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, color: "var(--ink-faint)", fontVariantNumeric: "tabular-nums" }}>
                  {questionIndex + 1} / {section.questions.length}
                </span>
                <button
                  onClick={() => toggleMarkForReview(question.questionId)}
                  style={{
                    padding: "7px 14px",
                    background:
                      visitStatus[question.questionId] === "marked_for_review"
                        ? "var(--review-wash)"
                        : "var(--paper-sunk)",
                    color:
                      visitStatus[question.questionId] === "marked_for_review"
                        ? "var(--review-text)"
                        : "var(--ink-faint)",
                    border: `1.5px solid ${
                      visitStatus[question.questionId] === "marked_for_review"
                        ? "var(--review-text)"
                        : "var(--rule-firm)"
                    }`,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {visitStatus[question.questionId] === "marked_for_review"
                    ? "★ Review"
                    : "☆ Review"}
                </button>
              </div>

              <button
                onClick={rightBtnAction}
                disabled={rightBtnDisabled}
                className="font-semibold disabled:opacity-40"
                style={{
                  padding: "9px 20px",
                  background: rightBtnDisabled ? "var(--paper-sunk)" : "var(--ink)",
                  color: rightBtnDisabled ? "var(--ink-faint)" : "var(--paper)",
                  border: "1px solid var(--rule-firm)",
                  fontSize: 13,
                  cursor: rightBtnDisabled ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {rightBtnLabel}
              </button>
            </div>

            {/* Next Section button — shown when a next section exists */}
            {sectionIndex < test.sections.length - 1 && (
              <div
                style={{
                  marginTop: 18,
                  padding: "14px 16px",
                  border: "1.5px solid var(--rule)",
                  background: "var(--paper-sunk)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span className="ed-muted" style={{ fontSize: 13 }}>
                  Done with this section? Move to the next — you cannot come back.
                </span>
                <button
                  onClick={goToNextSection}
                  className="font-bold"
                  style={{
                    padding: "8px 18px",
                    background: "var(--ink)",
                    color: "var(--paper)",
                    border: "none",
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    marginLeft: 16,
                    flexShrink: 0,
                  }}
                >
                  Next Section →
                </button>
              </div>
            )}
          </div>

          {/* Palette sidebar — desktop only */}
          <div
            className="hidden md:block"
            style={{
              width: 196,
              flexShrink: 0,
              background: "var(--paper)",
              border: "1.5px solid var(--rule)",
              padding: "16px 14px",
              position: "sticky",
              top: 72,
            }}
          >
            <QuestionPalette
              sectionName={section.name}
              questions={section.questions}
              visitStatus={visitStatus}
              currentIndex={questionIndex}
              onSelect={goToQuestion}
            />
          </div>
        </div>
      </div>

      {/* Mobile-only fixed question palette bar */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "var(--paper)",
          borderTop: "1.5px solid var(--rule)",
          boxShadow: "0 -4px 20px rgba(30,58,95,0.08)",
          zIndex: 50,
          padding: "10px 16px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          ref={mobilePaletteRef}
          style={{
            display: "flex",
            gap: 7,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {section.questions.map((q, idx) => {
            const isCurrent = idx === questionIndex;
            const styleKey = isCurrent ? "current" : (visitStatus[q.questionId] ?? "not_visited");
            const s = PALETTE_STYLES[styleKey];
            return (
              <button
                key={q.questionId}
                onClick={() => goToQuestion(idx)}
                style={{
                  width: 36,
                  height: 36,
                  background: s.bg,
                  color: s.color,
                  border: `1.5px solid ${s.border}`,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm submit modal */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            style={{
              background: "var(--paper)",
              padding: "28px 24px 24px",
              maxWidth: 360,
              width: "100%",
              boxShadow: "0 24px 64px rgba(15,23,42,0.22)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-extrabold" style={{ fontSize: 18, marginBottom: 16, color: "var(--ink)" }}>
              Submit Challenge?
            </p>

            {/* Attempt summary */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {[
                /* Answered is not "correct" and unanswered is not "wrong" — on a +3/-1 paper a
                   skipped question costs nothing, so it reads as caution, not as a loss. */
                { label: "Answered", value: answeredCount, color: "var(--ink)", bg: "var(--paper-sunk)", border: "var(--ink)" },
                { label: "Unanswered", value: unansweredCount, color: "var(--caution-text)", bg: "var(--caution-wash)", border: "var(--caution-text)" },
                { label: "For Review", value: markedCount, color: "var(--review-text)", bg: "var(--review-wash)", border: "var(--review-text)" },
              ].map(({ label, value, color, bg, border }) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    padding: "10px 8px",
                    background: bg,
                    border: `1.5px solid ${border}`,
                  }}
                >
                  <p className="font-extrabold" style={{ fontSize: 20, color, lineHeight: 1 }}>
                    {value}
                  </p>
                  <p style={{ fontSize: 10, color, marginTop: 4, fontWeight: 600, opacity: 0.8 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 20, lineHeight: 1.5 }}>
              Once submitted, you cannot change your answers.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="font-semibold"
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "var(--paper-sunk)",
                  color: "var(--ink)",
                  border: "1px solid var(--rule-firm)",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowConfirmModal(false); submitChallenge(); }}
                className="font-bold"
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  border: "none",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Submit →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
