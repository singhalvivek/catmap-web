// PracticeChapterRow — one branch of a practice topic: a chapter, its question count and its state
import Link from "next/link";
import type { PracticeChapter } from "@/constants/practiceChapters";
import type { ChapterProgress } from "../lib/practiceProgressSummary";

const STATE_WORD: Record<string, string> = {
  correct: "Done",
  caution: "In progress",
  inert: "Not started",
};

export default function PracticeChapterRow({
  chapter,
  href,
  progress,
  index = 0,
  isLast = false,
}: {
  chapter: PracticeChapter;
  href: string;
  progress?: ChapterProgress;
  /** Position within its topic, used only to stagger the open animation. */
  index?: number;
  /** Last branch of its topic — draws an end connector instead of a tee. */
  isLast?: boolean;
}) {
  const done = progress?.doneUnits ?? 0;
  const totalUnits = progress?.totalUnits ?? 0;
  const state = totalUnits > 0 && done >= totalUnits ? "correct" : done > 0 ? "caution" : "inert";

  return (
    // A branch rather than a pill. Ten chapters in a wrapped grid say "these exist"; ten
    // rows with a count and a state column say which ones are worth opening — which is the
    // only question a reader has on this surface.
    //
    // No isHovered state: 28 of these render at once and every one re-rendered on pointer
    // move to simulate a :hover that CSS does for free.
    <Link
      href={href}
      className="ed-chip tree-branch"
      data-state={state}
      data-last={isLast}
      style={{ "--chip-index": index } as React.CSSProperties}
      // The count used to reach a screen reader as a bare "20Q", and the state not at all.
      aria-label={`${chapter.name}, ${chapter.questionCount} questions, ${STATE_WORD[state]}`}
    >
      <span className="tree-branch__label">{chapter.name}</span>
      <span className="tree-branch__lessons" aria-hidden="true">
        {chapter.questionCount}Q
      </span>
      <span className="tree-branch__status" aria-hidden="true">
        {state === "inert" ? "" : STATE_WORD[state]}
      </span>
    </Link>
  );
}
