// ReviewTestView — read-only, one-question-at-a-time review of a completed test,
// mirroring the live test's layout (header, palette, Prev/Next) with answers revealed
"use client";

import { useRef, useState } from "react";
import type { DailyChallengeResult, DailyTest } from "../../models/dailyChallenge";
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
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF8" }}>
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

              <span style={{ fontSize: 12, color: "#94A3B8", fontVariantNumeric: "tabular-nums" }}>
                {questionIndex + 1} / {section.questions.length}
              </span>

              <button
                onClick={goNext}
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
          background: "#fff",
          borderTop: "1.5px solid #E8EAF0",
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
                  borderRadius: 100,
                  background: isActive ? "#1E3A5F" : "#F1F5F9",
                  color: isActive ? "#fff" : "#64748B",
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
            const bg = isCurrent ? "#1E3A5F" : isUnattempted ? "#F1F5F9" : resp.correct ? "#DCFCE7" : "#FEE2E2";
            const color = isCurrent ? "#fff" : isUnattempted ? "#94A3B8" : resp.correct ? "#166534" : "#991B1B";
            const border = isCurrent ? "#1E3A5F" : isUnattempted ? "#E2E8F0" : resp.correct ? "#86EFAC" : "#FCA5A5";
            return (
              <button
                key={q.questionId}
                onClick={() => setQuestionIndex(idx)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
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
