// PyqPaperReader — the whole paper on one page: every question readable and answerable, no account needed
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { PyqSolvedPaper, PyqSolvedQuestion } from "@/app/cat-prep/models/pyq";
import { interleaveImages } from "@/lib/interleaveImages";
import { buildComprehensionGroups, letterFromIndex } from "@/lib/pyqPresentation";
import { usePracticeProgress } from "@/app/cat-prep/lib/usePracticeProgress";
import { PracticeOptionButton, type OptionState } from "@/app/cat-prep/components/practice/PracticeOptionButton";
import TITAInput from "@/app/cat-prep/daily-dose/challenge/components/TITAInput";

// Locks a question as "checked" without matching any real option letter or
// parseFloat-able number, for the rare case the scraped answer is missing.
const NO_ANSWER_SENTINEL = "—";

function roundTo2dp(n: number): number {
  return Math.round(n * 100) / 100;
}

function sectionAnchor(name: string): string {
  return `section-${name.toLowerCase()}`;
}

// Cracku's scraped text is plain (not HTML) but may contain literal "$$...$$" LaTeX.
// MathJax is loaded globally in layout.tsx and typesets the document on startup, which
// covers the server-rendered pass; this re-typesets the container after hydration so
// content that changes (a revealed explanation) is picked up too.
function useMathJax(containerRef: React.RefObject<HTMLDivElement | null>, deps: unknown) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
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
  }, [containerRef, deps]);
}

// Renders scraped text with its images interleaved at their original positions
// (see interleaveImages); falls back to text-then-appended-images when a block has
// no positions. Text is a plain node — MathJax reads it from the DOM.
function InlineContent({
  text,
  imageUrls,
  imagePositions,
  textClass,
}: {
  text: string | null;
  imageUrls: string[];
  imagePositions?: number[];
  textClass: string;
}) {
  const items = interleaveImages(text ?? "", imageUrls ?? [], imagePositions);
  return (
    <>
      {items.map((item) =>
        item.kind === "text" ? (
          <p key={item.key} className={textClass}>
            {item.value}
          </p>
        ) : (
          // image origin is scraper-supplied and unknown at build time — next/image
          // needs pre-configured remotePatterns, so a plain img is used here
          // eslint-disable-next-line @next/next/no-img-element
          <img key={item.key} src={item.url} alt="" loading="lazy" className="my-2 max-w-full rounded-lg" />
        )
      )}
    </>
  );
}

function resolveCorrectKey(question: PyqSolvedQuestion): string {
  if (question.type === "mcq") {
    return question.correctOptionIndex != null
      ? letterFromIndex(question.correctOptionIndex)
      : NO_ANSWER_SENTINEL;
  }
  return question.correctAnswer ?? NO_ANSWER_SENTINEL;
}

