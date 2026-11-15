// PyqPapersList — past papers grouped by exam year, newest first, with a jump bar for the tail
import type { PyqPaperSummary } from "@/app/cat-prep/models/pyq";
import PyqPaperRow from "./PyqPaperRow";

export default function PyqPapersList({
  papers,
  solvedByPaper = {},
}: {
  papers: PyqPaperSummary[];
  /** Questions answered per paper slug. */
  solvedByPaper?: Record<string, number>;
}) {
  const byYear = new Map<number, PyqPaperSummary[]>();
  for (const p of papers) {
    const group = byYear.get(p.examYear);
    if (group) group.push(p);
    else byYear.set(p.examYear, [p]);
  }
  for (const group of byYear.values()) {
    group.sort((a, b) => (a.examSlot ?? 0) - (b.examSlot ?? 0));
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  if (years.length === 0) {
    return (
      <p className="ed-empty">
        No past papers are available right now. This is a problem on our side, not yours —
        please try again shortly.
      </p>
    );
  }

  return (
    <div>
      {/*
        Thirty-nine papers run to six thousand pixels. A reader who wants 2019 had to scroll
        past every year above it, because the only structure on the page was the order.
      */}
      <nav className="pyq-years" aria-label="Jump to an exam year">
        <span className="pyq-years__label">Jump to</span>
        <ul className="pyq-years__list">
          {years.map((year) => (
            <li key={year}>
              <a href={`#year-${year}`} className="pyq-years__link">
                {year}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {years.map((year) => (
        <section key={year} className="pyq-group">
          <h3 id={`year-${year}`} className="pyq-group__year display">
            {year}
          </h3>
          <div>
            {byYear.get(year)!.map((p) => (
              <PyqPaperRow
                key={p.paperSlug}
                paper={p}
                solved={solvedByPaper[p.paperSlug] ?? 0}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
