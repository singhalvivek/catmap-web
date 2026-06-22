// pyqMockStore — PYQ mock-test wrapper around the shared sectionedTestStore (key prefix "pyq_mock")
import type { DailyChallengeDraft, DailyChallengeResult } from "../models/dailyChallenge";
import * as store from "./sectionedTestStore";

const PREFIX = "pyq_mock";

export function saveResultLocally(paperSlug: string, result: DailyChallengeResult): void {
  store.saveResultLocally(PREFIX, paperSlug, result);
}

/**
 * Returns the stored result for a paper's mock attempt.
 * Checks localStorage first; falls back to the API for cross-device scenarios.
 */
export async function getPyqMockResult(
  uid: string,
  paperSlug: string
): Promise<DailyChallengeResult | null> {
  return store.getStoredResult(
    PREFIX,
    paperSlug,
    `/api/pyq/${encodeURIComponent(paperSlug)}/result?uid=${encodeURIComponent(uid)}`
  );
}

export function getPyqMockDraft(paperSlug: string): DailyChallengeDraft | null {
  return store.getDraft(PREFIX, paperSlug);
}

export function savePyqMockDraft(paperSlug: string, draft: DailyChallengeDraft): void {
  store.saveDraft(PREFIX, paperSlug, draft);
}

export function clearPyqMockDraft(paperSlug: string): void {
  store.clearDraft(PREFIX, paperSlug);
}
