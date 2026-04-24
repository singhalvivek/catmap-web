// NodeDescription — description section: read-only view or editable textarea in edit mode
"use client";

export default function NodeDescription({
  originalDesc,
  editMode,
  descText,
  onChange,
  onStartEdit,
}: {
  originalDesc: string;
  editMode: boolean;
  descText: string;
  onChange: (v: string) => void;
  onStartEdit: () => void;
}) {
  return (
    <section style={{ marginBottom: 20 }}>
      <div
        className="font-bold uppercase mb-2.5"
        style={{ fontSize: 12, color: "#1E3A5F", letterSpacing: "0.5px" }}
      >
        Description
      </div>

      {!editMode ? (
        originalDesc ? (
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.75, margin: 0 }}>
            {originalDesc}
          </p>
        ) : (
          <div
            style={{
              padding: 16,
              borderRadius: 10,
              background: "#F8FAFC",
              border: "1.5px dashed #CBD5E1",
              textAlign: "center",
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            No description yet —{" "}
            <button
              onClick={onStartEdit}
              style={{
                color: "#14B8A6",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
                textDecoration: "underline",
              }}
            >
              be the first to suggest one.
            </button>
          </div>
        )
      ) : (
        <textarea
          value={descText}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Edit description..."
          style={{
            width: "100%",
            minHeight: 100,
            padding: 10,
            borderRadius: 8,
            border: "1.5px solid #CBD5E1",
            fontSize: 14,
            lineHeight: 1.7,
            fontFamily: "inherit",
            resize: "vertical",
            color: "#334155",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      )}
    </section>
  );
}
