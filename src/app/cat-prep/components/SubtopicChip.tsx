// SubtopicChip — chip button for a leaf subtopic; dot colour reflects progress status
"use client";

import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";

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
  const dotColor =
    status === ProgressStatus.COMPLETED
      ? "#10B981"
      : status === ProgressStatus.IN_PROGRESS
        ? "#F59E0B"
        : "#CBD5E1";

  return (
    <button
      onClick={() => onClick(node)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        border: `1.5px solid ${isSelected ? "#14B8A6" : "#E2E8F0"}`,
        background: isSelected ? "#F0FDFA" : "#fff",
        color: isSelected ? "#0F766E" : "#334155",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.border = "1.5px solid #14B8A6";
          e.currentTarget.style.background = "#F0FDFA";
          e.currentTarget.style.color = "#0F766E";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.border = "1.5px solid #E2E8F0";
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.color = "#334155";
        }
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
        }}
      />
      {node.title}
    </button>
  );
}
