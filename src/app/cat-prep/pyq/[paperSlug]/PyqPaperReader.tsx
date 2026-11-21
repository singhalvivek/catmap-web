// PyqPaperReader — the whole paper on one page: every question readable and answerable, no account needed
"use client";

import { useRef } from "react";
import Link from "next/link";
import type { PyqSolvedPaper } from "@/app/cat-prep/models/pyq";
import { usePracticeProgress } from "@/app/cat-prep/lib/usePracticeProgress";
import { useMathJax } from "@/app/cat-prep/lib/useMathJax";
import PyqQuestionList from "@/app/cat-prep/components/PyqQuestionList";

function sectionAnchor(name: string): string {
  return `section-${name.toLowerCase()}`;
}

export default function PyqPaperReader({ paper }: { paper: PyqSolvedPaper }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = usePracticeProgress(paper.paperSlug);
  useMathJax(containerRef, progress.answers);

  const sections = paper.sections.filter((s) => s.questions.length > 0);

  return (
    <div ref={containerRef}>
      <nav className="sticky-under-header -mx-6 mb-6 flex gap-2 border-b border-rule-firm px-6 py-3">
        <Link
          href="/cat-prep/pyq"
          className="border-[1.5px] border-rule-firm bg-paper px-4 py-2 text-[13px] font-semibold text-ink-faint no-underline"
        >
          ← All papers
        </Link>
        {sections.map((section) => (
          <a
            key={section.name}
            href={`#${sectionAnchor(section.name)}`}
            className="border-[1.5px] border-ink bg-paper px-4 py-2 text-[13px] font-bold text-ink no-underline"
          >
            {section.name}
          </a>
        ))}
      </nav>

      {sections.map((section) => (
        <section key={section.name} id={sectionAnchor(section.name)} className="mb-10 scroll-mt-32">
          <h2 className="m-0 mb-3.5 text-[17px] font-extrabold tracking-tight text-ink">
            {section.name} — {section.questions.length} questions
          </h2>

          <PyqQuestionList questions={section.questions} progress={progress} />
        </section>
      ))}
    </div>
  );
}
