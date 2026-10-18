// homeFaqs — home page FAQ entries, CAT-only and reconciled against what the code does
import { HOME_COUNTS, PYQ_YEAR_RANGE } from "@/app/lib/homeCounts";

export type HomeFaq = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Rewritten from src/app/data.ts. Four changes worth knowing about:
 *  - `which-courses` is dropped: it promised a catalogue of other exams.
 *  - `cost` no longer says both "it stays free" and "if we ever charge".
 *  - `who-chooses-videos` and `suggest-resource` are merged; they described one feature by
 *    two different mechanisms, and the "Suggest an edit" button one of them named does not
 *    exist anywhere in the codebase.
 *  - "community-curated" is gone throughout. The real mechanism is one person choosing,
 *    which for this audience is the stronger signal anyway.
 */
export const HOME_FAQS: HomeFaq[] = [
  {
    id: "cost",
    question: "Is it really free?",
    answer:
      "Yes, and there are no advertisements. The lessons are free material that already exists publicly, organised against the syllabus. The past papers and practice questions are free to read and solve without an account. Nothing on the site asks for payment today.",
  },
  {
    id: "what-is-studynaksha",
    question: "What do I actually get?",
    answer: `Five things: ${HOME_COUNTS.pyqPapers} official CAT papers from ${PYQ_YEAR_RANGE} with full solutions and a timed mock mode; ${HOME_COUNTS.practiceQuestions}+ practice questions across ${HOME_COUNTS.practiceChapters} chapters, each with a worked explanation; the syllabus as ${HOME_COUNTS.subtopics} ordered subtopics with ${HOME_COUNTS.resourceLinks} video and article links; a written guide to preparing; and a daily essay with questions for VARC reading.`,
  },
  {
    id: "crack-cat-free",
    question: "Can I really prepare for CAT without coaching?",
    answer:
      "Many people self-study every year. The content was never the scarce part — knowing what to study, in what order, and being able to measure yourself against real papers is. That is what this site tries to cover. It does not give you live classes or a mentor, and if you know you need someone to hold you to a schedule, coaching may still be the right call for you.",
  },
  {
    id: "account-needed",
    question: "Do I need an account?",
    answer:
      "Not to read a past paper, solve practice questions, or browse the syllabus and watch the lessons. Sign-in with Google is needed for the three things that have to be stored against you: saving which topics you have finished, taking the timed mock so the score is kept, and submitting a Daily Dose answer.",
  },
  {
    id: "progress-without-login",
    question: "Does my progress save if I am not signed in?",
    answer:
      "No. Progress is tied to your Google account and saved to the cloud. Without signing in, any status changes are lost when you close the tab. Your position inside a practice chapter is kept by the browser itself, so that much survives a reload on the same device.",
  },
  {
    id: "different-from-youtube",
    question: "How is this different from searching YouTube myself?",
    answer:
      "The lessons are chosen per subtopic and put in the order you would meet them in a course, and they play embedded in the page — no recommendations, no Shorts, no autoplay to something else. You can do all of this yourself on YouTube. It takes weeks, and the weeks are the point.",
  },
  {
    id: "who-chooses-videos",
    question: "Who picks the lessons, and can I suggest a better one?",
    answer:
      "One person picks them, against the syllabus, from freely available material. Yes — every subtopic has a \"Know a better video for this? Suggest it\" link that opens WhatsApp with the topic name already filled in. Add the link and send it.",
  },
  {
    id: "pyq-coverage",
    question: "Which past papers are included?",
    answer: `${HOME_COUNTS.pyqPapers} papers in total, spanning ${PYQ_YEAR_RANGE}. That is not every year — 1992 to 1995 and 2009 to 2016 are missing — but it includes all three slots for each recent year. Every included paper has its questions, answer keys and explanations on the page.`,
  },
  {
    id: "track-progress",
    question: "How does progress tracking work?",
    answer:
      "Open any subtopic in the roadmap and mark it In Progress or Completed with the status picker. The percentage updates across the tree immediately, and it syncs to your account so the same state shows on another device.",
  },
];
