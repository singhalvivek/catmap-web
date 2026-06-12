// practiceProgressStore — localStorage + Firestore helpers for practice attempt persistence
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type PracticeProgress = {
  answers: Record<number, string>;        // qNum → selected option (A/B/C/D)
  correctAnswers: Record<number, string>; // qNum → correct letter (set after Check, not the full explanation)
};

export const PROGRESS_PREFIX = "sn_practice__";

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
