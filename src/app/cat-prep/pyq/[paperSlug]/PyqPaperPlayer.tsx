// PyqPaperPlayer — interactive browse player for one PYQ paper; section tabs, split-panel passages, MCQ + TITA
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { PyqPaper, PyqQuestion, PyqSection, PyqSolution } from "@/app/cat-prep/models/pyq";
import { usePracticeProgress } from "@/app/cat-prep/lib/usePracticeProgress";
import { PracticeOptionButton, type OptionState } from "@/app/cat-prep/components/practice/PracticeOptionButton";
import { PracticePalette, type PillState } from "@/app/cat-prep/components/practice/PracticePalette";
import TITAInput from "@/app/cat-prep/daily-challenge/components/TITAInput";

const SECTION_ORDER: PyqSection[] = ["VARC", "DILR", "QA"];
// Locks a question as "checked" without matching any real option letter or
// parseFloat-able number, for the rare case the scraped answer is missing.
const NO_ANSWER_SENTINEL = "—";

type Group = {
  comprehensionId: string | null;
  comprehensionText: string | null;
  comprehensionImages: string[];
  questions: PyqQuestion[];
};

// Maps each question to the group of consecutive questions it shares a comprehension
// with (for split-panel rendering); standalone questions are their own group of one.
function buildGroupsByQuestionNumber(questions: PyqQuestion[]): Map<number, Group> {
  const byQuestionNumber = new Map<number, Group>();
  let last: Group | undefined;
  for (const q of questions) {
    if (q.comprehension && last && last.comprehensionId === q.comprehension.id) {
      last.questions.push(q);
    } else {
      last = {
        comprehensionId: q.comprehension?.id ?? null,
        comprehensionText: q.comprehension?.text ?? null,
        comprehensionImages: q.comprehension?.imageUrls ?? [],
        questions: [q],
      };
    }
    byQuestionNumber.set(q.questionNumber, last);
  }
  return byQuestionNumber;
}

function letterFromIndex(index: number): string {
  return String.fromCharCode(65 + index);
}

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

export default function PyqPaperPlayer({ paper }: { paper: PyqPaper }) {
  const [authUser, setAuthUser] = useState<User | null | "loading">("loading");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setAuthUser(u));
  }, []);

  const [activeSection, setActiveSection] = useState<PyqSection>(SECTION_ORDER[0]);
  const [activeTab, setActiveTab] = useState<"passage" | "question">("passage");
  const containerRef = useRef<HTMLDivElement>(null);

  const section = paper.sections.find((s) => s.name === activeSection) ?? paper.sections[0];
  const byQuestionNumber = useMemo(() => buildGroupsByQuestionNumber(section.questions), [section]);

  const [currentQNum, setCurrentQNum] = useState(section.questions[0]?.questionNumber ?? 0);

  const { answers, correctAnswers, setAnswer, setCorrectAnswer } = usePracticeProgress(paper.paperSlug);
  const [sessionSolutions, setSessionSolutions] = useState<Record<number, PyqSolution>>({});
  const [loading, setLoading] = useState(false);

  const currentIndex = section.questions.findIndex((q) => q.questionNumber === currentQNum);
  const question = section.questions[currentIndex];
  const group = question ? byQuestionNumber.get(question.questionNumber) : undefined;

  const given = question ? answers[question.questionNumber] : undefined;
  const correctLetter = question ? correctAnswers[question.questionNumber] : undefined;
  const isChecked = !!correctLetter;
  const solution = question ? sessionSolutions[question.questionNumber] : undefined;

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
      <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, whiteSpace: "pre-line", margin: 0 }}>
        <MathContent text={group.comprehensionText} containerRef={containerRef} />
      </p>
      <ImageStack urls={group.comprehensionImages} />
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

      <div style={{ fontSize: 15, color: "#1E3A5F", fontWeight: 500, lineHeight: 1.7, whiteSpace: "pre-line" }}>
        <MathContent text={question.text ?? ""} containerRef={containerRef} />
      </div>
      <ImageStack urls={question.imageUrls} />

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
          {solution.explanation.text ? (
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
              <MathContent text={solution.explanation.text} containerRef={containerRef} />
            </p>
          ) : (
            <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>No explanation available.</p>
          )}
          <ImageStack urls={solution.explanation.imageUrls} />
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

  if (authUser === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF8" }}>
        <p className="text-slate-500 text-sm">Loading…</p>
      </div>
    );
  }

  if (!authUser) {
    const handleLogin = async () => {
      setAuthError(null);
      try {
        await signInWithPopup(auth, googleProvider);
      } catch {
        setAuthError("Could not sign in. Please try again.");
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF8" }}>
        <div style={{ maxWidth: 360, textAlign: "center", padding: "32px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <h2 className="font-extrabold text-trust-navy" style={{ fontSize: 22, marginBottom: 8 }}>
            Sign in to practice
          </h2>
          <p className="text-slate-500" style={{ fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
            Your progress is saved to your account so you can pick up where you left off.
          </p>
          <button
            type="button"
            onClick={handleLogin}
            className="font-bold text-white w-full"
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              background: "#1E3A5F",
              border: "none",
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Login with Google
          </button>
          {authError && <p className="text-red-600 text-xs mt-3">{authError}</p>}
        </div>
      </div>
    );
  }

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
