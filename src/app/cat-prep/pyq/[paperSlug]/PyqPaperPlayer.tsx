// PyqPaperPlayer — interactive browse player for one PYQ paper; section tabs, split-panel passages, MCQ + TITA
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { PyqPaper, PyqSection, PyqSolution } from "@/app/cat-prep/models/pyq";
import { interleaveImages } from "@/lib/interleaveImages";
import {
  buildComprehensionGroups,
  indexGroupsByQuestionNumber,
  letterFromIndex,
} from "@/lib/pyqPresentation";
import { usePracticeProgress } from "@/app/cat-prep/lib/usePracticeProgress";
import { PracticeOptionButton, type OptionState } from "@/app/cat-prep/components/practice/PracticeOptionButton";
import { PracticePalette, type PillState } from "@/app/cat-prep/components/practice/PracticePalette";
import TITAInput from "@/app/cat-prep/daily-dose/challenge/components/TITAInput";

const SECTION_ORDER: PyqSection[] = ["VARC", "DILR", "QA"];
// Locks a question as "checked" without matching any real option letter or
// parseFloat-able number, for the rare case the scraped answer is missing.
const NO_ANSWER_SENTINEL = "—";

function roundTo2dp(n: number): number {
  return Math.round(n * 100) / 100;
}

function ImageStack({ urls }: { urls: string[] }) {
  if (!urls.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
      {urls.map((url) => (
        /* image origin is scraper-supplied and unknown at build time */
        // eslint-disable-next-line @next/next/no-img-element
        <img key={url} src={url} alt="" style={{ maxWidth: "100%", borderRadius: 8 }} />
      ))}
    </div>
  );
}

// Cracku's scraped text is plain (not HTML) but may contain literal "$$...$$" LaTeX,
// so it's typeset by MathJax rather than just printed. Escaped before being injected
// so stray "<"/">" (e.g. inequalities) aren't parsed as HTML before MathJax sees them.
function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function MathContent({ text, containerRef }: { text: string; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const html = escapeHtml(text);
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
      if (typeof mjax.typesetPromise === "function") mjax.typesetPromise([el]).catch(() => {});
    };
    if (mjax.startup?.promise) {
      mjax.startup.promise.then(run).catch(() => {});
    } else {
      run();
    }
  }, [html, containerRef]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// Renders scraped text with its images interleaved at their original positions
