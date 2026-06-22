// sectionedTestStore — generic localStorage helpers for any timed sectioned-test feature (drafts + results), with an API fallback for cross-device result lookup
import type {
  DailyChallengeDraft,
  DailyChallengeResult,
  SerializedDailyChallengeResult,
} from "../models/dailyChallenge";

const draftKey = (keyPrefix: string, id: string) => `${keyPrefix}_draft_${id}`;
const resultKey = (keyPrefix: string, id: string) => `${keyPrefix}_result_${id}`;

// ---- Result helpers ----

export function saveResultLocally(keyPrefix: string, id: string, result: DailyChallengeResult): void {
  try {
    localStorage.setItem(
      resultKey(keyPrefix, id),
      JSON.stringify({ ...result, completedAt: result.completedAt.toISOString() })
    );
  } catch {
    // localStorage unavailable (e.g. private browsing quota exceeded) — silently skip
  }
}

function readLocalResult(keyPrefix: string, id: string): DailyChallengeResult | null {
  try {
    const raw = localStorage.getItem(resultKey(keyPrefix, id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SerializedDailyChallengeResult;
    return { ...parsed, completedAt: new Date(parsed.completedAt) };
  } catch {
    return null;
  }
}

/**
 * Returns the stored result for a given test id. Checks localStorage first;
 * falls back to `fetchUrl` (a fully-built API URL) for cross-device scenarios.
 */
export async function getStoredResult(
  keyPrefix: string,
  id: string,
  fetchUrl: string
): Promise<DailyChallengeResult | null> {
  const local = readLocalResult(keyPrefix, id);
  if (local) return local;

  try {
    const res = await fetch(fetchUrl);
    if (!res.ok) return null;
    const data = (await res.json()) as SerializedDailyChallengeResult | null;
    if (!data) return null;
    const result: DailyChallengeResult = {
      ...data,
      completedAt: new Date(data.completedAt),
    };
    // Cache in localStorage for future page loads on this device
    saveResultLocally(keyPrefix, id, result);
    return result;
  } catch {
    return null;
  }
}

// ---- Draft helpers ----

export function getDraft(keyPrefix: string, id: string): DailyChallengeDraft | null {
  try {
    const raw = localStorage.getItem(draftKey(keyPrefix, id));
    if (!raw) return null;
    return JSON.parse(raw) as DailyChallengeDraft;
  } catch {
    return null;
  }
}

export function saveDraft(keyPrefix: string, id: string, draft: DailyChallengeDraft): void {
  try {
    localStorage.setItem(draftKey(keyPrefix, id), JSON.stringify(draft));
  } catch {
    // silently skip
  }
}

export function clearDraft(keyPrefix: string, id: string): void {
  try {
    localStorage.removeItem(draftKey(keyPrefix, id));
  } catch {
    // silently skip
  }
}
