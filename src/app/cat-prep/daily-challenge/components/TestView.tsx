// TestView — test-taking shell; drives section/question/timer state and hands off to ResultView
"use client";

import { useEffect, useRef, useState } from "react";
import type { AnswerKey, DailyChallengeDraft, DailyTest, DailyChallengeResult } from "../../models/dailyChallenge";
import { useDailyChallengeTest, type TestHook } from "../lib/useDailyChallengeTest";
import {
  saveDailyChallengeResult,
  saveDailyChallengeDraft,
  clearDailyChallengeDraft,
} from "../../lib/dailyChallengeStore";
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

export default function TestView({ test, date, uid, initialState }: Props) {
  const [result, setResult] = useState<DailyChallengeResult | null>(null);
  const [answerKey, setAnswerKey] = useState<AnswerKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Ref so finalise() always calls the latest computeResult closure (which captures responses)
  // without needing computeResult in the effect's dep array (it changes every render)
  const computeResultRef = useRef<TestHook["computeResult"] | null>(null);

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
    computeResult,
  } = useDailyChallengeTest(test, initialState);

  // Keep the ref current so the finalise effect always scores with the latest responses
  computeResultRef.current = computeResult;

  // Refs for values that change frequently — lets the draft save read latest without re-triggering
  const sectionTimeLeftRef = useRef(sectionTimeLeft);
  sectionTimeLeftRef.current = sectionTimeLeft;
  const questionIndexRef = useRef(questionIndex);
  questionIndexRef.current = questionIndex;
  const visitStatusRef = useRef(visitStatus);
  visitStatusRef.current = visitStatus;

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
      }).catch(() => {});
    }, 1000);
    return () => clearTimeout(id);
  }, [responses, sectionIndex, isComplete, uid, date, test.testId]);

  // When the test ends: fetch answer key, score, save to Firestore
  useEffect(() => {
    if (!isComplete || !computeResultRef.current) return;

    async function finalise() {
      setSaving(true);
      setSaveError(false);
      try {
        const res = await fetch(`/answers/${date}.json`);
        if (!res.ok) throw new Error("answer key not found");
        const key: AnswerKey = await res.json();
        const computed = computeResultRef.current!(key);
        setAnswerKey(key);
        setResult(computed);
        await saveDailyChallengeResult(uid, date, computed);
        await clearDailyChallengeDraft(uid, date).catch(() => {});
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
        answerKey={answerKey}
        saveError={saveError}
      />
    );
  }

  if (!section || !question) return null;

  const hasPrev = questionIndex > 0;
  const hasNext = questionIndex < section.questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF8" }}>
      <SectionHeader
        challengeName="Daily Challenge"
        sectionIndex={sectionIndex}
        totalSections={test.sections.length}
        sectionTimeLeft={sectionTimeLeft}
        questionTimeLeft={questionTimeLeft}
        onSubmitChallenge={submitChallenge}
      />

      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          width: "100%",
          padding: "24px 16px",
          flex: 1,
        }}
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

            {/* Navigation row: Prev · Review · Save & Next */}
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
                <span className="text-slate-400" style={{ fontSize: 12 }}>
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
                onClick={() => goToQuestion(questionIndex + 1)}
                disabled={!hasNext}
                className="font-semibold disabled:opacity-40"
                style={{
                  padding: "9px 20px",
                  borderRadius: 8,
                  background: hasNext ? "#1E3A5F" : "#F1F5F9",
                  color: hasNext ? "#fff" : "#94A3B8",
                  border: "1px solid #E2E8F0",
                  fontSize: 13,
                  cursor: hasNext ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                }}
              >
                Save & Next →
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
    </div>
  );
}
