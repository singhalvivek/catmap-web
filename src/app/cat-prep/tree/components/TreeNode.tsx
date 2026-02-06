"use client";

import { useState } from "react";
import { Node } from "../models/node";

// Single node with expand/collapse behavior
export default function TreeNode({
  node,
  level,
  onSelect,
}: {
  node: Node;
  level: number;
  onSelect: (n: Node) => void;
}) {
  const [open, setOpen] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer">
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => {
            onSelect(node);
          }}
        >
          <span className="font-medium text-gray-900">{node.title}</span>
          <span className="text-xs text-gray-500">({node.type})</span>
        </div>

        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
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

      {hasChildren && open && (
        <div className="ml-4">
          {node.children!
            .sort((a, b) => a.order_index - b.order_index)
            .map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                onSelect={onSelect}
              />
            ))}
        </div>
      )}
    </div>
  );
}
