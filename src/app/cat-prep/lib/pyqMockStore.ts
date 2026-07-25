// pyqMockStore — PYQ mock-test wrapper around the shared sectionedTestStore (key prefix "pyq_mock")
import type { DailyChallengeDraft, DailyChallengeResult } from "../models/dailyChallenge";
import * as store from "./sectionedTestStore";

const PREFIX = "pyq_mock";

export function saveResultLocally(
  uid: string,
  paperSlug: string,
  result: DailyChallengeResult
): void {
  store.saveResultLocally(PREFIX, uid, paperSlug, result);
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
    uid,
    paperSlug,
    `/api/pyq/${encodeURIComponent(paperSlug)}/result?uid=${encodeURIComponent(uid)}`
  );
}

export function getPyqMockDraft(uid: string, paperSlug: string): DailyChallengeDraft | null {
  return store.getDraft(PREFIX, uid, paperSlug);
}

export function savePyqMockDraft(
  uid: string,
  paperSlug: string,
  draft: DailyChallengeDraft
): void {
  store.saveDraft(PREFIX, uid, paperSlug, draft);
}

export function clearPyqMockDraft(uid: string, paperSlug: string): void {
  store.clearDraft(PREFIX, uid, paperSlug);
}
