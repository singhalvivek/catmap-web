// usePracticeMasterySummary — the practice rollup, subscribed to as the external store it is
"use client";

import { useSyncExternalStore } from "react";
import { subscribePracticeProgress } from "./practiceProgressStore";
import {
  buildPracticeSummary,
  EMPTY_PRACTICE_SUMMARY,
  type PracticeSummary,
} from "./practiceProgressSummary";

/*
 * Attempts live in localStorage, which is an external store, so this is read through
 * useSyncExternalStore rather than a useState initializer. The initializer ran during the
 * hydration render — the server had said zero and the first client render said something
 * else, which is the mismatch usePracticeProgress already gates against — and it never ran
 * again, so the figures went stale the moment anything was answered.
 *
 * The snapshot is cached because getSnapshot must return a stable reference; writing an
 * attempt clears it.
 */
let snapshot: PracticeSummary | null = null;

function getSnapshot(): PracticeSummary {
  if (snapshot === null) snapshot = buildPracticeSummary();
  return snapshot;
}

function getServerSnapshot(): PracticeSummary {
  return EMPTY_PRACTICE_SUMMARY;
}

function subscribe(onChange: () => void): () => void {
  const invalidate = () => {
    snapshot = null;
    onChange();
  };
  const unsubscribe = subscribePracticeProgress(invalidate);
  // Another tab practising counts too.
  window.addEventListener("storage", invalidate);
  return () => {
    unsubscribe();
    window.removeEventListener("storage", invalidate);
  };
}

export function usePracticeMasterySummary(): PracticeSummary {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
