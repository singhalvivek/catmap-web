// PracticeTopicRow — accordion row for a practice topic; expands to show chapter chips
"use client";

import { RC_CHAPTER_SLUG, type PracticeTopic } from "@/constants/practiceChapters";
import PracticeChapterChip from "./PracticeChapterChip";

export default function PracticeTopicRow({
  topic,
  section,
  isOpen,
  onToggle,
}: {
  topic: PracticeTopic;
  /** "Quant" | "DILR" | "VARC" — determines URL prefix */
  section: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const totalQuestions = topic.chapters.reduce((s, c) => s + c.questionCount, 0);

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
    <div className="topic-row" data-open={isOpen}>
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="topic-row__header">
        <span className="topic-row__lead">
          <span className="topic-row__dot" data-state="inert" aria-hidden="true" />
          <span className="topic-row__title">{topic.name}</span>
          <span className="topic-row__count">{topic.chapters.length} chapters</span>
        </span>
        <span className="topic-row__meta">
          <span className="topic-row__pct">{totalQuestions}Q</span>
          <span className="topic-row__toggle" aria-hidden="true">
            {isOpen ? "−" : "+"}
          </span>
        </span>
      </button>

      {/* Grid-rows collapse: the old 400px cap would clip a topic whose chips wrapped. */}
      <div className="ed-collapse" data-open={isOpen}>
        <div>
          <div className="topic-row__chips">
            {topic.chapters.map((chapter) => (
              <PracticeChapterChip
                key={chapter.slug}
                chapter={chapter}
                href={chapterHref(chapter.slug, topic.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
