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
    // aria-pressed rather than colour alone: this is a toggle between three subjects, and
    // nothing in the accessible name said which one was showing.
    <button
      type="button"
      onClick={onClick}
      className="subject-tab"
      aria-pressed={isActive}
      aria-label={`${meta.label}, ${pct}% complete`}
    >
      <ProgressRing percent={pct} size={38} stroke={3} color={meta.ring} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="subject-tab__abbr" style={{ display: "block" }}>
          {meta.abbr}
        </span>
        <span className="subject-tab__pct" style={{ display: "block" }}>
          {pct}% done
        </span>
      </span>
    </button>
  );
}
