// ContinueLearning — amber strip of in-progress subtopic chips; hidden when none are in progress
"use client";

import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";
import { SubjectMeta, SUBJECT_META } from "../lib/subjectMeta";

type InProgressEntry = {
  node: Node;
  meta: SubjectMeta;
  topicTitle: string;
};

export default function ContinueLearning({
  subjects,
  progress,
  onSelectNode,
}: {
  subjects: Node[];
  progress: Record<number, ProgressStatus>;
  onSelectNode: (node: Node) => void;
}) {
  const inProgress: InProgressEntry[] = subjects.flatMap((subject) => {
    const meta = SUBJECT_META[subject.id];
    if (!meta) return [];
    return (subject.children ?? []).flatMap((topic) =>
      (topic.children ?? [])
        .filter((sub) => (progress[sub.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.IN_PROGRESS)
        .map((sub) => ({ node: sub, meta, topicTitle: topic.title }))
    );
  });

  if (inProgress.length === 0) return null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1.5px solid #FDE68A",
        padding: "16px 20px",
        marginBottom: 28,
        boxShadow: "0 2px 12px rgba(245,158,11,0.08)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 16 }}>🔖</span>
        <span className="font-extrabold" style={{ fontSize: 14, color: "#92400E" }}>
          Continue Learning
        </span>
        <span className="font-medium ml-auto" style={{ fontSize: 11, color: "#94A3B8" }}>
          {inProgress.length} in progress
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {inProgress.map(({ node, meta, topicTitle }) => (
          <button
            key={node.id}
            onClick={() => onSelectNode(node)}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "8px 12px",
              borderRadius: 10,
              border: "1.5px solid #FDE68A",
              background: "#FFFBEB",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "1.5px solid #F59E0B";
              e.currentTarget.style.background = "#FEF3C7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = "1.5px solid #FDE68A";
              e.currentTarget.style.background = "#FFFBEB";
            }}
          >
            <div className="font-bold" style={{ fontSize: 13, color: "#92400E" }}>
              {node.title}
            </div>
            <div style={{ fontSize: 11, color: "#B45309", marginTop: 2 }}>
              <span className="font-semibold" style={{ color: meta.color }}>
                {meta.abbr}
              </span>{" "}
              · {topicTitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
