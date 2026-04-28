// NodeHeader — panel header: node type badge, title, and close button
"use client";

import { Node } from "../../models/node";

export default function NodeHeader({ selected, onClose }: { selected: Node; onClose: () => void }) {
  return (
    <div
      className="flex items-start justify-between gap-3 shrink-0"
      style={{ padding: "16px 20px", borderBottom: "1px solid #E8EAF0", background: "#fff" }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="font-semibold uppercase mb-1"
          style={{ fontSize: 11, color: "#94A3B8", letterSpacing: "0.6px" }}
        >
          Subtopic
        </div>
        <h2
          className="font-bold text-trust-navy"
          style={{ fontSize: 16, lineHeight: 1.3, margin: 0 }}
        >
          {selected.title}
        </h2>
      </div>
      <button
        onClick={onClose}
        aria-label="Close panel"
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "#F1F5F9",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748B",
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
