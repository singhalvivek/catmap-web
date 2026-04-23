// DetailsPanel — orchestrates node detail view; shows locked state for TOPIC nodes below 70% subtopic completion
"use client";

import { useEffect, useMemo, useState } from "react";
import { Node } from "../../models/node";
import { Description } from "../../models/description";
import { Resource } from "../../models/resource";
import { ProgressStatus } from "../../models/progress";
import { submitFeedback } from "../../lib/feedback";
import { useProgressContext } from "../../lib/ProgressContext";
import { calculateNodeProgress } from "../../lib/progressCalculator";
import NodeHeader from "./NodeHeader";
import NodeDescription from "./NodeDescription";
import ResourceList, { EditableResource } from "./ResourceList";
import FeedbackForm from "./FeedbackForm";

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
    originalResources.map((r) => ({ title: r.title, type: r.type, link: r.link }))
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  const { progress, updateProgress, isLoggedIn } = useProgressContext();
  const status = progress[selected.id] ?? ProgressStatus.NOT_STARTED;

  useEffect(() => {
    setEditMode(false);
    setDescText(originalDesc);
    setEditResources(
      originalResources.map((r) => ({ title: r.title, type: r.type, link: r.link }))
    );
    setName("");
    setEmail("");
    setComment("");
  }, [selected?.id]);

  const { percent } = useMemo(
    () => calculateNodeProgress(selected, progress),
    [selected, progress]
  );
  const isLocked = selected.type === "TOPIC" && percent < 70;

  async function handleStatusChange(newStatus: ProgressStatus) {
    if (!selected) return;
    setProgressError(null);
    setSavingProgress(true);
    const updated = await updateProgress(selected.id, newStatus);
    if (!updated) setProgressError("Could not save progress. Please try again.");
    setSavingProgress(false);
  }

  async function handleSubmit() {
    if (!selected) return;
    try {
      setSubmitting(true);
      await submitFeedback({
        parentId: selected.id,
        nodeTitle: selected.title,
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
      <NodeHeader
        node={selected}
        status={status}
        isLoggedIn={isLoggedIn}
        savingProgress={savingProgress}
        progressError={progressError}
        onStatusChange={handleStatusChange}
      />
      {isLocked ? (
        <div className="rounded-xl border border-calm-border bg-calm-bg p-6 text-center space-y-3">
          <p className="text-trust-navy font-semibold text-base">
            Revision &amp; Sectional Test Locked
          </p>
          <p className="text-sm text-gray-500">
            Complete 70% of subtopics to unlock revision and sectional test for this topic.
          </p>
          <p className="text-sm font-medium text-hope-teal">{percent}% complete</p>
        </div>
      ) : (
        <>
          <NodeDescription
            originalDesc={originalDesc}
            editMode={editMode}
            descText={descText}
            onDescChange={setDescText}
            onSuggestEdit={() => setEditMode(true)}
          />
          <ResourceList
            originalResources={originalResources}
            editMode={editMode}
            editResources={editResources}
            onResourcesChange={setEditResources}
          />
          <FeedbackForm
            editMode={editMode}
            name={name}
            email={email}
            comment={comment}
            submitting={submitting}
            onNameChange={setName}
            onEmailChange={setEmail}
            onCommentChange={setComment}
            onSubmit={handleSubmit}
            onCancel={() => setEditMode(false)}
            onSuggestEdit={() => setEditMode(true)}
          />
        </>
      )}
    </div>
  );
}
