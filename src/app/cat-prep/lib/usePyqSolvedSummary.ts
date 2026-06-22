// usePyqSolvedSummary — counts PYQ questions solved (browse + mock, max per paper), against a flat target
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { PYQ_PAPERS } from "@/constants/pyqPapers";
import { loadLocalProgress } from "./practiceProgressStore";

// 20 official CAT questions is treated as sufficient hands-on exposure to the real format.
const PYQ_SOLVED_TARGET = 20;

export function usePyqSolvedSummary(enabled = true): { solved: number; target: number } {
  const [solved, setSolved] = useState(0);

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

      // max() per paper, not a plain sum, so attempting the same paper via both
      // browse and mock doesn't double-count the overlap.
      const total = PYQ_PAPERS.reduce((sum, paper) => {
        const browse = browseCounts[paper.slug] ?? 0;
        const mock = mockCounts[paper.slug] ?? 0;
        return sum + Math.max(browse, mock);
      }, 0);

      if (!cancelled) setSolved(total);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => compute(user?.uid ?? null));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [enabled]);

  return { solved, target: PYQ_SOLVED_TARGET };
}
