// DetailsPanel — orchestrates node detail view; owns all state and delegates rendering to sub-components
"use client";

import { useEffect, useState } from "react";
import { Node } from "../../models/node";
import { Description } from "../../models/description";
import { Resource } from "../../models/resource";
import { ProgressStatus } from "../../models/progress";
import { submitFeedback } from "../../lib/feedback";
import { useProgressContext } from "../../lib/ProgressContext";
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

  async function handleStatusChange(newStatus: ProgressStatus) {
    setProgressError(null);
    setSavingProgress(true);
    const updated = await updateProgress(selected.id, newStatus);
    if (!updated) setProgressError("Could not save progress. Please try again.");
    setSavingProgress(false);
  }

  async function handleSubmit() {
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
    </div>
  );
}
