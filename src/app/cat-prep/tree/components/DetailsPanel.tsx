"use client";

import { useEffect, useState } from "react";
import { Node } from "../models/node";
import { Description } from "../models/description";
import { Resource } from "../models/resource";
import { submitFeedback } from "../lib/feedback";
import { ProgressStatus, ProgressMeta } from "../models/progress";
import { useProgress } from "../lib/useProgress";

type EditableResource = {
  title: string;
  type: "VIDEO" | "ARTICLE";
  link: string;
};

export default function DetailsPanel({
  selected,
  descriptions,
  resources,
}: {
  selected: Node | null;
  descriptions: Description[];
  resources: Resource[];
}) {
  if (!selected) return null;

  const originalDesc =
    descriptions.find((d) => d.parent_id === selected.id)?.text || "";

  const originalResources = resources
    .filter((r) => r.parent_id === selected.id)
    .sort((a, b) => a.order_index - b.order_index);

  const [editMode, setEditMode] = useState(false);

  const [descText, setDescText] = useState(originalDesc);
  const [editResources, setEditResources] = useState<EditableResource[]>(
    originalResources.map((r) => ({
      title: r.youtubevideo_title,
      type: r.type,
      link: r.link,
    }))
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const { status, updateStatus } = useProgress(selected.id);
  const meta = ProgressMeta[status] ?? ProgressMeta.NOT_STARTED;
  const [submitting, setSubmitting] = useState(false);

  // Reset edit state when selected node changes
  useEffect(() => {
    setEditMode(false);
    setDescText(originalDesc);
    setEditResources(
      originalResources.map((r) => ({
        title: r.youtubevideo_title,
        type: r.type,
        link: r.link,
      }))
    );
    setName("");
    setEmail("");
    setComment("");
  }, [selected?.id]);

  async function onSubmit() {
    if (!selected) return;
    const node = selected;

    try {
      setSubmitting(true);

      await submitFeedback({
        parentId: node.id,
        nodeTitle: node.title,
        description: descText,
        resources: editResources,
        name,
        email,
        comment,
      });

      alert("Thanks! Your suggestion has been sent 🙌");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-500">{selected.type}</div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{selected.title}</h1>
              <select
                value={status}
                onChange={(e) =>
                  updateStatus(e.target.value as ProgressStatus)
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-full border border-gray-600 bg-gray-800 ${meta.color}`}
              >
                {Object.values(ProgressStatus).map((key) => (
                  <option key={key} value={key}>
                    {ProgressMeta[key].label}
                  </option>
                ))}
              </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Description</h3>

        {!editMode ? (
          <p className="leading-relaxed text-gray-200">
            {originalDesc || "No description available for this topic yet."}
          </p>
        ) : (
          <textarea
            value={descText}
            onChange={(e) => setDescText(e.target.value)}
            className="w-full min-h-[120px] border rounded-md p-2 text-sm"
            placeholder="Edit description..."
          />
        )}
      </section>

      {/* Resources */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Resources</h3>

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
                  className="flex justify-between items-center p-3 border rounded-md bg-gray-800"
                >
                  <div>
                    <div className="font-medium">
                      {res.youtubevideo_title}
                    </div>
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
                  onChange={(e) => {
                    const copy = [...editResources];
                    copy[idx].title = e.target.value;
                    setEditResources(copy);
                  }}
                />
                <select
                  className="w-full border p-2 rounded text-sm"
                  value={r.type}
                  onChange={(e) => {
                    const copy = [...editResources];
                    copy[idx].type = e.target.value as "VIDEO" | "ARTICLE";
                    setEditResources(copy);
                  }}
                >
                  <option value="VIDEO">Video</option>
                  <option value="ARTICLE">Article</option>
                </select>
                <input
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Resource link"
                  value={r.link}
                  onChange={(e) => {
                    const copy = [...editResources];
                    copy[idx].link = e.target.value;
                    setEditResources(copy);
                  }}
                />
              </div>
            ))}

            <button
              onClick={() =>
                setEditResources([
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

      {/* Feedback / Edit Controls */}
      <section className="border-t pt-4 space-y-3">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 rounded-md border text-gray-200 hover:bg-gray-50 hover:text-gray-700 transition"
          >
            Suggest Edit / Correction
          </button>
        ) : (
          <>
            <h3 className="text-lg font-semibold">Your Details</h3>

            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              className="w-full border p-2 rounded text-sm"
              placeholder="Any comments or explanation?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={onSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Suggestion"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
