// FeedbackForm — suggest-edit trigger button and name/email/comment submission form
"use client";

export default function FeedbackForm({
  editMode,
  name,
  email,
  comment,
  submitting,
  onStartEdit,
  onNameChange,
  onEmailChange,
  onCommentChange,
  onSubmit,
  onCancel,
}: {
  editMode: boolean;
  name: string;
  email: string;
  comment: string;
  submitting: boolean;
  onStartEdit: () => void;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onCommentChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <section style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
      {!editMode ? (
        <button
          onClick={onStartEdit}
          className="w-full font-semibold"
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1.5px solid #E2E8F0",
            background: "#fff",
            color: "#64748B",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#14B8A6";
            e.currentTarget.style.color = "#14B8A6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E2E8F0";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          Suggest Edit / Add Resource
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="font-bold text-trust-navy mb-1" style={{ fontSize: 12 }}>
            Your Details
          </div>
          <input
            aria-label="Your name"
            placeholder="Your name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
          />
          <input
            aria-label="Your email"
            placeholder="Your email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
          />
          <textarea
            aria-label="Comments or corrections"
            placeholder="Comments or corrections..."
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            style={{ width: "100%", minHeight: 80, padding: "8px 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" }}
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="font-bold text-white"
              style={{
                flex: 1,
                padding: 9,
                background: "#1E3A5F",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Submitting..." : "Submit Suggestion"}
            </button>
            <button
              onClick={onCancel}
              className="font-semibold"
              style={{
                padding: "9px 16px",
                background: "#F1F5F9",
                color: "#64748B",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
