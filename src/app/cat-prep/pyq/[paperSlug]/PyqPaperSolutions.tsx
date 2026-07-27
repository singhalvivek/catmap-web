// PyqPaperSolutions — server-rendered full paper: every question, option and explanation in the initial HTML
import type { PyqSolvedPaper, PyqSolvedQuestion } from "@/app/cat-prep/models/pyq";
import { interleaveImages } from "@/lib/interleaveImages";
import { buildComprehensionGroups, letterFromIndex } from "@/lib/pyqPresentation";

// Classes rather than inline styles throughout: this component emits every question on
// the page, and a repeated `style` attribute is paid for twice — once in the DOM and
// again in the RSC flight payload. Worth ~10% of page weight on the largest papers.

// Rendered as plain text nodes rather than injected HTML: MathJax (loaded globally in
// layout.tsx) typesets the document on startup, so "$$..$$" in this markup is handled
// without the escape-then-inject dance the client player needs for its dynamic updates.
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

function correctAnswerLabel(question: PyqSolvedQuestion): string | null {
  if (question.type === "mcq") {
    return question.correctOptionIndex != null ? letterFromIndex(question.correctOptionIndex) : null;
  }
  return question.correctAnswer;
}

function QuestionBlock({ question }: { question: PyqSolvedQuestion }) {
  const answer = correctAnswerLabel(question);

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

      {question.options && question.options.length > 0 && (
        <ol className="m-0 mt-3 list-none p-0">
          {question.options.map((opt) => (
            <li
              key={opt.index}
              className="mb-1.5 flex gap-2.5 rounded-lg border-[1.5px] border-slate-200 px-3 py-2 text-sm leading-relaxed text-slate-700"
            >
              <span className="shrink-0 font-bold text-slate-500">{letterFromIndex(opt.index)}.</span>
              <span className="min-w-0">
                {opt.text}
                {opt.imageUrls.map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={url} src={url} alt="" loading="lazy" className="mt-1.5 block max-w-full rounded-md" />
                ))}
              </span>
            </li>
          ))}
        </ol>
      )}

      <details className="mt-3">
        <summary className="cursor-pointer py-1.5 text-[13px] font-bold text-teal-700">
          Answer &amp; explanation
        </summary>
        <div className="mt-2 rounded-[10px] border-[1.5px] border-slate-200 bg-slate-50 px-4 py-3.5">
          <p className="mb-2 text-[13px] font-bold text-trust-navy">
            {answer ? `Correct answer: ${answer}` : "Answer key unavailable for this question."}
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

export default function PyqPaperSolutions({ paper, label }: { paper: PyqSolvedPaper; label: string }) {
  const sections = paper.sections.filter((s) => s.questions.length > 0);
  if (sections.length === 0) return null;

  return (
    // The player's mobile question palette is fixed to the bottom of the viewport, so
    // without the trailing padding it covers the last explanation on small screens.
    <section className="mt-14 border-t border-slate-200 pt-10 pb-24 md:pb-0">
      <h2 className="m-0 mb-1.5 text-xl font-extrabold tracking-tight text-trust-navy">
        {label} — full paper with answers and explanations
      </h2>
      <p className="m-0 mb-7 text-[13px] leading-relaxed text-slate-500">
        Every question from this paper with its answer key and worked explanation. Use the player above to
        attempt them one at a time, or read straight through.
      </p>

      {sections.map((section) => (
        <div key={section.name} className="mb-10">
          <h3 className="m-0 mb-3.5 text-[17px] font-extrabold tracking-tight text-trust-navy">
            {section.name} — {section.questions.length} questions
          </h3>

          <div className="flex flex-col gap-5">
            {buildComprehensionGroups(section.questions).map((group) => (
              <div key={group.questions[0].id} className="flex flex-col gap-4">
                {group.comprehensionText && (
                  <div className="rounded-xl border-[1.5px] border-slate-200 bg-slate-50 px-5 py-4">
                    <div className="mb-2 text-[13px] font-bold text-trust-navy">
                      Passage for questions {group.questions[0].questionNumber}–
                      {group.questions[group.questions.length - 1].questionNumber}
                    </div>
                    <InlineContent
                      text={group.comprehensionText}
                      imageUrls={group.comprehensionImages}
                      imagePositions={group.comprehensionImagePositions}
                      textClass="mb-2.5 whitespace-pre-line text-sm leading-[1.8] text-slate-700"
                    />
                  </div>
                )}

                {group.questions.map((question) => (
                  <QuestionBlock key={question.id} question={question} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
