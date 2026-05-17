// dailyChallengeStore — localStorage helpers for daily challenge drafts and results; API fallback for cross-device result lookup
import type {
  DailyChallengeDraft,
  DailyChallengeResult,
  SerializedDailyChallengeResult,
} from "../models/dailyChallenge";

const DRAFT_KEY = (date: string) => `dc_draft_${date}`;
const RESULT_KEY = (date: string) => `dc_result_${date}`;

// ---- Result helpers ----

export function saveResultLocally(date: string, result: DailyChallengeResult): void {
  try {
    localStorage.setItem(
      RESULT_KEY(date),
      JSON.stringify({ ...result, completedAt: result.completedAt.toISOString() })
    );
  } catch {
    // localStorage unavailable (e.g. private browsing quota exceeded) — silently skip
  }
}

function readLocalResult(date: string): DailyChallengeResult | null {
  try {
    const raw = localStorage.getItem(RESULT_KEY(date));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SerializedDailyChallengeResult;
    return { ...parsed, completedAt: new Date(parsed.completedAt) };
  } catch {
    return null;
  }
}

/**
 * Returns the stored result for today's quiz.
 * Checks localStorage first; falls back to the API for cross-device scenarios.
 */
export async function getDailyChallengeResult(
  uid: string,
  date: string
): Promise<DailyChallengeResult | null> {
  const local = readLocalResult(date);
  if (local) return local;

  try {
    const res = await fetch(
      `/api/daily-challenge-result?uid=${encodeURIComponent(uid)}&date=${encodeURIComponent(date)}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as SerializedDailyChallengeResult | null;
    if (!data) return null;
    const result: DailyChallengeResult = {
      ...data,
      completedAt: new Date(data.completedAt),
    };
    // Cache in localStorage for future page loads on this device
    saveResultLocally(date, result);
    return result;
  } catch {
    return null;
  }
}

// ---- Draft helpers ----

export function getDailyChallengeDraft(date: string): DailyChallengeDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY(date));
    if (!raw) return null;
    return JSON.parse(raw) as DailyChallengeDraft;
  } catch {
    return null;
  }
}

export function saveDailyChallengeDraft(date: string, draft: DailyChallengeDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY(date), JSON.stringify(draft));
  } catch {
    // silently skip
  }
}

export function clearDailyChallengeDraft(date: string): void {
  try {
    localStorage.removeItem(DRAFT_KEY(date));
  } catch {
    // silently skip
  }
}
