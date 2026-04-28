// SubjectTab — tab button for a CAT subject; shows ProgressRing and completion %
import { Node } from "../models/node";
import { ProgressStatus } from "../models/progress";
import { SubjectMeta } from "../lib/subjectMeta";
import ProgressRing from "./ProgressRing";

export default function SubjectTab({
  subject,
  isActive,
  onClick,
  progress,
  meta,
}: {
  subject: Node;
  isActive: boolean;
  onClick: () => void;
  progress: Record<number, ProgressStatus>;
  meta: SubjectMeta;
}) {
  const topics = subject.children ?? [];
  const allSubs = topics.flatMap((t) => t.children ?? []);
  const done = allSubs.filter(
    (s) => (progress[s.id] ?? ProgressStatus.NOT_STARTED) === ProgressStatus.COMPLETED
  ).length;
  const pct = allSubs.length > 0 ? Math.round((done / allSubs.length) * 100) : 0;

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 10,
        border: `2px solid ${isActive ? meta.color : "#E2E8F0"}`,
        background: isActive ? meta.light : "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.18s",
        textAlign: "left",
        boxShadow: isActive ? `0 0 0 1px ${meta.color}20` : "none",
      }}
    >
      <ProgressRing percent={pct} size={40} stroke={3} color={meta.color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="font-bold"
          style={{
            fontSize: 15,
            color: isActive ? meta.color : "#1E3A5F",
            letterSpacing: "-0.2px",
            marginBottom: 1,
          }}
        >
          {meta.abbr}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#94A3B8",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {pct}% done
        </div>
      </div>
    </button>
  );
}
