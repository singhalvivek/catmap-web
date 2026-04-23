"use client";

import { useState } from "react";
import { Node } from "../models/node";
import { calculateNodeProgress } from "../lib/progressCalculator";
import { useProgressContext } from "../lib/ProgressContext";

export default function TreeNode({
  node,
  level,
  onSelect,
  selectedId,
}: {
  node: Node;
  level: number;
  onSelect: (n: Node) => void;
  selectedId: number | null;
}) {
  const [open, setOpen] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;
  const { progress } = useProgressContext();

  const { percent, total } = calculateNodeProgress(node, progress);
  const showProgress = total > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="mb-3">
      <div
        className={`flex items-center justify-between gap-2 px-4 py-3 rounded-lg border cursor-pointer transition
          ${isSelected
            ? "border-hope-teal bg-hope-teal/10"
            : "border-calm-border bg-white hover:bg-calm-bg"
          }`}
      >
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => onSelect(node)}
        >
          <span className="font-medium text-trust-navy">{node.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {showProgress && (
            <span className="ml-2 text-xs bg-hope-teal/10 text-hope-teal px-2 py-1 rounded-full font-medium">
              {percent}%
            </span>
          )}

          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-calm-border transition-colors"
            >
              <span className="text-lg font-semibold text-gray-600">
                {open ? "−" : "+"}
              </span>
            </button>
          )}
        </div>
      </div>

      {hasChildren && open && (
        <div className="ml-4 mt-2">
          {node.children!
            .sort((a, b) => a.order_index - b.order_index)
            .map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                onSelect={onSelect}
                selectedId={selectedId}
              />
            ))}
        </div>
      )}
    </div>
  );
}
