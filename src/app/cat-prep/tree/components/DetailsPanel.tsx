"use client";

import { Node } from "../models/node";
import { Description } from "../models/description";

// Right-side content panel
export default function DetailsPanel({
  selected,
  descriptions,
}: {
  selected: Node | null;
  descriptions: Description[];
}) {
  const desc = selected
    ? descriptions.find((d) => d.parent_id === selected.id)
    : null;

  // Default state (panel is not empty anymore)
  if (!selected) {
    return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Welcome 👋</h2>
        <p className="text-gray-600">
          Select any topic from the learning path to view details, explanations,
          and study focus here.
        </p>

        <div className="mt-4 p-4 rounded-lg bg-gray-50 border text-sm text-gray-500">
          💡 Tip: Start with Quantitative Aptitude if you’re focusing on problem
          solving.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{selected.title}</h1>
      <div className="text-sm text-gray-500 mb-4">{selected.type}</div>
      <p className="leading-relaxed">
        {desc?.text || "No description available for this topic yet."}
      </p>
    </div>
  );
}
