// ResourceList — resource list with view and edit modes; edit supports add and inline field changes
"use client";

import { Resource } from "../../models/resource";
import type { ResourceType } from "../../models/resource";

export type EditableResource = {
  title: string;
  type: ResourceType;
  link: string;
};

export default function ResourceList({
  originalResources,
  editMode,
  editResources,
  onResourcesChange,
}: {
  originalResources: Resource[];
  editMode: boolean;
  editResources: EditableResource[];
  onResourcesChange: (resources: EditableResource[]) => void;
}) {
  function updateField<K extends keyof EditableResource>(
    idx: number,
    field: K,
    value: EditableResource[K]
  ) {
    const copy = [...editResources];
    copy[idx] = { ...copy[idx], [field]: value };
    onResourcesChange(copy);
  }

  return (
    <section>
      <h3 className="text-lg font-semibold text-trust-navy mb-2">Resources</h3>

      {!editMode ? (
        originalResources.length === 0 ? (
          <p className="text-sm text-gray-500">
            No resources available for this topic yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {originalResources.map((res) => (
              <li
                key={res.id}
                className="flex justify-between items-center p-3 border border-calm-border rounded-md bg-calm-bg"
              >
                <div>
                  <div className="font-medium text-trust-navy">{res.title}</div>
                  <div className="text-xs text-gray-500">{res.type}</div>
                </div>
                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Open ↗
                </a>
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="space-y-3">
          {editResources.map((r, idx) => (
            <div key={idx} className="border rounded-md p-3 space-y-2">
              <input
                className="w-full border p-2 rounded text-sm"
                placeholder="Resource title"
                value={r.title}
                onChange={(e) => updateField(idx, "title", e.target.value)}
              />
              <select
                className="w-full border p-2 rounded text-sm"
                value={r.type}
                onChange={(e) =>
                  updateField(idx, "type", e.target.value as ResourceType)
                }
              >
                <option value="VIDEO">Video</option>
                <option value="ARTICLE">Article</option>
              </select>
              <input
                className="w-full border p-2 rounded text-sm"
                placeholder="Resource link"
                value={r.link}
                onChange={(e) => updateField(idx, "link", e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={() =>
              onResourcesChange([
                ...editResources,
                { title: "", type: "VIDEO", link: "" },
              ])
            }
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Resource
          </button>
        </div>
      )}
    </section>
  );
}
