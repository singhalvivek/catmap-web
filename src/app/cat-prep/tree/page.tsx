"use client";

import { useState } from "react";
import data from "../data.json";
import descriptions from "../description.json";

import { buildTree } from "./lib/buildTree";
import { Node } from "./models/node";
import { Description } from "./models/description";

import Tree from "./components/Tree";
import DetailsPanel from "./components/DetailsPanel";

export default function CatPrepTreePage() {
  const tree = buildTree(data as Node[]);
  const [selected, setSelected] = useState<Node | null>(null);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Tree */}
      <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">Learning Path</h2>
        <Tree roots={tree} onSelect={setSelected} />
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        <DetailsPanel
          selected={selected}
          descriptions={descriptions as Description[]}
        />
      </div>
    </div>
  );
}
