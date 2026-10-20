// SubtopicChip — one branch of the syllabus tree: a subtopic, its lessons and its status
"use client";

import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";

/**
 * Status drives a data attribute rather than three inline colours, so the whole thing is
 * one CSS rule. This also removed the component's isHovered state: 61 of these render on
 * the Learn surface at once, and every one of them re-rendered on pointer move to simulate
 * a :hover that CSS can do for free.
 */
const STATUS_STATE: Record<ProgressStatus, string> = {
  [ProgressStatus.COMPLETED]: "correct",
  [ProgressStatus.IN_PROGRESS]: "caution",
  [ProgressStatus.NOT_STARTED]: "inert",
};

const STATUS_WORD: Record<ProgressStatus, string> = {
  [ProgressStatus.COMPLETED]: "Done",
  [ProgressStatus.IN_PROGRESS]: "In progress",
  [ProgressStatus.NOT_STARTED]: "Not started",
};

export default function SubtopicChip({
  node,
  isSelected,
  onClick,
  progress,
  index = 0,
  lessonCount = 0,
  isLast = false,
}: {
  node: Node;
  isSelected: boolean;
  onClick: (node: Node) => void;
  progress: Record<number, ProgressStatus>;
  /** Position within its topic, used only to stagger the open animation. */
  index?: number;
  /** Openable lesson links for this subtopic. */
  lessonCount?: number;
  /** Last branch of its topic — draws an end connector instead of a tee. */
  isLast?: boolean;
}) {
  const status = progress[node.id] ?? ProgressStatus.NOT_STARTED;

  return (
    <button
      type="button"
      onClick={() => onClick(node)}
      className="ed-chip tree-branch"
      data-state={STATUS_STATE[status]}
      data-selected={isSelected}
      data-last={isLast}
      style={{ "--chip-index": index } as React.CSSProperties}
      // Status and lesson count were conveyed by a dot and nothing respectively. Both now
      // reach a screen reader as words.
      aria-label={`${node.title}, ${STATUS_WORD[status]}, ${
        lessonCount > 0 ? `${lessonCount} lessons` : "no lessons yet"
      }`}
    >
      <span className="tree-branch__label">{node.title}</span>
      <span className="tree-branch__lessons" aria-hidden="true">
        {lessonCount > 0 ? `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}` : "—"}
      </span>
      <span className="tree-branch__status" aria-hidden="true">
        {status === ProgressStatus.NOT_STARTED ? "" : STATUS_WORD[status]}
      </span>
    </button>
  );
}
