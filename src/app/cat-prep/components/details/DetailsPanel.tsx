// DetailsPanel — fixed side-panel orchestrator; composes NodeHeader, ProgressPicker, NodeDescription, ResourceList, FeedbackForm
"use client";

import { useEffect, useMemo, useState } from "react";
import { Node } from "../../models/node";
import { Description } from "../../models/description";
import { Resource } from "../../models/resource";
import { ProgressStatus } from "../../models/progress";
import { submitFeedback } from "../../lib/feedback";
import { useProgressContext } from "../../lib/ProgressContext";
import { calculateNodeProgress } from "../../lib/progressCalculator";
import type { EditableResource } from "./types";

import NodeHeader from "./NodeHeader";
import ProgressPicker from "./ProgressPicker";
import NodeDescription from "./NodeDescription";
import ResourceList from "./ResourceList";
import FeedbackForm from "./FeedbackForm";

export default function DetailsPanel({
  selected,
  descriptions,
  resources,
  onClose,
}: {
  selected: Node;
  descriptions: Description[];
  resources: Resource[];
  onClose: () => void;
}) {
  const originalDesc = useMemo(
    () => descriptions.find((d) => d.parent_id === selected.id)?.text ?? "",
    [descriptions, selected.id]
  );
  const originalResources = useMemo(
    () =>
      resources
        .filter((r) => r.parent_id === selected.id)
        .sort((a, b) => a.order_index - b.order_index),
    [resources, selected.id]
  );

  const [editMode, setEditMode]             = useState(false);
  const [descText, setDescText]             = useState(originalDesc);
  const [editResources, setEditResources]   = useState<EditableResource[]>(
    originalResources.map((r) => ({ title: r.title, type: r.type, link: r.link }))
  );
  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [comment, setComment]               = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressError, setProgressError]   = useState<string | null>(null);

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
    setProgressError(null);
  }, [selected.id, originalDesc, originalResources]);

  const { percent } = useMemo(
    () => calculateNodeProgress(selected, progress),
    [selected, progress]
  );
  const isLocked = selected.type === "TOPIC" && percent < 70;

  async function handleStatusChange(newStatus: ProgressStatus) {
    setProgressError(null);
    setSavingProgress(true);
    const updated = await updateProgress(selected.id, newStatus);
    if (!updated) setProgressError("Could not save. Please try again.");
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
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function updateResourceField(idx: number, field: keyof EditableResource, value: string) {
    const copy = [...editResources];
    copy[idx] = { ...copy[idx], [field]: value } as EditableResource;
    setEditResources(copy);
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div className="fixed inset-0 z-[199] bg-black/30 md:hidden" onClick={onClose} />

      {/* Panel */}
      <aside
        className="animate-slide-in-panel fixed inset-0 z-[200] flex flex-col md:inset-auto md:top-16 md:right-0 md:bottom-0"
        style={{ width: "100%", background: "#FFFDF8", boxShadow: "var(--shadow-panel)" }}
      >
        <style>{`@media (min-width: 768px) { aside.animate-slide-in-panel { width: 400px; border-left: 1px solid #E2E8F0; } }`}</style>

        <NodeHeader selected={selected} onClose={onClose} />

        <div className="flex-1 overflow-y-auto" style={{ padding: 20 }}>
          <ProgressPicker
            status={status}
            isLoggedIn={isLoggedIn}
            saving={savingProgress}
            error={progressError}
            onStatusChange={handleStatusChange}
          />

          {isLocked ? (
            <div
              style={{
                borderRadius: 12,
                border: "1.5px solid #E2E8F0",
                background: "#F8FAFC",
                padding: "20px 16px",
                textAlign: "center",
              }}
            >
              <p className="font-semibold text-trust-navy mb-1" style={{ fontSize: 14 }}>
                Revision &amp; Sectional Test Locked
              </p>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>
                Complete 70% of subtopics to unlock.
              </p>
              <p className="font-medium" style={{ fontSize: 13, color: "#14B8A6" }}>
                {percent}% complete
              </p>
            </div>
          ) : (
            <>
              <NodeDescription
                originalDesc={originalDesc}
                editMode={editMode}
                descText={descText}
                onChange={setDescText}
                onStartEdit={() => setEditMode(true)}
              />
              <ResourceList
                originalResources={originalResources}
                editMode={editMode}
                editResources={editResources}
                onUpdate={updateResourceField}
                onAdd={() => setEditResources([...editResources, { title: "", type: "VIDEO", link: "" }])}
              />
              <FeedbackForm
                editMode={editMode}
                name={name}
                email={email}
                comment={comment}
                submitting={submitting}
                onStartEdit={() => setEditMode(true)}
                onNameChange={setName}
                onEmailChange={setEmail}
                onCommentChange={setComment}
                onSubmit={handleSubmit}
                onCancel={() => setEditMode(false)}
              />
            </>
          )}
        </div>
      </aside>
    </>
  );
}
