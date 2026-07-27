// practiceChapters — static chapter/topic map for the practice section index

export type PracticeChapter = {
  name: string;
  slug: string;
  questionCount: number;
};

export type PracticeTopic = {
  name: string;
  slug: string;
  chapters: PracticeChapter[];
};

export type PracticeSubject = {
  section: "Quant" | "DILR" | "VARC";
  /** Subject node id matching data.json (QA=2, DILR=3, VARC=4) */
  nodeId: number;
  topics: PracticeTopic[];
};

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const PRACTICE_SUBJECTS: PracticeSubject[] = [
  {
    section: "Quant",
    nodeId: 2,
    topics: [
      {
        name: "Arithmetics",
        slug: "arithmetics",
        chapters: [
          { name: "Averages", slug: "averages", questionCount: 20 },
          { name: "Interest", slug: "interest", questionCount: 20 },
          { name: "Mixtures & Alligations", slug: "mixtures-alligations", questionCount: 20 },
          { name: "Percentages", slug: "percentages", questionCount: 20 },
          { name: "Pipes, Trains & Boats", slug: "pipes-trains-boats", questionCount: 20 },
          { name: "Profit & Loss", slug: "profit-loss", questionCount: 20 },
          { name: "Races", slug: "races", questionCount: 20 },
          { name: "Ratio, Proportion & Variation", slug: "ratio-proportion-variation", questionCount: 20 },
          { name: "Time & Work", slug: "time-work", questionCount: 20 },
          { name: "Time, Speed & Distance", slug: "time-speed-distance", questionCount: 20 },
        ],
      },
      {
        name: "Algebra",
        slug: "algebra",
        chapters: [
          { name: "Functions", slug: "functions", questionCount: 20 },
          { name: "Inequalities", slug: "inequalities", questionCount: 20 },
          { name: "Linear & Quadratic Equations", slug: "linear-quadratic-equations", questionCount: 20 },
          { name: "Logarithms", slug: "logarithms", questionCount: 20 },
          { name: "Maxima Minima", slug: "maxima-minima", questionCount: 20 },
          { name: "Progressions", slug: "progressions", questionCount: 20 },
        ],
      },
      {
        name: "Geometry",
        slug: "geometry",
        chapters: [
          { name: "Coordinate Geometry", slug: "coordinate-geometry", questionCount: 20 },
          { name: "Geometry", slug: "geometry", questionCount: 20 },
        ],
      },
      {
        name: "Modern Math",
        slug: "modern-math",
        chapters: [
          { name: "Permutations & Combinations", slug: "permutations-combinations", questionCount: 20 },
          { name: "Probability", slug: "probability", questionCount: 20 },
          { name: "Set Theory", slug: "set-theory", questionCount: 20 },
        ],
      },
      {
        name: "Number System",
        slug: "number-system",
        chapters: [
          { name: "Number System", slug: "number-system", questionCount: 20 },
        ],
      },
    ],
  },
  {
    section: "DILR",
    nodeId: 3,
    topics: [
      {
        name: "Data Interpretation & Logical Reasoning",
        slug: "dilr",
        chapters: [
          { name: "Arrangements", slug: "arrangements", questionCount: 40 },
          { name: "Bar Graphs", slug: "bar-graphs", questionCount: 40 },
        ],
      },
    ],
  },
  {
    section: "VARC",
    nodeId: 4,
    topics: [
      {
        name: "Verbal Ability & Reading Comprehension",
        slug: "varc",
        chapters: [
          { name: "Reading Comprehensions", slug: "reading-comprehensions", questionCount: 200 },
          { name: "Odd One Out", slug: "odd-one-out", questionCount: 50 },
          { name: "Para Jumbles", slug: "para-jumbles", questionCount: 50 },
          { name: "Para Summary", slug: "para-summary", questionCount: 50 },
        ],
      },
    ],
  },
];

/** Look up a PracticeSubject by its subject node id */
export function getPracticeSubject(nodeId: number): PracticeSubject | undefined {
  return PRACTICE_SUBJECTS.find((s) => s.nodeId === nodeId);
}
