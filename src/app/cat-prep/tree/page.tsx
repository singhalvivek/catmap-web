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
      {/* Center Tree */}
      <div className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-6">Learning Path</h2>
          <Tree roots={tree} onSelect={setSelected} />
        </div>
      </div>

      {/* Right Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          selected ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setSelected(null)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="p-6 pt-12">
          <DetailsPanel
            selected={selected}
            descriptions={descriptions as Description[]}
          />
        </div>
      </div>
    </div>
  );
}
