// NodeDescription — description section: read-only view of the subtopic description
"use client";

export default function NodeDescription({ originalDesc }: { originalDesc: string }) {
  return (
    <section style={{ marginBottom: 20 }}>
      <div
        className="font-bold uppercase mb-2.5"
        style={{ fontSize: 12, color: "var(--ink)", letterSpacing: "0.5px" }}
      >
        Description
      </div>

      {originalDesc ? (
        <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.75, margin: 0 }}>
          {originalDesc}
        </p>
      ) : (
        <div
          style={{
            padding: 16,
            background: "var(--paper-sunk)",
            border: "1.5px dashed var(--ink-faint)",
            textAlign: "center",
            color: "var(--ink-faint)",
            fontSize: 13,
          }}
        >
          No description yet.
        </div>
      )}
    </section>
  );
}
