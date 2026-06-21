// SubtopicChip — chip button for a leaf subtopic; dot colour reflects progress status
"use client";

import { useState } from "react";
import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";

export default function SubtopicChip({
  node,
  isSelected,
  onClick,
  progress,
  chipColor,
}: {
  node: Node;
  isSelected: boolean;
  onClick: (node: Node) => void;
  progress: Record<number, ProgressStatus>;
  chipColor: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const status = progress[node.id] ?? ProgressStatus.NOT_STARTED;
  const dotColor =
    status === ProgressStatus.COMPLETED
      ? "#10B981"
      : status === ProgressStatus.IN_PROGRESS
        ? "#F59E0B"
        : "#CBD5E1";

  const isActive = isSelected || isHovered;

  return (
    <button
      onClick={() => onClick(node)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        border: `1.5px solid ${isActive ? "#14B8A6" : chipColor}`,
        background: isActive ? "#fff" : chipColor,
        color: isActive ? "#0F766E" : "#fff",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
        textAlign: "left",
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
