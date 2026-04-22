"use client";

import { useEffect, useState } from "react";
import { Node } from "../models/node";
import { calculateNodeProgress } from "../tree/lib/progressCalculator";

// Single node with expand/collapse behavior
export default function TreeNode({
  node,
  level,
  onSelect,
  selectedId,
}: {
  node: Node;
  level: number;
  onSelect: (n: Node) => void;
  selectedId: number | null; // NEW: used to highlight selected node
}) {
  const [open, setOpen] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;
  const [percent, setPercent] = useState(0);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const showProgress = total > 0; // only show if it has subtopics
  
  useEffect(() => {
    const { percent, total } = calculateNodeProgress(node);
    setPercent(percent);
    setTotal(total);
  }, [node, refreshKey]);

  useEffect(() => {
    const handler = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, []);

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
        {/* Clicking the main row selects the node */}
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => {
            onSelect(node);
          }}
        >
          <span className="font-medium text-trust-navy">{node.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {showProgress && (
            <span className="ml-2 text-xs bg-hope-teal/10 text-hope-teal px-2 py-1 rounded-full font-medium">
              {percent}%
            </span>
          )}

          {/* Expand / collapse button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent select on toggle click
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

      {/* Children */}
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
                selectedId={selectedId} // pass selected id down
              />
            ))}
        </div>
      )}
    </div>
  );
}
