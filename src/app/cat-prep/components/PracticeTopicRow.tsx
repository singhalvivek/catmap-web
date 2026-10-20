// PracticeTopicRow — accordion row for a practice topic; expands to show chapter chips
"use client";

import {
  RC_CHAPTER_SLUG,
  type PracticeSubject,
  type PracticeTopic,
} from "@/constants/practiceChapters";
import PracticeChapterRow from "./PracticeChapterRow";
import { chapterKey, type PracticeSummary } from "../lib/practiceProgressSummary";

function progressState(pct: number): string {
  if (pct === 100) return "correct";
  if (pct > 0) return "caution";
  return "inert";
}

export default function PracticeTopicRow({
  topic,
  section,
  summary,
  index = 0,
  isOpen,
  onToggle,
}: {
  topic: PracticeTopic;
  /** Position in the list, used only to stagger the arrival animation. */
  index?: number;
  /** Determines the URL prefix. The union, not a bare string — the caller has it. */
  section: PracticeSubject["section"];
  summary: PracticeSummary;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const totalQuestions = topic.chapters.reduce((s, c) => s + c.questionCount, 0);

  /*
   * The row used to carry data-state="inert" hardwired, which is a status channel pinned to
   * one value — exactly what reads as decoration. The counts it needed were already being
   * computed for the hero meter and thrown away.
   */
  const chapters = topic.chapters.map((chapter) => ({
    chapter,
    progress: summary.byChapter[chapterKey(section, topic.slug, chapter.slug)],
  }));

  const doneUnits = chapters.reduce((n, c) => n + (c.progress?.doneUnits ?? 0), 0);
  const totalUnits = chapters.reduce((n, c) => n + (c.progress?.totalUnits ?? 0), 0);
  const pct = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0;
  const state = progressState(pct);

  function chapterHref(chapterSlug: string, topicSlug: string): string {
    if (section === "Quant") {
      return `/cat-prep/practice/quant/${topicSlug}/${chapterSlug}`;
    }
    if (section === "DILR") {
      return `/cat-prep/practice/dilr/${chapterSlug}/1`;
    }
    if (chapterSlug === RC_CHAPTER_SLUG) {
      return `/cat-prep/practice/varc/${RC_CHAPTER_SLUG}/1`;
    }
    // Odd One Out, Para Jumbles, Para Summary. The topic slug is deliberately absent:
    // every VARC chapter hangs off one topic, so it added a segment carrying no meaning
    // — and this used to point at /varc/varc/<chapter>, a route that never existed.
    return `/cat-prep/practice/varc/${chapterSlug}`;
  }

  return (
    <div
      className="topic-row"
      data-open={isOpen}
      data-state={state}
      style={{ "--si": index } as React.CSSProperties}
    >
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="topic-row__header">
        <span className="topic-row__lead">
          <span className="topic-row__dot" data-state={state} aria-hidden="true" />
          <span className="topic-row__title">{topic.name}</span>
          <span className="topic-row__count">
            {topic.chapters.length} {topic.chapters.length === 1 ? "chapter" : "chapters"}
          </span>
        </span>
        <span className="topic-row__meta">
          {/* Silent at zero, like the Learn rows: eleven "0%"s beside empty bars told a new
              reader nothing and made the page look like a broken dashboard. */}
          {pct > 0 && (
            <>
              <span
                className="ed-meter topic-row__meter"
                data-state={state}
                /*
                  No role="progressbar" here. role="button" takes presentational children,
                  so every descendant of this header button is mapped to presentation and
                  the aria-value* were discarded before a screen reader ever saw them. The
                  percentage beside it is real text, and the row's own name carries the
                  topic, so the meter is decoration and says so.
                */
                aria-hidden="true"
                style={{ "--meter-value": pct } as React.CSSProperties}
              >
                <span className="ed-meter__fill" />
              </span>
              <span className="topic-row__pct">{pct}%</span>
            </>
          )}
          <span className="topic-row__questions">{totalQuestions}Q</span>
          <span className="topic-row__toggle" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <path
                d="M3 1.5 L7 5 L3 8.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      </button>

      {/* Grid-rows collapse: the old 400px cap would clip a topic whose chips wrapped. */}
      <div className="ed-collapse" data-open={isOpen}>
        <div>
          <div className="topic-row__chips" data-layout="list">
            {chapters.map(({ chapter, progress }, i) => (
              <PracticeChapterRow
                key={chapter.slug}
                index={i}
                isLast={i === chapters.length - 1}
                chapter={chapter}
                progress={progress}
                href={chapterHref(chapter.slug, topic.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
