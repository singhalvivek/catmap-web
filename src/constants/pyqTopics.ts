// pyqTopics — topic catalog for practising past-paper questions by topic, built on cracku's topic tags
import type { PyqQuestionType, PyqSection } from "@/app/cat-prep/models/pyq";
import { PYQ_LATEST_YEAR, PYQ_YEARS_COVERED } from "./pyqPapers";

export type PyqTopic = {
  /** The URL value. */
  slug: string;
  name: string;
  section: PyqSection;
  /** The heading this topic is listed under within its section. */
  group: string;
  /** Cracku topic slugs. A question carrying any of them belongs to the topic. */
  tags: string[];
  /** A question carrying any of these does not, whatever else it carries. */
  excludeTags?: string[];
  type?: PyqQuestionType;
};

const VERBAL_ABILITY = "cat-verbal-ability-questions";
const PARA_SUMMARY = "cat-para-summary-questions";
const ODD_ONE_OUT = "cat-odd-one-out-questions";

export const PYQ_TOPIC_SECTIONS: { section: PyqSection; label: string }[] = [
  { section: "QA", label: "Quant" },
  { section: "DILR", label: "DILR" },
  { section: "VARC", label: "VARC" },
];

/*
 * Each "All …" topic is cracku's umbrella tag, which every subtopic question below it also
 * carries. Where cracku has two slugs for one topic (logarithms, progressions, TSD) the
 * topic takes both. Topics with no question since 2017 are left out rather than shown
 * permanently disabled.
 */
