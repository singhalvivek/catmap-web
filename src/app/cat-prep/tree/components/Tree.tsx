"use client";

import { Node } from "../models/node";
import TreeNode from "./TreeNode";

// Renders the entire syllabus tree
export default function Tree({
  roots,
  onSelect,
}: {
  roots: Node[];
  onSelect: (n: Node) => void;
}) {
  return (
    <div>
      {roots.map((root) => (
        <TreeNode key={root.id} node={root} level={0} onSelect={onSelect} />
      ))}
    </div>
  );
}
