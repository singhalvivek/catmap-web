// PyqPaperRow — one past paper: open it to read with solutions, or sit it as a timed mock
import Link from "next/link";
import type { PyqPaperSummary } from "@/app/cat-prep/models/pyq";
import { pyqPaperLabel } from "@/constants/pyqPapers";

export default function PyqPaperRow({
  paper,
  solved = 0,
}: {
  paper: PyqPaperSummary;
  /** Questions already answered in this paper, from either mode. */
  solved?: number;
}) {
  const browseHref = `/cat-prep/pyq/${paper.paperSlug}`;
  const mockHref = `/cat-prep/pyq/${paper.paperSlug}/mock`;

  const varc = paper.sectionCounts.VARC ?? 0;
  const dilr = paper.sectionCounts.DILR ?? 0;
  const qa = paper.sectionCounts.QA ?? 0;
  const total = varc + dilr + qa;

  const pct = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;
  const isDone = total > 0 && solved >= total;

  return (
    /*
     * The row was a <div> whose title was inert text, on a 39-item navigational list — the
     * obvious click target did nothing, and the two buttons beside it were equal weight, so
     * every row asked the reader to choose between two things before they could open one.
     *
     * The title carries the primary link and stretches over the whole row through its
     * ::after. The mock sits above that overlay, which is why it cannot simply be nested:
     * an anchor inside an anchor is invalid.
     */
    <article className="ed-row pyq-row" data-state={isDone ? "correct" : undefined}>
      <div className="pyq-row__main">
        <h3 className="pyq-row__title">
          <Link href={browseHref} className="pyq-row__link">
            {pyqPaperLabel(paper)}
          </Link>
        </h3>
        <p className="pyq-row__meta">
          <span className="pyq-row__total">{total} questions</span>
          {/* The breakdown was computed and summed away. It is the one thing that
              distinguishes one row from the next. */}
          <span aria-hidden="true" className="pyq-row__split">
            VARC {varc} &middot; DILR {dilr} &middot; QA {qa}
          </span>
        </p>

        {solved > 0 && (
          <p className="pyq-row__progress">
            <span
              className="ed-meter pyq-row__meter"
              data-state={isDone ? "correct" : "caution"}
              role="progressbar"
              aria-valuenow={solved}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuetext={`${solved} of ${total} answered`}
              style={{ "--meter-value": pct } as React.CSSProperties}
            >
              <span className="ed-meter__fill" />
            </span>
            <span className="pyq-row__solved">
              {isDone ? "Finished" : `${solved} of ${total} answered`}
            </span>
          </p>
        )}
      </div>

      {/* "Practice" was this button's label while the sticky nav on the same screen pins
          "Practice" to a different surface entirely. */}
      <Link
        href={mockHref}
        className="ed-btn pyq-row__mock"
        data-weight="secondary"
        aria-label={`Sit ${pyqPaperLabel(paper)} as a timed mock test`}
      >
        Timed mock
      </Link>
    </article>
  );
}
