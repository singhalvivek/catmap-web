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

  if (!selected) {
    return null;
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
