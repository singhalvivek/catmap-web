// PyqTopicSet — a topic's past-paper questions, one block per paper, each answer saved against its paper
"use client";

import { useRef } from "react";
import Link from "next/link";
import type { PyqTopicPaper } from "@/app/cat-prep/models/pyq";
import type { PyqTopic } from "@/constants/pyqTopics";
import { pyqPaperLabel } from "@/constants/pyqPapers";
import { PYQ_INDEX } from "@/constants/routes";
import { listYears, pyqTopicHref, questionCountLabel } from "@/lib/pyqTopicQuery";
import { usePracticeProgress } from "@/app/cat-prep/lib/usePracticeProgress";
import { useMathJax } from "@/app/cat-prep/lib/useMathJax";
import PyqQuestionList from "@/app/cat-prep/components/PyqQuestionList";

type PageInfo = {
  index: number;
  count: number;
  /** 1-based positions of this page's first and last questions in the whole set. */
  firstQuestion: number;
  lastQuestion: number;
  totalQuestions: number;
};

function yearAnchor(year: number): string {
  return `year-${year}`;
}

// Progress is the paper's own key, the one the paper reader uses, so a question answered
// here is answered there too. That is why each paper gets its own hook.
function PaperBlock({ paper }: { paper: PyqTopicPaper }) {
  const ref = useRef<HTMLElement>(null);
  const progress = usePracticeProgress(paper.paperSlug);
  useMathJax(ref, progress.answers);
  const checked = paper.questions.filter((q) => progress.correctAnswers[q.questionNumber]).length;

  return (
    <section ref={ref} className="mb-10">
      <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="m-0 text-[17px] font-extrabold tracking-tight text-ink">
          {pyqPaperLabel(paper)} — {questionCountLabel(paper.questions.length)}
        </h2>
        <p className="m-0 text-[13px] text-ink-soft">
          {checked > 0 && `${checked} checked · `}
          <Link href={`${PYQ_INDEX}/${paper.paperSlug}`} className="font-semibold text-ink">
            Full paper →
          </Link>
        </p>
      </div>
      <PyqQuestionList
        questions={paper.questions}
        progress={progress}
        anchorPrefix={`q-${paper.paperSlug}`}
      />
    </section>
  );
}

export default function PyqTopicSet({
  topic,
  years,
  papers,
  page,
}: {
  topic: PyqTopic;
  years: number[];
  /** This page's papers only. */
  papers: PyqTopicPaper[];
  page: PageInfo;
}) {
  // The picker will not submit an empty selection, but a hand-typed URL can ask for one.
  if (papers.length === 0) {
    return (
      <p className="ed-empty">
        No {topic.name} questions in CAT {listYears(years)}. Add another year above.
      </p>
    );
  }

  const yearsWithPapers = years.filter((y) => papers.some((p) => p.examYear === y));
  const isPaged = page.count > 1;

  return (
    <div>
      {isPaged && (
        <p className="pyq-pager__range">
          Questions {page.firstQuestion}–{page.lastQuestion} of {page.totalQuestions} · page {page.index + 1} of{" "}
          {page.count}
        </p>
      )}

      {yearsWithPapers.length > 1 && (
        <nav
          aria-label="Jump to year"
          className="sticky-under-header -mx-6 mb-6 flex flex-wrap gap-2 border-b border-rule-firm px-6 py-3"
        >
          {yearsWithPapers.map((year) => (
            <a
              key={year}
              href={`#${yearAnchor(year)}`}
              className="border-[1.5px] border-ink bg-paper px-4 py-2 text-[13px] font-bold text-ink no-underline"
            >
              {year}
            </a>
          ))}
        </nav>
      )}

      {yearsWithPapers.map((year) => (
        <div key={year} id={yearAnchor(year)} className="scroll-mt-32">
          {papers
            .filter((p) => p.examYear === year)
            .map((paper) => (
              <PaperBlock key={paper.paperSlug} paper={paper} />
            ))}
        </div>
      ))}

      {isPaged && (
        <nav aria-label="Pages" className="pyq-pager">
          {page.index > 0 && (
            <Link href={pyqTopicHref(topic.slug, years, page.index - 1)} className="ed-btn" data-weight="secondary">
              ← Previous page
            </Link>
          )}
          <span className="pyq-pager__range">
            Page {page.index + 1} of {page.count}
          </span>
          {page.index < page.count - 1 && (
            <Link href={pyqTopicHref(topic.slug, years, page.index + 1)} className="ed-btn" data-weight="primary">
              Next page →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
