"use client";

import { useState } from "react";
import treeData from "../data.json";
import descriptions from "../description.json";

type Node = {
  id: number;
  parent_id: number | null | "";
  title: string;
  type: string;
  order_index: number;
  children?: Node[];
};

type Description = {
  id: number;
  parent_id: number;
  text: string;
  type: string;
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

function TreeNode({
  node,
  level,
  onSelect,
}: {
  node: Node & { children?: Node[] };
  level: number;
  onSelect: (n: Node) => void;
}) {
  const [open, setOpen] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-2">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          onSelect(node);
          if (hasChildren) setOpen(!open);
        }}
      >
        {hasChildren && <span className="text-xs">{open ? "▼" : "▶"}</span>}
        <span className="font-medium">{node.title}</span>
        <span className="text-xs text-gray-500">({node.type})</span>
      </div>

      {hasChildren && open && (
        <div className="ml-4 border-l pl-2">
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

export default function CatPrepTreePage() {
  const tree = buildTree(treeData as Node[]);
  const [selected, setSelected] = useState<Node | null>(null);

  const desc = selected
    ? (descriptions as Description[]).find((d) => d.parent_id === selected.id)
    : null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Tree */}
      <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">Learning Path</h2>
        {tree.map((root) => (
          <TreeNode
            key={root.id}
            node={root}
            level={0}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Right Details Panel (ALWAYS VISIBLE) */}
      <div className="flex-1 p-6 overflow-y-auto">
        {!selected ? (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-2">Welcome to CAT Preparation</h1>
            <p className="text-gray-600">
              Select any topic from the learning path on the left to view detailed explanations, guidance, and study focus for that topic.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-white border">
              <p className="text-sm text-gray-500">
                💡 Tip: Start with Quantitative Aptitude if you’re focusing on problem-solving skills, or pick VARC for reading and reasoning practice.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-2">{selected.title}</h1>
            <div className="text-sm text-gray-500 mb-4">{selected.type}</div>

            <p className="leading-relaxed">
              {desc?.text || "No description available for this topic yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
