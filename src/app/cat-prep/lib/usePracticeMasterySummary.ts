// usePracticeMasterySummary — counts practice subtopics (Quant chapter / DILR set / RC passage) fully attempted
"use client";

import { useState } from "react";
import { PRACTICE_SUBJECTS } from "@/constants/practiceChapters";
import { loadLocalProgress } from "./practiceProgressStore";

// Both confirmed to always have exactly 4 questions per unit (see PYQ-scraper/planning/percentyl_frontend_guide.md);
// chapter.questionCount in practiceChapters.ts is the chapter TOTAL, so the per-unit count derives the unit count.
const DILR_QUESTIONS_PER_SET = 4;
const RC_QUESTIONS_PER_PASSAGE = 4;

type Subtopic = { key: string; totalQuestions: number };

function buildTrackableSubtopics(): Subtopic[] {
  const subtopics: Subtopic[] = [];

  const quant = PRACTICE_SUBJECTS.find((s) => s.section === "Quant");
  for (const topic of quant?.topics ?? []) {
    for (const chapter of topic.chapters) {
      subtopics.push({ key: `quant-${topic.slug}-${chapter.slug}`, totalQuestions: chapter.questionCount });
    }
  }

  const dilr = PRACTICE_SUBJECTS.find((s) => s.section === "DILR");
  for (const topic of dilr?.topics ?? []) {
    for (const chapter of topic.chapters) {
      const setCount = Math.round(chapter.questionCount / DILR_QUESTIONS_PER_SET);
      for (let setNum = 1; setNum <= setCount; setNum++) {
        subtopics.push({ key: `dilr-${chapter.slug}-${setNum}`, totalQuestions: DILR_QUESTIONS_PER_SET });
      }
    }
  }

  // Only Reading Comprehensions has a built player today — Odd One Out / Para Jumbles /
  // Para Summary are listed in practiceChapters.ts but have no route yet, so they're excluded
  // (including them would permanently cap this metric below 100%).
  const varc = PRACTICE_SUBJECTS.find((s) => s.section === "VARC");
  const rcChapter = varc?.topics.flatMap((t) => t.chapters).find((c) => c.slug === "reading-comprehensions");
  const rcCount = rcChapter ? Math.round(rcChapter.questionCount / RC_QUESTIONS_PER_PASSAGE) : 0;
  for (let rcNum = 1; rcNum <= rcCount; rcNum++) {
    subtopics.push({ key: `varc-rc-${rcNum}`, totalQuestions: RC_QUESTIONS_PER_PASSAGE });
  }

  return subtopics;
}

/** A subtopic counts as done once every one of its questions has been attempted. */
export function usePracticeMasterySummary(): { done: number; total: number } {
  // Lazy initializer (matches usePracticeProgress/ContinuePractice's existing pattern) —
  // loadLocalProgress no-ops safely server-side, then re-runs for real once hydrated client-side.
  const [summary] = useState(() => {
    const subtopics = buildTrackableSubtopics();
    let done = 0;
    for (const { key, totalQuestions } of subtopics) {
      const progress = loadLocalProgress(key);
      const answered = progress ? Object.keys(progress.answers).length : 0;
      if (answered >= totalQuestions) done++;
    }
    return { done, total: subtopics.length };
  });

  return summary;
}
