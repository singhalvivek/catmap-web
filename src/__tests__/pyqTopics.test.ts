// pyqTopics.test — the PYQ topic catalog and the pure helpers that turn a selection into queries and pages
import { describe, it, expect } from "vitest";
import { PYQ_TOPICS, PYQ_TOPIC_SECTIONS, PYQ_TOPIC_YEARS } from "../constants/pyqTopics";
import { PYQ_LATEST_YEAR, PYQ_YEARS_COVERED } from "../constants/pyqPapers";
import {
  buildPyqTopicFilter,
  countsByYear,
  listYears,
  paginatePyqTopicPapers,
  parsePageIndex,
  parsePyqTopicSelection,
  pyqTopicHref,
  questionCountLabel,
  topicPaperSizes,
  type PyqTopicPaperSize,
} from "../lib/pyqTopicQuery";

const S1_2024 = "cat-2024-slot-1-question-paper-solved";
const S2_2024 = "cat-2024-slot-2-question-paper-solved";
const S1_2023 = "cat-2023-slot-1-question-paper-solved";

function paper(slug: string, size: number): PyqTopicPaperSize {
  return { paperSlug: slug, size };
}

function topic(slug: string) {
  const found = PYQ_TOPICS.find((t) => t.slug === slug);
  if (!found) throw new Error(`no topic ${slug}`);
  return found;
}

describe("PYQ_TOPICS", () => {
  it("gives every topic a unique slug", () => {
    const slugs = PYQ_TOPICS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every topic at least one tag and a listed section", () => {
    const sections = new Set(PYQ_TOPIC_SECTIONS.map((s) => s.section));
    for (const t of PYQ_TOPICS) {
      expect(t.tags.length).toBeGreaterThan(0);
      expect(sections.has(t.section)).toBe(true);
    }
  });

  it("never excludes a tag it also requires", () => {
    for (const t of PYQ_TOPICS) {
      for (const excluded of t.excludeTags ?? []) expect(t.tags).not.toContain(excluded);
    }
  });
});

describe("PYQ_TOPIC_YEARS", () => {
  it("offers only years that have a paper, newest first, within the last ten", () => {
    expect(PYQ_TOPIC_YEARS[0]).toBe(PYQ_LATEST_YEAR);
    expect([...PYQ_TOPIC_YEARS].sort((a, b) => b - a)).toEqual(PYQ_TOPIC_YEARS);
    for (const y of PYQ_TOPIC_YEARS) {
      expect(PYQ_YEARS_COVERED).toContain(y);
      expect(y).toBeGreaterThan(PYQ_LATEST_YEAR - 10);
    }
  });
});

describe("parsePyqTopicSelection", () => {
  it("reads a topic and its years, newest first", () => {
    const { topic: t, years } = parsePyqTopicSelection({
      topic: "arithmetic",
      year: ["2020", "2023", "2022"],
    });
    expect(t?.slug).toBe("arithmetic");
    expect(years).toEqual([2023, 2022, 2020]);
  });

  it("accepts a single year as a plain string", () => {
    expect(parsePyqTopicSelection({ topic: "para-summary", year: "2024" }).years).toEqual([2024]);
  });

  it("drops an unknown topic", () => {
    expect(parsePyqTopicSelection({ topic: "nope", year: "2024" }).topic).toBeNull();
  });

  it("drops years that are not on offer, malformed or repeated", () => {
    const { years } = parsePyqTopicSelection({
      topic: "arithmetic",
      year: ["1990", "abc", "", "2023", "2023", String(PYQ_LATEST_YEAR + 1)],
    });
    expect(years).toEqual([2023]);
  });

  it("takes the first topic when the URL repeats it", () => {
    expect(parsePyqTopicSelection({ topic: ["algebra", "geometry"] }).topic?.slug).toBe("algebra");
  });

  it("returns an empty selection for no params", () => {
    expect(parsePyqTopicSelection({})).toEqual({ topic: null, years: [] });
  });
});

describe("countsByYear", () => {
  it("sums each topic's paper counts into its years", () => {
    expect(countsByYear({ arithmetic: { [S1_2024]: 8, [S2_2024]: 9, [S1_2023]: 7 } })).toEqual({
      arithmetic: { 2024: 17, 2023: 7 },
    });
  });

  it("ignores a paper it has no entry for", () => {
    expect(countsByYear({ arithmetic: { "cat-2030-slot-9": 5 } })).toEqual({ arithmetic: {} });
  });
});

