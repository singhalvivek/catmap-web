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

const PALETTE_STYLES: Record<VisitStatus | "current", { bg: string; color: string; border: string }> = {
  not_visited:       { bg: "#F1F5F9", color: "#94A3B8", border: "#E2E8F0" },
  visited:           { bg: "#FEF9C3", color: "#854D0E", border: "#FDE047" },
  answered:          { bg: "#DCFCE7", color: "#166534", border: "#86EFAC" },
  marked_for_review: { bg: "#EDE9FE", color: "#5B21B6", border: "#A78BFA" },
  current:           { bg: "#1E3A5F", color: "#fff",    border: "#1E3A5F" },
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
          style={{ background: "#FFFDF8" }}
        >
          <p className="text-slate-500 text-sm">Evaluating your answers…</p>
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
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF8" }}>
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
                  borderRadius: 8,
                  background: "#F1F5F9",
                  color: "#1E3A5F",
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                  cursor: hasPrev ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                }}
              >
                ← Prev
              </button>

              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, color: "#94A3B8", fontVariantNumeric: "tabular-nums" }}>
                  {questionIndex + 1} / {section.questions.length}
                </span>
                <button
                  onClick={() => toggleMarkForReview(question.questionId)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 7,
                    background:
                      visitStatus[question.questionId] === "marked_for_review"
                        ? "#EDE9FE"
                        : "#F1F5F9",
                    color:
                      visitStatus[question.questionId] === "marked_for_review"
                        ? "#5B21B6"
                        : "#94A3B8",
                    border: `1.5px solid ${
                      visitStatus[question.questionId] === "marked_for_review"
                        ? "#A78BFA"
                        : "#E2E8F0"
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
                  borderRadius: 8,
                  background: rightBtnDisabled ? "#F1F5F9" : "#1E3A5F",
                  color: rightBtnDisabled ? "#94A3B8" : "#fff",
                  border: "1px solid #E2E8F0",
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
                  borderRadius: 10,
                  border: "1.5px solid #E8EAF0",
                  background: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span className="text-slate-500" style={{ fontSize: 13 }}>
                  Done with this section? Move to the next — you cannot come back.
                </span>
                <button
                  onClick={goToNextSection}
                  className="font-bold"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: "#1E3A5F",
                    color: "#fff",
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
              background: "#fff",
              borderRadius: 12,
              border: "1.5px solid #E8EAF0",
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
          background: "#fff",
          borderTop: "1.5px solid #E8EAF0",
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
                  borderRadius: 8,
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
              background: "#fff",
              borderRadius: 18,
              padding: "28px 24px 24px",
              maxWidth: 360,
              width: "100%",
              boxShadow: "0 24px 64px rgba(15,23,42,0.22)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-extrabold text-trust-navy" style={{ fontSize: 18, marginBottom: 16 }}>
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
                { label: "Answered", value: answeredCount, color: "#166534", bg: "#DCFCE7", border: "#86EFAC" },
                { label: "Unanswered", value: unansweredCount, color: "#991B1B", bg: "#FEE2E2", border: "#FCA5A5" },
                { label: "For Review", value: markedCount, color: "#5B21B6", bg: "#EDE9FE", border: "#A78BFA" },
              ].map(({ label, value, color, bg, border }) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    padding: "10px 8px",
                    borderRadius: 10,
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

            <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 20, lineHeight: 1.5 }}>
              Once submitted, you cannot change your answers.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="font-semibold"
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 9,
                  background: "#F1F5F9",
                  color: "#1E3A5F",
                  border: "1px solid #E2E8F0",
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
                  borderRadius: 9,
                  background: "#1E3A5F",
                  color: "#fff",
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
