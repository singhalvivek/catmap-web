// TopicRow — accordion row for a TOPIC node; expands to show subtopic chips
"use client";

import { useState } from "react";
import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";
import SubtopicChip from "./SubtopicChip";

export default function TopicRow({
  topic,
  onSelectNode,
  selectedId,
  progress,
  accentColor,
}: {
  topic: Node;
  onSelectNode: (node: Node) => void;
  selectedId: number | null;
  progress: Record<number, ProgressStatus>;
  accentColor: string;
}) {
  const [open, setOpen] = useState(false);
  const subtopics = (topic.children ?? []).slice().sort((a, b) => a.order_index - b.order_index);

  const done = subtopics.filter(
    (s) => (progress[s.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.COMPLETED
  ).length;
  const pct = subtopics.length > 0 ? Math.round((done / subtopics.length) * 100) : 0;

  const dotColor =
    pct === 100 ? "#10B981" : pct > 0 ? "#F59E0B" : "#CBD5E1";

  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          borderRadius: open ? "10px 10px 0 0" : 10,
          border: `1.5px solid ${open ? accentColor : "#E2E8F0"}`,
          background: open ? "#FFFDF8" : "#fff",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.18s",
          gap: 12,
        }}
      >
        <div className="flex items-center gap-2.5" style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: dotColor,
              flexShrink: 0,
            }}
          />
          <span
            className="font-bold text-trust-navy text-left"
            style={{ fontSize: 14 }}
          >
            {topic.title}
          </span>
          <span className="font-medium text-slate-400" style={{ fontSize: 11 }}>
            {subtopics.length} subtopics
          </span>
        </div>

        <div className="flex items-center gap-2.5" style={{ flexShrink: 0 }}>
          {subtopics.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: 60,
                  height: 4,
                  borderRadius: 2,
                  background: "#E2E8F0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: accentColor,
                    borderRadius: 2,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <span className="font-semibold text-slate-400" style={{ fontSize: 11 }}>
                {pct}%
              </span>
            </div>
          )}
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: open ? accentColor : "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: open ? "#fff" : "#94A3B8",
              fontSize: 13,
              fontWeight: 700,
              transition: "all 0.18s",
              flexShrink: 0,
            }}
          >
            {open ? "−" : "+"}
          </div>
        </div>
      </button>

      {/* Subtopics panel */}
      <div
        style={{
          maxHeight: open ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          style={{
            padding: "12px 16px 14px",
            borderRadius: "0 0 10px 10px",
            border: `1.5px solid ${accentColor}`,
            borderTop: "none",
            background: "#FAFBFC",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {subtopics.map((s) => (
            <SubtopicChip
              key={s.id}
              node={s}
              isSelected={selectedId === s.id}
              onClick={onSelectNode}
              progress={progress}
            />
          ))}
          {subtopics.length === 0 && (
            <span className="text-slate-400" style={{ fontSize: 13 }}>
              Subtopics coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