function QuestionBlock({
  question,
  given,
  correctKey,
  onAnswer,
  onCheck,
}: {
  question: PyqSolvedQuestion;
  given: string | undefined;
  correctKey: string | undefined;
  onAnswer: (value: string) => void;
  onCheck: () => void;
}) {
  const isChecked = !!correctKey;

  function optionState(key: string): OptionState {
    if (correctKey) {
      if (key === correctKey) return "correct";
      if (key === given) return "wrong";
      return "idle";
    }
    return given === key ? "selected" : "idle";
  }

  const titaGiven = given ? parseFloat(given) : null;
  const titaCorrect = isChecked && correctKey ? parseFloat(correctKey) : null;
  const titaIsRight =
    titaCorrect != null &&
    titaGiven != null &&
    !Number.isNaN(titaCorrect) &&
    roundTo2dp(titaGiven) === roundTo2dp(titaCorrect);
  const mcqIsRight = isChecked && given === correctKey;

  return (
    <article
      id={`q-${question.section.toLowerCase()}-${question.questionNumber}`}
      className="scroll-mt-20 rounded-xl border-[1.5px] border-[#E8EAF0] bg-white px-5 py-4"
    >
      <h4 className="mb-2.5 text-sm font-bold text-trust-navy">Question {question.questionNumber}</h4>

      <InlineContent
        text={question.text}
        imageUrls={question.imageUrls}
        imagePositions={question.imagePositions}
        textClass="mb-2 whitespace-pre-line text-[15px] leading-[1.7] text-trust-navy"
      />

      <div className="mt-4">
        {question.type === "mcq" && question.options ? (
          question.options.map((opt) => {
            const key = letterFromIndex(opt.index);
            return (
              <PracticeOptionButton
                key={opt.index}
                label={key}
                state={optionState(key)}
                disabled={isChecked}
                onClick={() => !isChecked && onAnswer(key)}
              >
                <div>
                  {opt.text}
                  {opt.imageUrls.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={url} src={url} alt="" loading="lazy" className="mt-1.5 block max-w-full rounded-md" />
                  ))}
                </div>
              </PracticeOptionButton>
            );
          })
        ) : (
          <TITAInput
            value={titaGiven}
            onChange={(v) => onAnswer(v == null ? "" : String(v))}
            disabled={isChecked}
          />
        )}
      </div>

      {!isChecked ? (
        <button
          onClick={onCheck}
          disabled={!given}
          className={`mt-3 rounded-[10px] border-none px-6 py-2.5 text-sm font-bold ${
            given ? "cursor-pointer bg-trust-navy text-white" : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          Check Answer
        </button>
      ) : (
        <p
          className={`mt-3 mb-0 text-[13px] font-bold ${
            question.type === "mcq"
              ? mcqIsRight
                ? "text-emerald-800"
                : "text-red-800"
              : titaIsRight
                ? "text-emerald-800"
                : "text-red-800"
          }`}
        >
          {question.type === "mcq"
            ? mcqIsRight
              ? "Correct"
              : `Incorrect — correct answer: ${correctKey}`
            : titaIsRight
              ? "Correct"
              : `Incorrect — correct answer: ${correctKey}`}
        </p>
      )}

      <details className="mt-3" open={isChecked}>
        <summary className="cursor-pointer py-1.5 text-[13px] font-bold text-teal-700">
          Answer &amp; explanation
        </summary>
        <div className="mt-2 rounded-[10px] border-[1.5px] border-slate-200 bg-slate-50 px-4 py-3.5">
          <p className="mb-2 text-[13px] font-bold text-trust-navy">
            Correct answer: {resolveCorrectKey(question)}
          </p>
          {question.explanation.text || question.explanation.imageUrls.length > 0 ? (
            <InlineContent
              text={question.explanation.text}
              imageUrls={question.explanation.imageUrls}
              imagePositions={question.explanation.imagePositions}
              textClass="mb-2 whitespace-pre-line text-sm leading-[1.7] text-slate-700"
            />
          ) : (
            <p className="m-0 text-sm text-slate-400">No explanation available.</p>
          )}
        </div>
      </details>
    </article>
  );
}

export default function PyqPaperReader({ paper }: { paper: PyqSolvedPaper }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { answers, correctAnswers, setAnswer, setCorrectAnswer } = usePracticeProgress(paper.paperSlug);
  useMathJax(containerRef, answers);

  const sections = paper.sections.filter((s) => s.questions.length > 0);

  return (
    <div ref={containerRef}>
      <nav className="sticky top-16 z-40 -mx-6 mb-6 flex gap-2 border-b border-slate-200 bg-[#FFFDF8] px-6 py-3">
        <Link
          href="/cat-prep/pyq"
          className="rounded-full border-[1.5px] border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-500 no-underline"
        >
          ← All papers
        </Link>
        {sections.map((section) => (
          <a
            key={section.name}
            href={`#${sectionAnchor(section.name)}`}
            className="rounded-full border-[1.5px] border-trust-navy bg-white px-4 py-2 text-[13px] font-bold text-trust-navy no-underline"
          >
            {section.name}
          </a>
        ))}
      </nav>

      {sections.map((section) => (
        <section key={section.name} id={sectionAnchor(section.name)} className="mb-10 scroll-mt-32">
          <h2 className="m-0 mb-3.5 text-[17px] font-extrabold tracking-tight text-trust-navy">
            {section.name} — {section.questions.length} questions
          </h2>

          <div className="flex flex-col gap-5">
            {buildComprehensionGroups(section.questions).map((group) => (
              <div key={group.questions[0].id} className="flex flex-col gap-4">
                {group.comprehensionText && (
                  <div className="rounded-xl border-[1.5px] border-slate-200 bg-slate-50 px-5 py-4">
                    <h3 className="mb-2 text-[13px] font-bold text-trust-navy">
                      Passage for questions {group.questions[0].questionNumber}–
                      {group.questions[group.questions.length - 1].questionNumber}
                    </h3>
                    <InlineContent
                      text={group.comprehensionText}
                      imageUrls={group.comprehensionImages}
                      imagePositions={group.comprehensionImagePositions}
                      textClass="mb-2.5 whitespace-pre-line text-sm leading-[1.8] text-slate-700"
                    />
                  </div>
                )}

                {group.questions.map((question) => (
                  <QuestionBlock
                    key={question.id}
                    question={question}
                    given={answers[question.questionNumber]}
                    correctKey={correctAnswers[question.questionNumber]}
                    onAnswer={(value) => setAnswer(question.questionNumber, value)}
                    onCheck={() => setCorrectAnswer(question.questionNumber, resolveCorrectKey(question))}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
