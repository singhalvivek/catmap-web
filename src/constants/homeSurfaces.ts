// homeSurfaces — the five product surfaces as data, ordered for a first-time visitor
import { HOME_COUNTS, PYQ_YEAR_RANGE } from "@/app/lib/homeCounts";

export type HomeSurface = {
  /** Stable id for analytics; never rendered. */
  id: string;
  /** Plain-language label. Jargon is expanded here, not assumed. */
  label: string;
  href: string;
  /** What it is, in one sentence of documentation voice. */
  blurb: string;
  /** Derived scale, or a cadence where no count is derivable. */
  meta: string;
  /** Honest note on what needs an account. null when nothing does. */
  signIn: string | null;
};

/**
 * Ordered by what a cold visitor can use immediately, not by how proud we are of it.
 * Past papers and practice need no account at all, so they lead; Daily Dose is
 * sign-in-walled on both halves and its timed set depends on a manual daily upload, so it
 * goes last and is described so an empty day does not make the page a liar.
 */
export const HOME_SURFACES: HomeSurface[] = [
  {
    id: "pyq",
    label: "Past exam papers (PYQs)",
    href: "/cat-prep/pyq",
    blurb:
      "Official CAT question papers, every question with its answer and worked explanation. Read one straight through, or sit it as a timed three-section exam scored the way the real CAT scores.",
    meta: `${HOME_COUNTS.pyqPapers} papers, ${PYQ_YEAR_RANGE}`,
    signIn: "Reading is open to everyone. The timed mock saves your score, so it needs sign-in.",
  },
  {
    id: "practice",
    label: "Practice questions",
    href: "/cat-prep/practice",
    blurb:
      "Chapter-by-chapter question sets across Quant, DILR and VARC. Pick an answer, then read why it is right. Your place in a chapter is kept in the browser.",
    meta: `${HOME_COUNTS.practiceQuestions}+ questions, ${HOME_COUNTS.practiceChapters} chapters`,
    signIn: null,
  },
  {
    id: "learn",
    label: "Syllabus and video lessons",
    href: "/cat-prep",
    blurb:
      "The whole CAT syllabus as an ordered tree. Each subtopic opens a short description and the free video lessons and articles chosen for it, embedded in the page.",
    meta: `${HOME_COUNTS.subtopics} subtopics, ${HOME_COUNTS.resourceLinks} lesson links`,
    signIn: "Browsing is open. Ticking topics off saves to your account, so that needs sign-in.",
  },
  {
    id: "how-to-prepare",
    label: "How to prepare for CAT",
    href: "/cat-prep/how-to-prepare",
    blurb:
      "A straight written guide: what percentile the schools you want actually need, whether coaching is worth the money for you, and a month-by-month plan from here to the exam.",
    meta: "Four phases, written out",
    signIn: null,
  },
  {
    id: "daily-dose",
    label: "Daily Dose",
    href: "/cat-prep/daily-dose",
    blurb:
      "A reading habit for VARC. Each day brings a new long-form essay and four questions on it, and you can read and rate how other people answered the same four.",
    meta: "A new essay every day",
    signIn: "Needs sign-in to submit an answer or see anyone else's.",
  },
];
