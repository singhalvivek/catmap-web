// catPrepGuide — content for /cat-prep/how-to-prepare, including the FAQ its schema declares

export type GuideSection = {
  /** Anchor, and the key the contents list links to. */
  id: string;
  /** Heading as it appears on the page. */
  title: string;
  /** Short form for the contents list, where the full heading is too long to scan. */
  short: string;
};

/**
 * The spine. Every section heading and every contents entry renders from this, so the two
 * cannot drift — and because each carries an id, every section is addressable. None of the
 * six headings used to be: a visitor arriving on a search result for "do I need coaching"
 * landed at the top of 3,000 words with no way to reach the part they came for.
 */
export const GUIDE_SECTIONS: GuideSection[] = [
  { id: "target", title: "Know what score you are actually aiming for", short: "Your target score" },
  { id: "coaching", title: "Coaching or self-study?", short: "Coaching or self-study" },
  { id: "phases", title: "Plan your preparation in phases", short: "A plan by month" },
  { id: "sections", title: "What each section actually requires", short: "The three sections" },
  { id: "studynaksha", title: "Where StudyNaksha fits in your prep", short: "Where this site fits" },
  { id: "mistakes", title: "Mistakes most aspirants make", short: "Common mistakes" },
  { id: "questions", title: "Questions people ask", short: "Questions people ask" },
];

export const SCORE_TARGETS = [
  {
    percentile: "99%+",
    label: "IIM A, B, C",
    detail:
      "Top 1% of ~3 lakh test-takers. You need near-perfection across all three sections with no sectional weak spots. Expect 3–5 years of high-performance B-school competition post-selection too.",
  },
  {
    percentile: "97–99%",
    label: "IIM L, K, I + XLRI, FMS",
    detail:
      "Excellent outcome. These institutes have strong placements. Most serious candidates with 12 months of focused prep land here. Worth targeting even if IIM A is the dream.",
  },
  {
    percentile: "90–97%",
    label: "Newer IIMs + MDI, SPJIMR, IIFT",
    detail:
      "Solid MBA destinations with good ROI. At 90%+, you have real options. Many working professionals comfortably reach this band with 6 focused months.",
  },
  {
    percentile: "80–90%",
    label: "Good non-IIM B-schools",
    detail:
      "Respectable, especially if other profile factors are strong. Sectional cutoffs matter here — an 85 overall with a weak VARC can still eliminate you from certain colleges.",
  },
];

/**
 * No weight field. The two blocks used to carry weight: 4 and weight: 1, rendered as the
 * thickness of a top border — so the page's only piece of typographic argument sat on the
 * side its own lede argues against ("coaching is a tool, not a requirement"). They are
 * equal halves of one question now, separated by a rule, which is what the spec asked for.
 */
export const COACHING_HONEST = [
  {
    title: "Coaching is worth it if…",
    kicker: "Argument for",
    points: [
      "You have never prepared for a competitive exam and need a structured baseline",
      "You are a working professional who needs imposed deadlines to study",
      "You are severely weak in one section (QA especially) and need expert doubt resolution",
      "Peer competition and a cohort keeps you motivated",
    ],
  },
  {
    title: "Coaching is not necessary if…",
    kicker: "Argument against",
    points: [
      "You are self-disciplined and can build a study schedule you will actually follow",
      "You have access to good books, free YouTube resources, and a test series",
      "Your baseline is already decent (scored well in 10th/12th Math, strong English reader)",
      "Budget is a real constraint — top coaching runs ₹60,000–₹1.5L, and ROI is not guaranteed",
    ],
  },
];

export const PHASES = [
  {
    months: "Months 1–3",
    title: "Build the foundation",
    tasks: [
      "Take one diagnostic mock test to find your real starting point — not your imagined one",
      "Cover VARC: read one editorial per day (Hindu, Mint, Aeon), tackle RC question types",
      "Cover QA: Arithmetic → Algebra → Geometry. Use standard books (Arun Sharma or Sarvesh Verma)",
      "Cover DILR: practice 1 set daily, focus on LR puzzles and DI caselets",
      "Take a sectional mock at the end of each month",
    ],
  },
  {
    months: "Months 4–6",
    title: "Go deeper and test often",
    tasks: [
      "Move to advanced topics within each section; plug the weak spots from Phase 1",
      "Solve 2 sectional mocks per week per section",
      "Start attempting PYQ papers — they show what the exam actually tests vs. what textbooks cover",
      "Take 1 full mock per week from Month 5 onwards",
      "Maintain an error log: track the same mistakes recurring across mocks",
    ],
  },
  {
    months: "Months 7–9",
    title: "Mock-heavy, analysis-first",
    tasks: [
      "Target 2 full-length mocks per week — one on weekend, one mid-week",
      "Spend as much time analysing each mock as you spent taking it",
      "Solve CAT PYQs from the last 5 years in mock-test mode for calibration",
      "Identify your attempt strategy per section: which question types to skip, which to lock in on",
      "Do not start new topics. Double down on your strengths; manage your weaknesses",
    ],
  },
  {
    months: "Final 4–6 weeks",
    title: "Sharpen, do not scramble",
    tasks: [
      "3 full mocks per week — timed, no interruptions, phone away",
      "Review your best and worst mock performances to understand what worked",
      "Revise formulas and shortcuts; do not attempt to learn anything new",
      "Simulate actual exam conditions: same time slot (afternoon), no shortcuts",
      "Solve PYQs from earlier years you have not touched yet",
    ],
  },
];

