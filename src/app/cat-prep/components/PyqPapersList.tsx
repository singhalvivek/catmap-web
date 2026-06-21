// PyqPapersList — groups PYQ papers by exam year, newest first
import type { PyqPaperSummary } from "@/app/cat-prep/models/pyq";
import PyqPaperRow from "./PyqPaperRow";

export default function PyqPapersList({ papers }: { papers: PyqPaperSummary[] }) {
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

  return (
    <div className="flex flex-col gap-8">
      {years.map((year) => (
        <div key={year}>
          <h2 className="font-extrabold text-trust-navy" style={{ fontSize: 16, marginBottom: 10 }}>
            {year}
          </h2>
          <div className="flex flex-col gap-2.5">
            {byYear.get(year)!.map((p) => (
              <PyqPaperRow key={p.paperSlug} paper={p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
