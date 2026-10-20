// practiceProgressStore — localStorage + Firestore helpers for practice attempt persistence
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type PracticeProgress = {
  answers: Record<number, string>;        // qNum → selected option (A/B/C/D)
  correctAnswers: Record<number, string>; // qNum → correct letter (set after Check, not the full explanation)
};

export const PROGRESS_PREFIX = "sn_practice__";

/*
 * Anything summarising attempts has to know when one is written. Without this the rollup
 * was computed once per mount and never again, so answering a chapter and navigating back
 * to the index showed the figures from before you started.
 */
const listeners = new Set<() => void>();

/*
 * Bumped on every write. Readers cache a rollup, and the cache used to be cleared only by a
 * live listener — but no summariser is mounted on a player route, so answering questions
 * notified an empty set and the index came back showing the figures from before. A version
 * the reader can compare against does not depend on anyone being subscribed at the time.
 */
let version = 0;

export function practiceProgressVersion(): number {
  return version;
}

export function subscribePracticeProgress(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function notifyPracticeProgress(): void {
  version += 1;
  for (const listener of listeners) listener();
}

// ---- localStorage ----

export function loadLocalProgress(storageKey: string): PracticeProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_PREFIX + storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      answers: (parsed.answers as Record<number, string>) ?? {},
      correctAnswers: (parsed.correctAnswers as Record<number, string>) ?? {},
    };
  } catch {
    return null;
  }
}

export function saveLocalProgress(storageKey: string, data: PracticeProgress): void {
  try {
    localStorage.setItem(PROGRESS_PREFIX + storageKey, JSON.stringify(data));
  } catch {
    // storage quota exceeded — ignore
  }
  notifyPracticeProgress();
}

// ---- Firestore ----

function practiceDocRef(uid: string, storageKey: string) {
  return doc(db, "users", uid, "practiceProgress", storageKey);
}

export async function loadFirestoreProgress(
  uid: string,
  storageKey: string
): Promise<PracticeProgress | null> {
  try {
    const snapshot = await getDoc(practiceDocRef(uid, storageKey));
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      answers: (data.answers as Record<number, string>) ?? {},
      correctAnswers: (data.correctAnswers as Record<number, string>) ?? {},
    };
  } catch {
    return null;
  }
}

export async function saveFirestoreProgress(
  uid: string,
  storageKey: string,
  data: PracticeProgress
): Promise<void> {
  try {
    await setDoc(
      practiceDocRef(uid, storageKey),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch {
    // fail silently — localStorage is the primary store
  }
}
