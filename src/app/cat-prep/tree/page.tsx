"use client";

import { useState } from "react";
import data from "../data.json";

type Node = {
  id: number;
  parent_id: number | null | "";
  title: string;
  type: string;
  order_index: number;
  children?: Node[];
};

function buildTree(nodes: Node[]) {
  const map: Record<number, Node & { children: Node[] }> = {};
  const roots: (Node & { children: Node[] })[] = [];

  nodes.forEach((n) => {
    map[n.id] = { ...n, children: [] };
  });

  nodes.forEach((n) => {
    if (!n.parent_id) {
      roots.push(map[n.id]);
    } else {
      map[n.parent_id]?.children.push(map[n.id]);
    }
  });

  return roots;
}

function ProgressBar({ percent = 0 }: { percent?: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-2 bg-blue-500 rounded-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function TreeNode({ node, level = 0 }: { node: Node & { children?: Node[] }; level?: number }) {
  const [open, setOpen] = useState(level < 1); // root expanded by default
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4">
      <div
        className={`flex items-center justify-between gap-3 p-3 rounded-lg border bg-white shadow-sm hover:shadow-md transition cursor-pointer`}
        style={{ marginLeft: level * 8 }}
        onClick={() => hasChildren && setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          {hasChildren && (
            <span className="text-sm text-gray-500 w-4">
              {open ? "▼" : "▶"}
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          <div>
            <div className="font-medium">{node.title}</div>
            <div className="text-xs text-gray-500">{node.type}</div>
          </div>
        </div>

        {/* Static placeholder progress */}
        <div className="w-24">
          <ProgressBar percent={0} />
        </div>
      </div>

      {hasChildren && open && (
        <div className="mt-2 space-y-2 border-l pl-3">
          {node.children!
            .sort((a, b) => a.order_index - b.order_index)
            .map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
        </div>
      )}
    </div>
  );
}

export default function CatPrepTreePage() {
  const tree = buildTree(data as Node[]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">CAT Preparation</h1>

        <div className="space-y-3">
          {tree.map((root) => (
            <TreeNode key={root.id} node={root} />
          ))}
        </div>
      </div>
    </div>
  );
}
