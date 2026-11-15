// ReviewTestView — read-only, one-question-at-a-time review of a completed test,
// mirroring the live test's layout (header, palette, Prev/Next) with answers revealed
"use client";

import { useRef, useState } from "react";
import type { DailyChallengeResult, DailyTest } from "../../../models/dailyChallenge";
import ReviewHeader from "./ReviewHeader";
import ReviewQuestionPalette from "./ReviewQuestionPalette";
import QuestionReviewCard from "./QuestionReviewCard";

type Props = {
  test: DailyTest;
  result: DailyChallengeResult;
  title: string;
  backHref: string;
};

export default function ReviewTestView({ test, result, title, backHref }: Props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const mobilePaletteRef = useRef<HTMLDivElement>(null);

  const section = test.sections[sectionIndex];
  const question = section.questions[questionIndex];
  const sectionResult = result.sections[sectionIndex];
  const responses = sectionResult?.responses ?? {};

  const hasPrev = sectionIndex > 0 || questionIndex > 0;
  const hasNext = sectionIndex < test.sections.length - 1 || questionIndex < section.questions.length - 1;

  function goPrev() {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else if (sectionIndex > 0) {
      const prevSection = test.sections[sectionIndex - 1];
      setSectionIndex(sectionIndex - 1);
      setQuestionIndex(prevSection.questions.length - 1);
    }
  }

  function goNext() {
    if (questionIndex < section.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else if (sectionIndex < test.sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setQuestionIndex(0);
    }
  }

  function selectSection(idx: number) {
    setSectionIndex(idx);
    setQuestionIndex(0);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <ReviewHeader title={title} backHref={backHref} />

      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          width: "100%",
          padding: "20px 16px 24px",
          paddingBottom: "calc(24px + 96px + env(safe-area-inset-bottom, 0px))",
          flex: 1,
        }}
        className="md:[padding-bottom:24px]"
      >
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* Question area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <QuestionReviewCard
              question={question}
              response={responses[question.questionId]}
              questionNumber={questionIndex + 1}
            />

            {/* Navigation row */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={goPrev}
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

              <span style={{ fontSize: 12, color: "var(--ink-faint)", fontVariantNumeric: "tabular-nums" }}>
                {questionIndex + 1} / {section.questions.length}
              </span>

              <button
                onClick={goNext}
                disabled={!hasNext}
                className="font-semibold disabled:opacity-40"
                style={{
                  padding: "9px 20px",
                  background: hasNext ? "var(--ink)" : "var(--paper-sunk)",
                  color: hasNext ? "var(--paper)" : "var(--ink-faint)",
                  border: "1px solid var(--rule-firm)",
                  fontSize: 13,
                  cursor: hasNext ? "pointer" : "not-allowed",
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
              background: "var(--paper)",
              border: "1.5px solid var(--rule)",
              padding: "16px 14px",
              position: "sticky",
              top: 72,
            }}
          >
            <ReviewQuestionPalette
              sectionNames={test.sections.map((s) => s.name)}
              activeSectionIndex={sectionIndex}
              onSelectSection={selectSection}
              questions={section.questions}
              responses={responses}
              currentIndex={questionIndex}
              onSelect={setQuestionIndex}
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
        <div className="flex gap-1.5" style={{ marginBottom: 8 }}>
          {test.sections.map((s, idx) => {
            const isActive = idx === sectionIndex;
            return (
              <button
                key={s.name}
                onClick={() => selectSection(idx)}
                className="font-bold"
                style={{
                  flex: 1,
                  padding: "5px 0",
                  background: isActive ? "var(--ink)" : "var(--paper-sunk)",
                  color: isActive ? "var(--paper)" : "var(--ink-faint)",
                  border: "none",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {s.name}
              </button>
            );
          })}
        </div>
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
            const resp = responses[q.questionId];
            const isUnattempted = !resp || resp.given === null;
            const bg = isCurrent ? "var(--ink)" : isUnattempted ? "var(--paper-sunk)" : resp.correct ? "var(--correct-wash)" : "var(--wrong-wash)";
            const color = isCurrent ? "var(--paper)" : isUnattempted ? "var(--inert-text)" : resp.correct ? "var(--correct-text)" : "var(--wrong-text)";
            const border = isCurrent ? "var(--ink)" : isUnattempted ? "var(--rule)" : resp.correct ? "var(--correct-text)" : "var(--wrong-text)";
            return (
              <button
                key={q.questionId}
                onClick={() => setQuestionIndex(idx)}
                style={{
                  width: 36,
                  height: 36,
                  background: bg,
                  color,
                  border: `1.5px solid ${border}`,
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
    </div>
  );
}
