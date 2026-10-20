// SubjectTab — tab button for a CAT subject; shows a ProgressRing for the surface it is on
import { SubjectMeta } from "../lib/subjectMeta";
import ProgressRing from "./ProgressRing";

export default function SubjectTab({
  isActive,
  onClick,
  percent,
  /** What the percentage counts, for the accessible name: "read", "practised". */
  measure,
  meta,
}: {
  isActive: boolean;
  onClick: () => void;
  percent: number;
  measure: string;
  meta: SubjectMeta;
}) {
  return (
    // The percentage arrives as a prop rather than being computed here. This component used
    // to derive it from the Learn progress map and was rendered on Practice too, so a reader
    // who had read half the syllabus and practised none of it saw "QA 50% done" above a
    // practice list they had never opened.
    //
    // aria-pressed rather than colour alone: this is a toggle between three subjects, and
    // nothing in the accessible name said which one was showing.
    <button
      type="button"
      onClick={onClick}
      className="subject-tab"
      aria-pressed={isActive}
      aria-label={`${meta.abbr}, ${meta.label}, ${percent}% ${measure}`}
    >
      <ProgressRing percent={percent} size={38} stroke={3} color={meta.ring} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="subject-tab__abbr" style={{ display: "block" }}>
          {meta.abbr}
        </span>
        <span className="subject-tab__pct" style={{ display: "block" }}>
          {percent}%<span className="subject-tab__done"> {measure}</span>
        </span>
      </span>
    </button>
  );
}
