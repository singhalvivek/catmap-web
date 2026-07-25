// dailyChallengeStore — Daily Challenge-specific wrapper around the shared sectionedTestStore (key prefix "dc")
import type { DailyChallengeDraft, DailyChallengeResult } from "../models/dailyChallenge";
import * as store from "./sectionedTestStore";

const PREFIX = "dc";

export function saveResultLocally(uid: string, date: string, result: DailyChallengeResult): void {
  store.saveResultLocally(PREFIX, uid, date, result);
}

/**
 * Returns the stored result for today's quiz.
 * Checks localStorage first; falls back to the API for cross-device scenarios.
 */
export async function getDailyChallengeResult(
  uid: string,
  date: string
): Promise<DailyChallengeResult | null> {
  return store.getStoredResult(
    PREFIX,
    uid,
    date,
    `/api/daily-challenge-result?uid=${encodeURIComponent(uid)}&date=${encodeURIComponent(date)}`
  );
}

export function getDailyChallengeDraft(uid: string, date: string): DailyChallengeDraft | null {
  return store.getDraft(PREFIX, uid, date);
}

export function saveDailyChallengeDraft(
  uid: string,
  date: string,
  draft: DailyChallengeDraft
): void {
  store.saveDraft(PREFIX, uid, date, draft);
}

export function clearDailyChallengeDraft(uid: string, date: string): void {
  store.clearDraft(PREFIX, uid, date);
}
