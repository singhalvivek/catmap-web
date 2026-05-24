// NodeDescription — description section: read-only view of the subtopic description
"use client";

export default function NodeDescription({ originalDesc }: { originalDesc: string }) {
  return (
    <section style={{ marginBottom: 20 }}>
      <div
        className="font-bold uppercase mb-2.5"
        style={{ fontSize: 12, color: "#1E3A5F", letterSpacing: "0.5px" }}
      >
        Description
      </div>

      {originalDesc ? (
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
          No description yet.
        </div>
      )}
    </section>
  );
}
