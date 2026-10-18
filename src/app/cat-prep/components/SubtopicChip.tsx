// SubtopicChip — chip button for a leaf subtopic; a mark and a word convey progress status
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
  [ProgressStatus.COMPLETED]: "completed",
  [ProgressStatus.IN_PROGRESS]: "in progress",
  [ProgressStatus.NOT_STARTED]: "not started",
};

export default function SubtopicChip({
  node,
  isSelected,
  onClick,
  progress,
}: {
  node: Node;
  isSelected: boolean;
  onClick: (node: Node) => void;
  progress: Record<number, ProgressStatus>;
}) {
  const status = progress[node.id] ?? ProgressStatus.NOT_STARTED;

  return (
    <button
      type="button"
      onClick={() => onClick(node)}
      className="ed-chip"
      data-state={STATUS_STATE[status]}
      data-selected={isSelected}
      // The dot was the only thing distinguishing the three states, and it is colour-only.
      // The status now reaches a screen reader as a word.
      aria-label={`${node.title}, ${STATUS_WORD[status]}`}
    >
      <span className="subtopic-chip__dot" aria-hidden="true" />
      {node.title}
    </button>
  );
}