/**
 * The abbreviation leads each of these now. It used to be an emoji — a 24px open book
 * beside "VARC" — and this design language has no icon slot, so three emoji were the
 * clearest tell on the page that it had been assembled rather than set.
 */
export const SECTION_TIPS = [
  {
    section: "VARC",
    full: "Verbal Ability & Reading Comprehension",
    share: "24 questions · ~40% of the paper",
    tip: "RC is ~75% of VARC. The only reliable way to improve is to read widely and often — not to practice 200 RC passages with tricks. Read good prose daily for 3–6 months and comprehension becomes intuitive. VA (para jumbles, odd one out) can be cracked with pattern recognition — practice past papers.",
  },
  {
    section: "DILR",
    full: "Data Interpretation & Logical Reasoning",
    share: "20 questions · ~33% of the paper",
    tip: "The most variable section — difficulty swings wildly year to year. CAT 2021 DILR was notoriously brutal; 2023 was relatively gentler. Train your set-selection instinct: spend 90 seconds reading a set, decide if it is worth attempting. Do not brute-force every set. Speed comes from practice, not from reading theory.",
  },
  {
    section: "QA",
    full: "Quantitative Ability",
    share: "22 questions · ~37% of the paper",
    tip: "The most learnable section if you are willing to put in the arithmetic. Arithmetic alone (percentages, ratios, TSD, PnC) covers 50%+ of questions. Do not panic if Geometry or Number Theory feels hard early — they can be learned. Target accuracy over speed in early prep, speed follows naturally.",
  },
];

export const MISTAKES = [
  {
    mistake: "Starting with mocks before covering basics",
    fix: "A mock score before concepts are solid is meaningless noise. Build foundation first, then add mocks.",
  },
  {
    mistake: "Collecting resources instead of using them",
    fix: "Three good books and one test series beat 12 books you never finish. More material is not more prep.",
  },
  {
    mistake: "Taking mocks without analysing them",
    fix: "Analysis is where the learning happens. A mock you review for 2 hours is worth more than three you just score.",
  },
  {
    mistake: "Ignoring sectional cutoffs",
    fix: "A 97 overall with a 60 percentile VARC gets you nowhere in most top colleges. All three sections matter.",
  },
  {
    mistake: "Burning out in Month 3 and disappearing",
    fix: "Consistency over intensity. 2 focused hours daily beats 8-hour Sunday sessions. CAT rewards the long game.",
  },
];

/**
 * One array for the FAQPage schema AND the section a reader sees. They used to be separate,
 * and only the schema existed: five answers declared to Google and rendered nowhere, which
 * breaks Google's own requirement that FAQPage content be visible on the page, and left
 * anyone arriving on that rich result with nothing to land on.
 */
export const GUIDE_FAQS = [
  {
    q: "What CAT percentile is needed to get into IIM A, B, C?",
    a: "99%+ percentile is required for IIM A, B, C — top 1% of ~3 lakh test-takers. IIM L, K, I, XLRI, and FMS require 97–99%. Newer IIMs and MDI, SPJIMR, IIFT require 90–97%. These are General category cutoffs; OBC/EWS cutoffs are ~10–15 percentile points lower.",
  },
  {
    q: "How long does it take to prepare for CAT?",
    a: "Most serious aspirants start 9–12 months before the exam (CAT is held in November). Preparation spans four phases: foundation-building (Months 1–3), deeper practice and mocks (Months 4–6), mock-heavy analysis (Months 7–9), and a sharpening phase in the final 4–6 weeks.",
  },
  {
    q: "Do I need coaching to crack CAT?",
    a: "Coaching is a tool, not a requirement. Every year, multiple 99%ilers crack CAT through self-study. Coaching helps if you need structured deadlines or expert doubt resolution. The hybrid path — coaching only for your weakest section — often offers the best ROI.",
  },
  {
    q: "What are the three sections of the CAT exam?",
    a: "CAT has three sections with 40 minutes each: VARC (Verbal Ability & Reading Comprehension, 24 questions — ~40% of total score), DILR (Data Interpretation & Logical Reasoning, 20 questions — ~33%), and QA (Quantitative Ability, 22 questions — ~37%). Sections are taken sequentially; you cannot move between them mid-exam.",
  },
  {
    q: "How many mock tests should I take for CAT?",
    a: "Target 1 full mock per week from Month 5, ramping to 2 per week in Months 7–9 and 3 per week in the final 4–6 weeks. Spend as much time analysing each mock as you spent taking it — that is where the actual learning happens.",
  },
];

export const GUIDE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GUIDE_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
