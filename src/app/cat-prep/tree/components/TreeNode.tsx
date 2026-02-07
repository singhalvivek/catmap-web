"use client";

import { useState } from "react";
import { Node } from "../models/node";

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

  const isSelected = selectedId === node.id;

  return (
    <div className="mb-3">
      <div
        className={`flex items-center justify-between gap-2 px-4 py-3 rounded-lg border cursor-pointer transition
          ${isSelected
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
      >
        {/* Clicking the main row selects the node */}
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => {
            onSelect(node);
          }}
        >
          <span className="font-medium text-gray-900 dark:text-gray-100">{node.title}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">({node.type})</span>
        </div>

        {/* Expand / collapse button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent select on toggle click
              setOpen(!open);
            }}
            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-200 transition-colors"
          >
            <span className="text-lg font-semibold text-gray-600">
              {open ? "−" : "+"}
            </span>
          </button>
        )}
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
