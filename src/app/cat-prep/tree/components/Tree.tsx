"use client";

import { Node } from "../models/node";
import TreeNode from "./TreeNode";

// Renders the entire syllabus tree
export default function Tree({
  roots,
  onSelect,
  selectedId,
}: {
  roots: Node[];
  onSelect: (n: Node) => void;
  selectedId: number | null;
}) {
  return (
    <div>
      {roots.map((root) => (
        <TreeNode
          key={root.id}
          node={root}
          level={0}
          onSelect={onSelect}
          selectedId={selectedId} // pass selected id
        />
      ))}
    </div>
  );
}
