// pyqTopicQuery — pure helpers for PYQs by topic: the URL selection, its Mongo filter, its pages and its wording
import type {
  PyqQuestionType,
  PyqSection,
  PyqTopicCounts,
  PyqTopicPaperCounts,
} from "@/app/cat-prep/models/pyq";
import { PYQ_PAPERS } from "@/constants/pyqPapers";
import { PYQ_TOPIC_YEARS, getPyqTopic, type PyqTopic } from "@/constants/pyqTopics";
import { PYQ_TOPIC_PRACTICE } from "@/constants/routes";

type SearchParamValue = string | string[] | undefined;

/*
 * All nine years of Reading Comprehension is 438 questions and a 4 MB page. Eighty keeps a
 * typical pick — one topic over three years — on a single page.
 */
export const PYQ_TOPIC_PAGE_SIZE = 80;

export type PyqTopicSelection = {
  topic: PyqTopic | null;
  /** Newest first, each one on offer, none repeated. */
  years: number[];
};

export type PyqTopicFilter = {
  section: PyqSection;
  examYear: { $in: number[] };
  "topics.slug": { $in: string[]; $nin?: string[] };
  type?: PyqQuestionType;
};

/** A paper a selection draws on, and how many of its questions it contributes. */
export type PyqTopicPaperSize = { paperSlug: string; size: number };

function asArray(value: SearchParamValue): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * The URL is typed by hand as often as it is built by the form, so anything that is not a
 * known topic or an offered year is dropped rather than treated as an error.
 */
export function parsePyqTopicSelection(params: {
  topic?: SearchParamValue;
  year?: SearchParamValue;
}): PyqTopicSelection {
  const topic = getPyqTopic(asArray(params.topic)[0] ?? "") ?? null;
  const requested = new Set(asArray(params.year).map(Number));
  return { topic, years: PYQ_TOPIC_YEARS.filter((y) => requested.has(y)) };
}

/** Per-paper counts summed into per-year counts, the shape the picker shows. */
export function countsByYear(paperCounts: PyqTopicPaperCounts): PyqTopicCounts {
  const yearOf = new Map(PYQ_PAPERS.map((p) => [p.slug, p.examYear]));
  return Object.fromEntries(
    Object.entries(paperCounts).map(([topicSlug, byPaper]) => {
      const byYear: Record<number, number> = {};
      for (const [paperSlug, count] of Object.entries(byPaper)) {
        const year = yearOf.get(paperSlug);
        if (year !== undefined) byYear[year] = (byYear[year] ?? 0) + count;
      }
      return [topicSlug, byYear];
    })
  );
}

/** The papers a topic's selection draws on, in PYQ_PAPERS order (newest first). */
export function topicPaperSizes(
  byPaper: Record<string, number>,
  years: number[]
): PyqTopicPaperSize[] {
  return PYQ_PAPERS.filter((p) => years.includes(p.examYear) && (byPaper[p.slug] ?? 0) > 0).map(
    (p) => ({ paperSlug: p.slug, size: byPaper[p.slug] })
  );
}

/**
 * Whole papers per page, as many as fit in `pageSize` questions, so a paper's passages,
 * heading and checked count are never split. A paper larger than a page gets one alone.
 */
export function paginatePyqTopicPapers(
  papers: PyqTopicPaperSize[],
  pageSize: number = PYQ_TOPIC_PAGE_SIZE
): PyqTopicPaperSize[][] {
  const pages: PyqTopicPaperSize[][] = [];
  let size = 0;
  for (const paper of papers) {
    if (pages.length === 0 || size + paper.size > pageSize) {
      pages.push([]);
      size = 0;
    }
    pages[pages.length - 1].push(paper);
    size += paper.size;
  }
  return pages;
}

/** The 0-based page a `?page=` value asks for, held inside the pages that exist. */
export function parsePageIndex(value: SearchParamValue, pageCount: number): number {
  const n = Number.parseInt(asArray(value)[0] ?? "", 10);
  if (!Number.isFinite(n) || pageCount === 0) return 0;
  return Math.min(Math.max(n, 1), pageCount) - 1;
}

export function pyqTopicHref(topicSlug: string, years: number[], pageIndex = 0): string {
  const params = new URLSearchParams({ topic: topicSlug });
  for (const year of years) params.append("year", String(year));
  if (pageIndex > 0) params.set("page", String(pageIndex + 1));
  return `${PYQ_TOPIC_PRACTICE}?${params}`;
}

/** "2023", "2023 and 2020", "2023, 2022 and 2020" */
export function listYears(years: number[]): string {
  if (years.length <= 1) return years.join("");
  return `${years.slice(0, -1).join(", ")} and ${years[years.length - 1]}`;
}

export function questionCountLabel(n: number): string {
  return `${n} question${n === 1 ? "" : "s"}`;
}

export function buildPyqTopicFilter(topic: PyqTopic, years: number[]): PyqTopicFilter {
  return {
    section: topic.section,
    examYear: { $in: years },
    "topics.slug": topic.excludeTags
      ? { $in: topic.tags, $nin: topic.excludeTags }
      : { $in: topic.tags },
    ...(topic.type ? { type: topic.type } : {}),
  };
}
