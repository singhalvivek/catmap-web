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
  const { status, updateStatus, isLoggedIn } = useProgress(selected.id);
  const meta = ProgressMeta[status] ?? ProgressMeta.NOT_STARTED;
  const [submitting, setSubmitting] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

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
            <h1 className="text-2xl font-bold text-trust-navy">{selected.title}</h1>
              <select
                value={status}
                disabled={!isLoggedIn || savingProgress}
                onChange={async (e) => {
                  setProgressError(null);
                  setSavingProgress(true);

                  const newStatus = e.target.value as ProgressStatus;
                  const updated = await updateStatus(newStatus);
                  if (!updated) {
                    setProgressError("Could not save progress. Please try again.");
                    setSavingProgress(false);
                    return;
                  }

                  // Notify tree to refresh
                  window.dispatchEvent(new Event("progress-updated"));
                  setSavingProgress(false);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border border-calm-border bg-calm-bg ${meta.color} disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {Object.values(ProgressStatus).map((key) => (
                  <option key={key} value={key}>
                    {ProgressMeta[key].label}
                  </option>
                ))}
              </select>
          </div>
          {!isLoggedIn && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 inline-block">
              Login with Google to save progress.
            </p>
          )}
          {progressError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1 inline-block">
              {progressError}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <section>
        <h3 className="text-lg font-semibold text-trust-navy mb-2">Description</h3>

        {!editMode ? (
          <p className="leading-relaxed text-gray-700">
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
                    <div className="font-medium text-trust-navy">
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
      <section className="border-t border-calm-border pt-4 space-y-3">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 rounded-md border border-calm-border text-trust-navy hover:bg-calm-bg transition"
          >
            Suggest Edit / Correction
          </button>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-trust-navy">Your Details</h3>

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
                className="px-4 py-2 bg-trust-navy text-white rounded-md hover:bg-trust-blue transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Suggestion"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border border-calm-border rounded-md text-gray-700 hover:bg-calm-bg transition"
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
