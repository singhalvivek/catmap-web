// homeCounts — every number the home page shows, derived from repo data at build time
import data from "@/app/cat-prep/data.json";
import type { Node } from "@/app/cat-prep/models/node";
import { ALL_RESOURCES } from "@/app/cat-prep/lib/allResources";
import { PRACTICE_SUBJECTS } from "@/constants/practiceChapters";
import { PYQ_PAPERS } from "@/constants/pyqPapers";

const NODES = data as Node[];

// data.json's root (id 1, "CAT Preparation") is itself typed SUBJECT, so the three exam
// sections are the SUBJECT nodes that have a parent. A bare type filter returns 4.
const SECTION_NODES = NODES.filter((n) => n.type === "SUBJECT" && n.parent_id !== null);

const SUBTOPIC_NODES = NODES.filter((n) => n.type === "SUBTOPIC");

const PRACTICE_CHAPTERS = PRACTICE_SUBJECTS.flatMap((s) =>
  s.topics.flatMap((t) => t.chapters)
);

// ALL_RESOURCES is the merged list the roadmap actually renders: 110 standalone entries
// from resources.json plus 35 instructor series from videoSeries.json. Counting
// resources.json alone undercounts openable links by the 219 videos inside those series,
// and undercounts covered subtopics by 8.
const RESOURCE_PARENT_IDS = new Set<number>(ALL_RESOURCES.map((r) => r.parent_id));

const PYQ_YEARS = PYQ_PAPERS.map((p) => p.examYear);

export type HomeCounts = {
  sections: number;
  topics: number;
  subtopics: number;
  /** Subtopics carrying at least one curated resource or instructor-series video. */
  subtopicsWithResources: number;
  /** Every link a visitor can open, counting each video inside an instructor series. */
  resourceLinks: number;
  pyqPapers: number;
  pyqEarliestYear: number;
  pyqLatestYear: number;
  practiceChapters: number;
  /**
   * Nominal total from practiceChapters.ts, which is hand-maintained — check:content only
   * asserts each chapter matches more than zero Mongo documents, never the exact figure.
   * Always render with a "+", as the quant route and sitemap-page already do.
   */
  practiceQuestions: number;
};

export const HOME_COUNTS: HomeCounts = {
  sections: SECTION_NODES.length,
  topics: NODES.filter((n) => n.type === "TOPIC").length,
  subtopics: SUBTOPIC_NODES.length,
  subtopicsWithResources: SUBTOPIC_NODES.filter((n) => RESOURCE_PARENT_IDS.has(n.id)).length,
  resourceLinks: ALL_RESOURCES.reduce((n, r) => n + (r.items?.length ?? 1), 0),
  pyqPapers: PYQ_PAPERS.length,
  pyqEarliestYear: Math.min(...PYQ_YEARS),
  pyqLatestYear: Math.max(...PYQ_YEARS),
  practiceChapters: PRACTICE_CHAPTERS.length,
  practiceQuestions: PRACTICE_CHAPTERS.reduce((n, c) => n + c.questionCount, 0),
};

// The span, not the coverage: 1992–1995 and 2009–2016 are absent, so copy may say
// "39 papers, 1990 to 2025" but never "every CAT paper since 1990".
export const PYQ_YEAR_RANGE = `${HOME_COUNTS.pyqEarliestYear} to ${HOME_COUNTS.pyqLatestYear}`;

// Most recent paper, by year then slot. Derived rather than written down so it cannot go
// stale the next time a paper is added to pyqPapers.ts.
const NEWEST_PAPER = [...PYQ_PAPERS].sort(
  (a, b) => b.examYear - a.examYear || (b.examSlot ?? 0) - (a.examSlot ?? 0)
)[0];

export const NEWEST_PYQ = NEWEST_PAPER
  ? {
      slug: NEWEST_PAPER.slug,
      href: `/cat-prep/pyq/${NEWEST_PAPER.slug}`,
      label: `CAT ${NEWEST_PAPER.examYear}${
        NEWEST_PAPER.examSlot ? ` Slot ${NEWEST_PAPER.examSlot}` : ""
      }`,
    }
  : null;
