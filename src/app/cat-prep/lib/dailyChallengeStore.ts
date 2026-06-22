// dailyChallengeStore — Daily Challenge-specific wrapper around the shared sectionedTestStore (key prefix "dc")
import type { DailyChallengeDraft, DailyChallengeResult } from "../models/dailyChallenge";
import * as store from "./sectionedTestStore";

const PREFIX = "dc";

export function saveResultLocally(date: string, result: DailyChallengeResult): void {
  store.saveResultLocally(PREFIX, date, result);
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
    date,
    `/api/daily-challenge-result?uid=${encodeURIComponent(uid)}&date=${encodeURIComponent(date)}`
  );
}

export function getDailyChallengeDraft(date: string): DailyChallengeDraft | null {
  return store.getDraft(PREFIX, date);
}

export function saveDailyChallengeDraft(date: string, draft: DailyChallengeDraft): void {
  store.saveDraft(PREFIX, date, draft);
}

export function clearDailyChallengeDraft(date: string): void {
  store.clearDraft(PREFIX, date);
}
