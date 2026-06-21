// pyqPapers — static list of scraped CAT previous-year papers, mirrors PYQ-scraper/scrape_cracku.py PAPERS

export type PyqPaperMeta = {
  slug: string;
  examYear: number;
  examSlot: number | null;
};

export const PYQ_PAPERS: PyqPaperMeta[] = [
  { slug: "cat-2025-slot-1-question-paper-solved", examYear: 2025, examSlot: 1 },
  { slug: "cat-2025-slot-2-question-paper-solved", examYear: 2025, examSlot: 2 },
  { slug: "cat-2025-slot-3-question-paper-solved", examYear: 2025, examSlot: 3 },
  { slug: "cat-2024-slot-1-question-paper-solved", examYear: 2024, examSlot: 1 },
  { slug: "cat-2024-slot-2-question-paper-solved", examYear: 2024, examSlot: 2 },
  { slug: "cat-2024-slot-3-question-paper-solved", examYear: 2024, examSlot: 3 },
  { slug: "cat-2023-slot-1-question-paper-solved", examYear: 2023, examSlot: 1 },
  { slug: "cat-2023-slot-2-question-paper-solved", examYear: 2023, examSlot: 2 },
  { slug: "cat-2023-slot-3-question-paper-solved", examYear: 2023, examSlot: 3 },
  { slug: "cat-2022-slot-1-question-paper-solved", examYear: 2022, examSlot: 1 },
  { slug: "cat-2022-slot-2-question-paper-solved", examYear: 2022, examSlot: 2 },
  { slug: "cat-2022-slot-3-question-paper-solved", examYear: 2022, examSlot: 3 },
  { slug: "cat-2021-slot-1-question-paper-solved", examYear: 2021, examSlot: 1 },
  { slug: "cat-2021-slot-2-question-paper-solved", examYear: 2021, examSlot: 2 },
  { slug: "cat-2021-slot-3-question-paper-solved", examYear: 2021, examSlot: 3 },
  { slug: "cat-2020-slot-1-question-paper-solved", examYear: 2020, examSlot: 1 },
  { slug: "cat-2020-slot-2-question-paper-solved", examYear: 2020, examSlot: 2 },
  { slug: "cat-2020-slot-3-question-paper-solved", examYear: 2020, examSlot: 3 },
  { slug: "cat-2019-slot-1-question-paper-solved", examYear: 2019, examSlot: 1 },
  { slug: "cat-2019-slot-2-question-paper-solved", examYear: 2019, examSlot: 2 },
  { slug: "cat-2018-slot-1-question-paper-solved", examYear: 2018, examSlot: 1 },
  { slug: "cat-2018-slot-2-question-paper-solved", examYear: 2018, examSlot: 2 },
  { slug: "cat-2017-shift-1-question-paper-solved", examYear: 2017, examSlot: 1 },
  { slug: "cat-2017-shift-2-question-paper-solved", examYear: 2017, examSlot: 2 },
  // Archive: single paper per year, no slot
  { slug: "cat-2008-question-paper-solved", examYear: 2008, examSlot: null },
  { slug: "cat-2007-question-paper-solved", examYear: 2007, examSlot: null },
  { slug: "cat-2006-question-paper-solved", examYear: 2006, examSlot: null },
  { slug: "cat-2005-question-paper-solved", examYear: 2005, examSlot: null },
  { slug: "cat-2004-question-paper-solved", examYear: 2004, examSlot: null },
  { slug: "cat-2003-leaked-question-paper-solved", examYear: 2003, examSlot: null },
  { slug: "cat-2002-question-paper-solved", examYear: 2002, examSlot: null },
  { slug: "cat-2001-question-paper-solved", examYear: 2001, examSlot: null },
  { slug: "cat-2000-question-paper-solved", examYear: 2000, examSlot: null },
  { slug: "cat-1999-question-paper-solved", examYear: 1999, examSlot: null },
  { slug: "cat-1998-question-paper-solved", examYear: 1998, examSlot: null },
  { slug: "cat-1997-question-paper-solved", examYear: 1997, examSlot: null },
  { slug: "cat-1996-question-paper-solved", examYear: 1996, examSlot: null },
  { slug: "cat-1991-question-paper-solved", examYear: 1991, examSlot: null },
  { slug: "cat-1990-question-paper-solved", examYear: 1990, examSlot: null },
];

export function pyqPaperLabel(paper: { examYear: number; examSlot: number | null }): string {
  return paper.examSlot ? `CAT ${paper.examYear} — Slot ${paper.examSlot}` : `CAT ${paper.examYear}`;
}

export function getPyqPaper(slug: string): PyqPaperMeta | undefined {
  return PYQ_PAPERS.find((p) => p.slug === slug);
}
