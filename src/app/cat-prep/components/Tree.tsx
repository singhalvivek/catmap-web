"use client";

import { Node } from "../models/node";
import TreeNode from "./TreeNode";
import { useEffect, useState } from "react";

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

  const [, forceUpdate] = useState(0);

  useEffect(() => {

    forceUpdate((x) => x + 1); 
    
    const handler = () => forceUpdate((x) => x + 1);

    window.addEventListener("progress-updated", handler);

    return () => {
      window.removeEventListener("progress-updated", handler);
    };
  }, []);

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
