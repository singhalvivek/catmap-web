// ResourceList — resources section: card view or editable inputs in edit mode
"use client";

import type { Resource } from "../../models/resource";
import type { EditableResource } from "./types";

export default function ResourceList({
  originalResources,
  editMode,
  editResources,
  onUpdate,
  onAdd,
}: {
  originalResources: Resource[];
  editMode: boolean;
  editResources: EditableResource[];
  onUpdate: (idx: number, field: keyof EditableResource, value: string) => void;
  onAdd: () => void;
}) {
  return (
    <section style={{ marginBottom: 20 }}>
      <div
        className="font-bold uppercase mb-2.5"
        style={{ fontSize: 12, color: "#1E3A5F", letterSpacing: "0.5px" }}
      >
        Resources
      </div>

      {!editMode ? (
        originalResources.length === 0 ? (
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
            No resources yet — suggest one below!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {originalResources.map((r) => (
              <a
                key={r.id}
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #E8EAF0",
                  background: "#fff",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1.5px solid #14B8A6";
                  e.currentTarget.style.background = "#F0FDFA";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1.5px solid #E8EAF0";
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: r.type === "VIDEO" ? "#FEF2F2" : "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  {r.type === "VIDEO" ? "▶" : "📄"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="font-semibold text-trust-navy"
                    style={{
                      fontSize: 13,
                      marginBottom: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {r.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{r.type}</div>
                </div>
                <span className="font-bold" style={{ color: "#14B8A6", fontSize: 13 }}>
                  ↗
                </span>
              </a>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-3">
          {editResources.map((r, idx) => (
            <div
              key={idx}
              style={{ border: "1.5px solid #E2E8F0", borderRadius: 8, padding: 12 }}
              className="flex flex-col gap-2"
            >
              <input
                className="w-full"
                aria-label="Resource title"
                placeholder="Resource title"
                value={r.title}
                onChange={(e) => onUpdate(idx, "title", e.target.value)}
                style={{ border: "1px solid #E2E8F0", padding: "6px 8px", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none" }}
              />
              <select
                className="w-full"
                aria-label="Resource type"
                value={r.type}
                onChange={(e) => onUpdate(idx, "type", e.target.value)}
                style={{ border: "1px solid #E2E8F0", padding: "6px 8px", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none" }}
              >
                <option value="VIDEO">Video</option>
                <option value="ARTICLE">Article</option>
              </select>
              <input
                className="w-full"
                aria-label="Resource link"
                placeholder="Resource link"
                value={r.link}
                onChange={(e) => onUpdate(idx, "link", e.target.value)}
                style={{ border: "1px solid #E2E8F0", padding: "6px 8px", borderRadius: 6, fontSize: 13, fontFamily: "inherit", outline: "none" }}
              />
            </div>
          ))}
          <button
            onClick={onAdd}
            style={{
              background: "none",
              border: "none",
              color: "#14B8A6",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            + Add Resource
          </button>
        </div>
      )}
    </section>
  );
}
