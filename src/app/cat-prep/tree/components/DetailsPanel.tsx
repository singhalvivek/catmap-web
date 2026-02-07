"use client";

import { Node } from "../models/node";
import { Description } from "../models/description";
import { Resource } from "../models/resource";

// Right-side content panel
export default function DetailsPanel({
  selected,
  descriptions,
  resources,
}: {
  selected: Node | null;
  descriptions: Description[];
  resources: Resource[];
}) {
  const desc = selected
    ? descriptions.find((d) => d.parent_id === selected.id)
    : null;

  const nodeResources = selected ? resources.filter(r => r.parent_id === selected.id).sort((a, b) => a.order_index - b.order_index) : [];

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

  // return (
  //   <div className="max-w-2xl">
  //     <h1 className="text-2xl font-bold mb-2">{selected.title}</h1>
  //     <div className="text-sm text-gray-500 mb-4">{selected.type}</div>
  //     <p className="leading-relaxed">
  //       {desc?.text || "No description available for this topic yet."}
  //     </p>
  //   </div>
  // );
  return (
    <div className="max-w-2xl space-y-8">
      {/*Title */}
      <div>
        <h1 className="text-2xl font-bold mb-1">{selected.title}</h1>
        <div className="text-sm text-gray-500">{selected.type}</div>
      </div>

      {/* Description */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="leading-relaxed text-gray-800">
          {desc?.text || "No description available for this topic yet."}
        </p>
      </section>

      {/* Resources */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Resources</h3>
        {nodeResources.length === 0 ? (
          <p className="text-gray-500">No resources available for this topic yet.</p>
        ) : (
          <ul className="space-y-2">
            {nodeResources.map((res) => (
              <li
                key={res.id}
                className="flex items-center justify-between p-3 rounded-md border bg-white hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium">{res.youtubevideo_title}</div>
                  <div className="text-xs text-gray-500">{res.type}</div>
                </div>

                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Open ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );

}
