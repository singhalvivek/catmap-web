// practiceProgressSummary — one read of practice attempts, rolled up per chapter and per section
import {
  PRACTICE_SUBJECTS,
  RC_CHAPTER_SLUG,
  type PracticeSubject,
} from "@/constants/practiceChapters";
import { loadLocalProgress } from "./practiceProgressStore";

// Both confirmed to always have exactly 4 questions per unit (see
// PYQ-scraper/planning/percentyl_frontend_guide.md); chapter.questionCount in
// practiceChapters.ts is the chapter TOTAL, so the per-unit count derives the unit count.
const DILR_QUESTIONS_PER_SET = 4;
const RC_QUESTIONS_PER_PASSAGE = 4;

export type SectionKey = PracticeSubject["section"];

/** Attempt tally for one chapter, in the units that chapter is actually practised in. */
export type ChapterProgress = {
  /** Questions attempted across every unit of the chapter. */
  answered: number;
  /** Questions the chapter holds. */
  total: number;
  /** Units (a Quant chapter, a DILR set, an RC passage) fully attempted. */
  doneUnits: number;
  /** Units the chapter holds. */
  totalUnits: number;
};

export type PracticeSummary = {
  /** Site-wide units fully attempted, which is what the hero meter counts. */
  done: number;
  total: number;
  bySection: Record<SectionKey, { done: number; total: number }>;
  /** Keyed by chapterKey(), so a row or a chip can read its own state. */
  byChapter: Record<string, ChapterProgress>;
};

/** The one spelling of a chapter's identity, so a row and a chip cannot disagree. */
export function chapterKey(section: SectionKey, topicSlug: string, chapterSlug: string): string {
  return `${section}:${topicSlug}:${chapterSlug}`;
}

/** Storage keys are per UNIT, and their shape differs by section. */
function unitKeys(
  section: SectionKey,
  topicSlug: string,
  chapterSlug: string,
  questionCount: number
): { key: string; total: number }[] {
  if (section === "Quant") {
    return [{ key: `quant-${topicSlug}-${chapterSlug}`, total: questionCount }];
  }
  if (section === "DILR") {
    const sets = Math.round(questionCount / DILR_QUESTIONS_PER_SET);
    return Array.from({ length: sets }, (_, i) => ({
      key: `dilr-${chapterSlug}-${i + 1}`,
      total: DILR_QUESTIONS_PER_SET,
    }));
  }
  if (chapterSlug === RC_CHAPTER_SLUG) {
    const passages = Math.round(questionCount / RC_QUESTIONS_PER_PASSAGE);
    return Array.from({ length: passages }, (_, i) => ({
      key: `varc-rc-${i + 1}`,
      total: RC_QUESTIONS_PER_PASSAGE,
    }));
  }
  return [{ key: `varc-${chapterSlug}`, total: questionCount }];
}

const EMPTY_SECTIONS = (): Record<SectionKey, { done: number; total: number }> => ({
  Quant: { done: 0, total: 0 },
  DILR: { done: 0, total: 0 },
  VARC: { done: 0, total: 0 },
});

/**
 * Reads every practice key once. Callers previously each walked localStorage themselves
 * with their own idea of what a unit was, which is how the Practice surface ended up
 * showing a Learn percentage beside a practice meter.
 */
export function buildPracticeSummary(): PracticeSummary {
  const bySection = EMPTY_SECTIONS();
  const byChapter: Record<string, ChapterProgress> = {};
  let done = 0;
  let total = 0;

  for (const subject of PRACTICE_SUBJECTS) {
    for (const topic of subject.topics) {
      for (const chapter of topic.chapters) {
        const units = unitKeys(subject.section, topic.slug, chapter.slug, chapter.questionCount);
        let answered = 0;
        let doneUnits = 0;

        for (const unit of units) {
          const progress = loadLocalProgress(unit.key);
          const count = progress ? Object.keys(progress.answers).length : 0;
          answered += Math.min(count, unit.total);
          if (count >= unit.total) doneUnits++;
        }

        byChapter[chapterKey(subject.section, topic.slug, chapter.slug)] = {
          answered,
          total: chapter.questionCount,
          doneUnits,
          totalUnits: units.length,
        };

        done += doneUnits;
        total += units.length;
        bySection[subject.section].done += doneUnits;
        bySection[subject.section].total += units.length;
      }
    }
  }

  return { done, total, bySection, byChapter };
}

export const EMPTY_PRACTICE_SUMMARY: PracticeSummary = {
  done: 0,
  total: 0,
  bySection: EMPTY_SECTIONS(),
  byChapter: {},
};