// (see interleaveImages); falls back to text-then-appended-images when a block has
// no positions. Mirrors InlineImageText but uses this player's MathContent renderer.
function InlineContent({
  text,
  imageUrls,
  imagePositions,
  containerRef,
  textStyle,
  imgStyle,
}: {
  text: string;
  imageUrls: string[];
  imagePositions?: number[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  textStyle?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
}) {
  const items = interleaveImages(text ?? "", imageUrls ?? [], imagePositions);
  return (
    <>
      {items.map((item) =>
        item.kind === "text" ? (
          <p key={item.key} style={textStyle}>
            <MathContent text={item.value} containerRef={containerRef} />
          </p>
        ) : (
          // image origin is scraper-supplied and unknown at build time
          // eslint-disable-next-line @next/next/no-img-element
          <img key={item.key} src={item.url} alt="" style={imgStyle} />
        )
      )}
    </>
  );
}

export default function PyqPaperPlayer({ paper }: { paper: PyqPaper }) {
  const [activeSection, setActiveSection] = useState<PyqSection>(SECTION_ORDER[0]);
  const [activeTab, setActiveTab] = useState<"passage" | "question">("passage");
  const containerRef = useRef<HTMLDivElement>(null);

  const section = paper.sections.find((s) => s.name === activeSection) ?? paper.sections[0];
  const byQuestionNumber = useMemo(
    () => indexGroupsByQuestionNumber(buildComprehensionGroups(section.questions)),
    [section]
  );

  const [currentQNum, setCurrentQNum] = useState(section.questions[0]?.questionNumber ?? 0);

  const { answers, correctAnswers, setAnswer, setCorrectAnswer } = usePracticeProgress(paper.paperSlug);
  const [sessionSolutions, setSessionSolutions] = useState<Record<number, PyqSolution>>({});
  const [loading, setLoading] = useState(false);
  // Questions whose solution we've already kicked off a fetch for, so the
  // auto-load effect below never re-fetches or loops.
  const autoLoadedRef = useRef<Set<number>>(new Set());

  const currentIndex = section.questions.findIndex((q) => q.questionNumber === currentQNum);
  const question = section.questions[currentIndex];
  const group = question ? byQuestionNumber.get(question.questionNumber) : undefined;

  const given = question ? answers[question.questionNumber] : undefined;
  const correctLetter = question ? correctAnswers[question.questionNumber] : undefined;
  const isChecked = !!correctLetter;
  const solution = question ? sessionSolutions[question.questionNumber] : undefined;

  // A question stays "checked" across reloads/navigation because correctAnswers is
  // persisted — but its solution lives only in component state and is lost. Without
  // this, a revisited question shows the answer key with no explanation and no
  // "Check Answer" button to re-fetch it. Re-load the solution when that happens.
  useEffect(() => {
    if (!question || !isChecked || sessionSolutions[question.questionNumber]) return;
    const qNum = question.questionNumber;
    if (autoLoadedRef.current.has(qNum)) return;
    autoLoadedRef.current.add(qNum);
    const qId = question.id;
    (async () => {
      try {
        const res = await fetch(`/api/pyq/${paper.paperSlug}/questions/${qId}/solution`);
        if (!res.ok) {
          autoLoadedRef.current.delete(qNum);
          return;
        }
        const data = (await res.json()) as PyqSolution;
        setSessionSolutions((prev) => ({ ...prev, [qNum]: data }));
      } catch {
        autoLoadedRef.current.delete(qNum);
      }
    })();
  }, [question, isChecked, sessionSolutions, paper.paperSlug]);

  function switchSection(name: PyqSection) {
    setActiveSection(name);
    setActiveTab("passage");
    const nextSection = paper.sections.find((s) => s.name === name);
    setCurrentQNum(nextSection?.questions[0]?.questionNumber ?? 0);
  }

  function navigateTo(qNum: number) {
    setCurrentQNum(qNum);
  }

  async function checkAnswer() {
    if (!question || !given) return;
    // Mark as loaded so the auto-load effect doesn't also fire for this question.
    autoLoadedRef.current.add(question.questionNumber);
    setLoading(true);
    try {
      const res = await fetch(`/api/pyq/${paper.paperSlug}/questions/${question.id}/solution`);
      if (!res.ok) return;
      const data = (await res.json()) as PyqSolution;
      setSessionSolutions((prev) => ({ ...prev, [question.questionNumber]: data }));
      const resolvedLetter =
        data.type === "mcq"
          ? (data.correctOptionIndex != null ? letterFromIndex(data.correctOptionIndex) : NO_ANSWER_SENTINEL)
          : data.correctAnswer ?? NO_ANSWER_SENTINEL;
      setCorrectAnswer(question.questionNumber, resolvedLetter);
    } finally {
      setLoading(false);
    }
  }

  function optionState(key: string): OptionState {
    if (correctLetter) {
      if (key === correctLetter) return "correct";
      if (key === given) return "wrong";
      return "idle";
    }
    return given === key ? "selected" : "idle";
  }

  function getPillState(localIndex: number): PillState {
    const q = section.questions[localIndex - 1];
    if (!q) return "unanswered";
    if (q.questionNumber === currentQNum) return "current";
    const qCorrect = correctAnswers[q.questionNumber];
    const qGiven = answers[q.questionNumber];
    if (qCorrect && qGiven) return qGiven === qCorrect ? "correct" : "wrong";
    if (qGiven) return "answered";
    return "unanswered";
  }

  const titaGiven = given ? parseFloat(given) : null;
  const titaCorrect = isChecked && correctLetter ? parseFloat(correctLetter) : null;
  const titaIsRight =
    titaCorrect != null && titaGiven != null && !Number.isNaN(titaCorrect) && roundTo2dp(titaGiven) === roundTo2dp(titaCorrect);

  const passageContent = group?.comprehensionText ? (
    <div>
      <InlineContent
        text={group.comprehensionText}
        imageUrls={group.comprehensionImages}
        imagePositions={group.comprehensionImagePositions}
        containerRef={containerRef}
        textStyle={{ fontSize: 14, color: "#334155", lineHeight: 1.8, whiteSpace: "pre-line", margin: "0 0 10px" }}
        imgStyle={{ maxWidth: "100%", borderRadius: 8, marginBottom: 10 }}
      />
    </div>
  ) : null;

  const questionContent = !question ? (
    <p style={{ fontSize: 14, color: "#94A3B8" }}>No questions scraped for this section yet.</p>
  ) : (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span className="font-bold text-trust-navy" style={{ fontSize: 15 }}>
          Q{question.questionNumber}
        </span>
      </div>

      <InlineContent
        text={question.text ?? ""}
        imageUrls={question.imageUrls}
        imagePositions={question.imagePositions}
        containerRef={containerRef}
        textStyle={{ fontSize: 15, color: "#1E3A5F", fontWeight: 500, lineHeight: 1.7, whiteSpace: "pre-line", margin: "0 0 8px" }}
        imgStyle={{ maxWidth: "100%", borderRadius: 8, marginBottom: 8 }}
      />

      <div style={{ marginTop: 16 }}>
        {question.type === "mcq" && question.options ? (
          question.options.map((opt) => {
            const key = letterFromIndex(opt.index);
            return (
              <PracticeOptionButton
                key={opt.index}
                label={key}
                state={optionState(key)}
                disabled={isChecked}
                onClick={() => !isChecked && setAnswer(question.questionNumber, key)}
              >
                <div>
                  <MathContent text={opt.text ?? ""} containerRef={containerRef} />
                  <ImageStack urls={opt.imageUrls} />
                </div>
              </PracticeOptionButton>
            );
          })
        ) : (
          <>
            <TITAInput
              value={titaGiven}
              onChange={(v) => setAnswer(question.questionNumber, v == null ? "" : String(v))}
              disabled={isChecked}
            />
            {isChecked && (
              <p
                className="font-bold"
                style={{ marginTop: 10, fontSize: 13, color: titaIsRight ? "#065F46" : "#991B1B" }}
              >
                {titaIsRight ? "Correct" : `Incorrect — correct answer: ${correctLetter}`}
              </p>
            )}
          </>
        )}
      </div>

      {!isChecked && (
        <button
          onClick={checkAnswer}
          disabled={!given || loading}
          style={{
            marginTop: 8,
            padding: "11px 24px",
            borderRadius: 10,
            border: "none",
            background: given ? "#1E3A5F" : "#E2E8F0",
            color: given ? "#fff" : "#94A3B8",
            fontSize: 14,
            fontWeight: 700,
            cursor: given ? "pointer" : "not-allowed",
            fontFamily: "inherit",
          }}
        >
          {loading ? "Loading…" : "Check Answer"}
        </button>
      )}

      {solution && (
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
          {solution.explanation.text || solution.explanation.imageUrls.length > 0 ? (
            <InlineContent
              text={solution.explanation.text ?? ""}
              imageUrls={solution.explanation.imageUrls}
              imagePositions={solution.explanation.imagePositions}
              containerRef={containerRef}
              textStyle={{ fontSize: 14, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-line", margin: "0 0 8px" }}
              imgStyle={{ maxWidth: "100%", borderRadius: 8, marginBottom: 8 }}
            />
          ) : (
            <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>No explanation available.</p>
          )}
        </div>
      )}

      {/* Prev / Next navigation within the section */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
        <button
          onClick={() => currentIndex > 0 && navigateTo(section.questions[currentIndex - 1].questionNumber)}
          disabled={currentIndex <= 0}
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            border: "1.5px solid #E2E8F0",
            background: "#fff",
            color: currentIndex <= 0 ? "#CBD5E1" : "#334155",
            fontSize: 13,
            fontWeight: 600,
            cursor: currentIndex <= 0 ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() =>
            currentIndex < section.questions.length - 1 &&
            navigateTo(section.questions[currentIndex + 1].questionNumber)
          }
          disabled={currentIndex >= section.questions.length - 1}
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            border: "1.5px solid #E2E8F0",
            background: "#fff",
            color: currentIndex >= section.questions.length - 1 ? "#CBD5E1" : "#334155",
            fontSize: 13,
            fontWeight: 600,
            cursor: currentIndex >= section.questions.length - 1 ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef}>
      <Link
        href="/cat-prep/pyq"
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
        ← Back to PYQ Papers
      </Link>

      {/* Section tabs */}
      <div className="flex gap-2" style={{ marginBottom: 20 }}>
        {SECTION_ORDER.map((name) => {
          const isActive = name === activeSection;
          return (
            <button
              key={name}
              onClick={() => switchSection(name)}
              className="font-bold"
              style={{
                padding: "9px 20px",
                borderRadius: 999,
                fontSize: 14,
                border: `1.5px solid ${isActive ? "#1E3A5F" : "rgba(30,58,95,0.18)"}`,
                background: isActive ? "#1E3A5F" : "#fff",
                color: isActive ? "#fff" : "#1E3A5F",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {passageContent ? (
            <>
              {/* Mobile tabs */}
              <div
                className="md:hidden"
                style={{
                  display: "flex",
                  marginBottom: 16,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1.5px solid #E2E8F0",
                }}
              >
                {(["passage", "question"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      border: "none",
                      background: activeTab === tab ? "#1E3A5F" : "#fff",
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

              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className={`${activeTab === "question" ? "hidden md:block" : ""} md:max-h-[70vh] md:overflow-y-auto md:pr-2`}
                >
                  {passageContent}
                </div>
                <div className={activeTab === "passage" ? "hidden md:block" : ""}>{questionContent}</div>
              </div>
            </>
          ) : (
            questionContent
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
          <PracticePalette
            total={section.questions.length}
            getPillState={getPillState}
            currentNum={currentIndex + 1}
            onSelect={(localIndex) => navigateTo(section.questions[localIndex - 1].questionNumber)}
            variant="sidebar"
          />
        </div>
      </div>

      {/* Mobile fixed bottom pill bar */}
      <PracticePalette
        total={section.questions.length}
        getPillState={getPillState}
        currentNum={currentIndex + 1}
        onSelect={(localIndex) => navigateTo(section.questions[localIndex - 1].questionNumber)}
        variant="bottom-bar"
      />
    </div>
  );
}
