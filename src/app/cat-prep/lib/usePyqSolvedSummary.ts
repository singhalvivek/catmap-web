// usePyqSolvedSummary — PYQ questions solved (browse + mock, max per paper), per paper and in total
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { PYQ_PAPERS } from "@/constants/pyqPapers";
import { loadLocalProgress } from "./practiceProgressStore";

// 20 official CAT questions is treated as sufficient hands-on exposure to the real format.
const PYQ_SOLVED_TARGET = 20;

export type PyqSolvedSummary = {
  solved: number;
  target: number;
  /** Questions answered per paper slug. The index renders this; it used to be discarded. */
  byPaper: Record<string, number>;
};

const EMPTY: PyqSolvedSummary = { solved: 0, target: PYQ_SOLVED_TARGET, byPaper: {} };

export function usePyqSolvedSummary(enabled = true): PyqSolvedSummary {
  const [summary, setSummary] = useState<PyqSolvedSummary>(EMPTY);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function compute(uid: string | null) {
      const browseCounts: Record<string, number> = {};
      for (const paper of PYQ_PAPERS) {
        const progress = loadLocalProgress(paper.slug);
        browseCounts[paper.slug] = progress ? Object.keys(progress.answers).length : 0;
      }

      let mockCounts: Record<string, number> = {};
      if (uid) {
        try {
          const res = await fetch(`/api/pyq/progress?uid=${encodeURIComponent(uid)}`);
          if (res.ok) mockCounts = await res.json();
        } catch {
          // network/API failure — fall back to the browse-only count
        }
      }

      /*
       * max() per paper, not a plain sum, so attempting the same paper via both browse and
       * mock does not double-count the overlap. The per-paper figures are kept now rather
       * than collapsed: the index was computing "have I started this paper" for all 39 and
       * then throwing it away, while every row showed nothing at all.
       */
      const byPaper: Record<string, number> = {};
      let total = 0;
      for (const paper of PYQ_PAPERS) {
        const count = Math.max(browseCounts[paper.slug] ?? 0, mockCounts[paper.slug] ?? 0);
        byPaper[paper.slug] = count;
        total += count;
      }

      if (!cancelled) setSummary({ solved: total, target: PYQ_SOLVED_TARGET, byPaper });
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => compute(user?.uid ?? null));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [enabled]);

  return summary;
}