describe("topicPaperSizes", () => {
  it("keeps the picked years' papers that have questions, newest first", () => {
    expect(topicPaperSizes({ [S1_2023]: 7, [S2_2024]: 0, [S1_2024]: 8 }, [2023, 2024])).toEqual([
      { paperSlug: S1_2024, size: 8 },
      { paperSlug: S1_2023, size: 7 },
    ]);
  });

  it("leaves out years that were not picked", () => {
    expect(topicPaperSizes({ [S1_2024]: 8, [S1_2023]: 7 }, [2023])).toEqual([
      { paperSlug: S1_2023, size: 7 },
    ]);
  });
});

describe("paginatePyqTopicPapers", () => {
  const slugsOf = (pages: PyqTopicPaperSize[][]) => pages.map((p) => p.map((x) => x.paperSlug));

  it("keeps a set within one page size on a single page", () => {
    expect(slugsOf(paginatePyqTopicPapers([paper("a", 30), paper("b", 30), paper("c", 20)], 80))).toEqual([
      ["a", "b", "c"],
    ]);
  });

  it("starts a new page rather than split a paper", () => {
    expect(slugsOf(paginatePyqTopicPapers([paper("a", 30), paper("b", 30), paper("c", 30)], 80))).toEqual([
      ["a", "b"],
      ["c"],
    ]);
  });

  it("gives a paper larger than a page a page of its own", () => {
    expect(slugsOf(paginatePyqTopicPapers([paper("a", 10), paper("b", 100), paper("c", 10)], 80))).toEqual([
      ["a"],
      ["b"],
      ["c"],
    ]);
  });

  it("returns no pages for no papers", () => {
    expect(paginatePyqTopicPapers([], 80)).toEqual([]);
  });
});

describe("parsePageIndex", () => {
  it("reads a 1-based page as a 0-based index", () => {
    expect(parsePageIndex("2", 5)).toBe(1);
  });

  it("defaults to the first page", () => {
    expect(parsePageIndex(undefined, 5)).toBe(0);
    expect(parsePageIndex("abc", 5)).toBe(0);
  });

  it("holds an out-of-range page inside the pages that exist", () => {
    expect(parsePageIndex("0", 5)).toBe(0);
    expect(parsePageIndex("-3", 5)).toBe(0);
    expect(parsePageIndex("99", 5)).toBe(4);
    expect(parsePageIndex("3", 0)).toBe(0);
  });
});

describe("pyqTopicHref", () => {
  it("builds the URL the picker's form would submit", () => {
    expect(pyqTopicHref("arithmetic", [2023, 2022])).toBe(
      "/cat-prep/practice/pyq-by-topic?topic=arithmetic&year=2023&year=2022"
    );
  });

  it("adds the page only after the first", () => {
    expect(pyqTopicHref("arithmetic", [2023], 2)).toBe(
      "/cat-prep/practice/pyq-by-topic?topic=arithmetic&year=2023&page=3"
    );
  });
});

describe("wording", () => {
  it("lists years the way a sentence would", () => {
    expect(listYears([2023])).toBe("2023");
    expect(listYears([2023, 2020])).toBe("2023 and 2020");
    expect(listYears([2023, 2022, 2020])).toBe("2023, 2022 and 2020");
  });

  it("counts questions in the singular only for one", () => {
    expect(questionCountLabel(1)).toBe("1 question");
    expect(questionCountLabel(0)).toBe("0 questions");
    expect(questionCountLabel(76)).toBe("76 questions");
  });
});

describe("buildPyqTopicFilter", () => {
  it("matches any of a topic's tags within its section and years", () => {
    expect(buildPyqTopicFilter(topic("logarithms"), [2023, 2022])).toEqual({
      section: "QA",
      examYear: { $in: [2023, 2022] },
      "topics.slug": { $in: ["cat-logarithms-questions", "cat-logarithms-surds-indices-questions"] },
    });
  });

  it("carves para jumbles out of verbal ability as its TITA questions that are not odd one out", () => {
    expect(buildPyqTopicFilter(topic("para-jumbles"), [2025])).toEqual({
      section: "VARC",
      examYear: { $in: [2025] },
      "topics.slug": { $in: ["cat-verbal-ability-questions"], $nin: ["cat-odd-one-out-questions"] },
      type: "tita",
    });
  });

  it("carves sentence placement out as verbal ability MCQs that are not para summary", () => {
    const filter = buildPyqTopicFilter(topic("sentence-placement"), [2025]);
    expect(filter["topics.slug"].$nin).toEqual(["cat-para-summary-questions"]);
    expect(filter.type).toBe("mcq");
  });
});