export const PYQ_TOPICS: PyqTopic[] = [
  { slug: "arithmetic", name: "All Arithmetic", section: "QA", group: "Arithmetic", tags: ["cat-arithmetic-questions"] },
  { slug: "percentages", name: "Percentages", section: "QA", group: "Arithmetic", tags: ["cat-percentages-questions"] },
  { slug: "profit-and-loss", name: "Profit & Loss", section: "QA", group: "Arithmetic", tags: ["cat-profit-and-loss-questions"] },
  { slug: "interest", name: "Simple & Compound Interest", section: "QA", group: "Arithmetic", tags: ["cat-simple-interest-compound-interest-questions"] },
  { slug: "averages", name: "Averages", section: "QA", group: "Arithmetic", tags: ["cat-averages-questions"] },
  { slug: "ratio-and-proportion", name: "Ratio & Proportion", section: "QA", group: "Arithmetic", tags: ["cat-avgs-ratio-proportion-questions"] },
  { slug: "mixtures-and-alligations", name: "Mixtures & Alligations", section: "QA", group: "Arithmetic", tags: ["cat-averages-mixtures-alligations-questions"] },
  { slug: "time-and-work", name: "Time & Work", section: "QA", group: "Arithmetic", tags: ["cat-time-and-work-questions"] },
  { slug: "time-speed-distance", name: "Time, Speed & Distance", section: "QA", group: "Arithmetic", tags: ["cat-time-distance-work-questions", "cat-time-speed-distance-questions"] },

  { slug: "algebra", name: "All Algebra", section: "QA", group: "Algebra", tags: ["cat-algebra-questions"] },
  { slug: "linear-equations", name: "Linear Equations", section: "QA", group: "Algebra", tags: ["cat-linear-equations-questions"] },
  { slug: "quadratic-equations", name: "Quadratic Equations", section: "QA", group: "Algebra", tags: ["cat-quadratic-equations-questions"] },
  { slug: "functions-and-graphs", name: "Functions, Graphs & Statistics", section: "QA", group: "Algebra", tags: ["cat-functions-graphs-statistics-questions"] },
  { slug: "logarithms", name: "Logarithms, Surds & Indices", section: "QA", group: "Algebra", tags: ["cat-logarithms-questions", "cat-logarithms-surds-indices-questions"] },
  { slug: "progressions", name: "Progressions & Series", section: "QA", group: "Algebra", tags: ["cat-progressions-and-series-questions", "cat-number-series-questions"] },

  { slug: "geometry", name: "All Geometry", section: "QA", group: "Geometry", tags: ["cat-geometry-questions"] },
  { slug: "coordinate-geometry", name: "Coordinate Geometry", section: "QA", group: "Geometry", tags: ["cat-coordinate-geometry-questions"] },
  { slug: "mensuration", name: "Mensuration", section: "QA", group: "Geometry", tags: ["cat-mensuration-questions"] },

  { slug: "number-system", name: "Number System", section: "QA", group: "Number System", tags: ["cat-number-systems-questions"] },

  { slug: "modern-math", name: "All Modern Math", section: "QA", group: "Modern Math", tags: ["cat-probability-combinatorics-questions", "cat-venn-diagrams-questions"] },
  { slug: "probability-and-combinatorics", name: "Probability & Combinatorics", section: "QA", group: "Modern Math", tags: ["cat-probability-combinatorics-questions"] },
  { slug: "venn-diagrams", name: "Set Theory & Venn Diagrams", section: "QA", group: "Modern Math", tags: ["cat-venn-diagrams-questions"] },

  { slug: "puzzles", name: "Puzzles", section: "DILR", group: "Logical Reasoning", tags: ["cat-lr-puzzles-questions"] },
  { slug: "arrangements", name: "Arrangements", section: "DILR", group: "Logical Reasoning", tags: ["cat-lr-arrangement-questions"] },
  { slug: "games-and-tournaments", name: "Games & Tournaments", section: "DILR", group: "Logical Reasoning", tags: ["cat-lr-games-and-tournaments-questions"] },
  { slug: "selection-with-conditions", name: "Selection with Conditions", section: "DILR", group: "Logical Reasoning", tags: ["cat-lr-selection-with-condition-questions"] },
  { slug: "routes-and-networks", name: "Routes & Networks", section: "DILR", group: "Logical Reasoning", tags: ["cat-routes-and-networks-questions"] },
  { slug: "quant-based-lr", name: "Quant-based LR", section: "DILR", group: "Logical Reasoning", tags: ["cat-quant-based-lr-questions"] },

  { slug: "tables", name: "Tables", section: "DILR", group: "Data Interpretation", tags: ["cat-table-based-di-sets-questions"] },
  { slug: "charts", name: "Charts", section: "DILR", group: "Data Interpretation", tags: ["cat-di-charts-questions"] },
  { slug: "special-charts", name: "Special Charts", section: "DILR", group: "Data Interpretation", tags: ["cat-di-special-charts-questions"] },
  { slug: "di-venn-diagrams", name: "Venn Diagrams", section: "DILR", group: "Data Interpretation", tags: ["cat-di-venn-diagrams-questions"] },
  { slug: "quant-based-di", name: "Quant-based DI", section: "DILR", group: "Data Interpretation", tags: ["cat-quant-based-di-questions"] },
  { slug: "di-basics", name: "DI Basics", section: "DILR", group: "Data Interpretation", tags: ["cat-data-interpretation-basics-questions"] },

  { slug: "reading-comprehension", name: "Reading Comprehension", section: "VARC", group: "Reading Comprehension", tags: ["cat-reading-comprehension-questions"] },

  { slug: "verbal-ability", name: "All Verbal Ability", section: "VARC", group: "Verbal Ability", tags: [VERBAL_ABILITY] },
  { slug: "para-summary", name: "Para Summary", section: "VARC", group: "Verbal Ability", tags: [PARA_SUMMARY] },
  // Cracku has no para-jumble or sentence-placement tag; both sit under Verbal Ability.
  // The only other TITA there is Odd One Out, and the only other MCQ is Para Summary.
  { slug: "para-jumbles", name: "Para Jumbles", section: "VARC", group: "Verbal Ability", tags: [VERBAL_ABILITY], excludeTags: [ODD_ONE_OUT], type: "tita" },
  { slug: "odd-one-out", name: "Odd One Out", section: "VARC", group: "Verbal Ability", tags: [ODD_ONE_OUT] },
  { slug: "sentence-placement", name: "Sentence Placement", section: "VARC", group: "Verbal Ability", tags: [VERBAL_ABILITY], excludeTags: [PARA_SUMMARY], type: "mcq" },
];

/**
 * The exam years on offer, newest first: the last ten, where a paper exists. There is no
 * 2016 paper, so today that is nine years.
 */
export const PYQ_TOPIC_YEARS: number[] = PYQ_YEARS_COVERED.filter(
  (y) => y > PYQ_LATEST_YEAR - 10
).sort((a, b) => b - a);

export const PYQ_TOPIC_EARLIEST_YEAR = PYQ_TOPIC_YEARS[PYQ_TOPIC_YEARS.length - 1];
export const PYQ_TOPIC_LATEST_YEAR = PYQ_TOPIC_YEARS[0];

export function getPyqTopic(slug: string): PyqTopic | undefined {
  return PYQ_TOPICS.find((t) => t.slug === slug);
}
