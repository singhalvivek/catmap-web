// FeedbackForm — contributor details form with submit/cancel; renders suggest-edit trigger in view mode
"use client";

export default function FeedbackForm({
  editMode,
  name,
  email,
  comment,
  submitting,
  onNameChange,
  onEmailChange,
  onCommentChange,
  onSubmit,
  onCancel,
  onSuggestEdit,
}: {
  editMode: boolean;
  name: string;
  email: string;
  comment: string;
  submitting: boolean;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onCommentChange: (v: string) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onSuggestEdit: () => void;
}) {
  return (
    <section className="border-t border-calm-border pt-4 space-y-3">
      {!editMode ? (
        <button
          onClick={onSuggestEdit}
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
            onChange={(e) => onNameChange(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded text-sm"
            placeholder="Your email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <textarea
            className="w-full border p-2 rounded text-sm"
            placeholder="Any comments or explanation?"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
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
              onClick={onCancel}
              className="px-4 py-2 border border-calm-border rounded-md text-gray-700 hover:bg-calm-bg transition"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </section>
  );
}
