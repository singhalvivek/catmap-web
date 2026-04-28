// dailyChallengeStore — Firestore helpers for reading and writing daily challenge results
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  DailyChallengeDraft,
  DailyChallengeResult,
  SectionResult,
  VisitStatus,
} from "../models/dailyChallenge";

function dailyChallengeDocRef(uid: string, date: string) {
  return doc(db, "users", uid, "dailyChallenges", date);
}

export async function getDailyChallengeResult(
  uid: string,
  date: string
): Promise<DailyChallengeResult | null> {
  const snapshot = await getDoc(dailyChallengeDocRef(uid, date));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  // completedAt may be null in local cache while serverTimestamp() is still pending — guard against it
  const raw = data.completedAt;
  const completedAt = raw instanceof Timestamp ? raw.toDate() : new Date();

  return {
    testId: data.testId as string,
    score: data.score as number,
    totalMarks: data.totalMarks as number,
    totalTimeSeconds: (data.totalTimeSeconds as number | undefined) ?? 0,
    completedAt,
    sections: data.sections as SectionResult[],
  };
}

// --- Draft helpers (in-progress test state for resume) ---

function draftDocRef(uid: string, date: string) {
  return doc(db, "users", uid, "dailyChallengeDrafts", date);
}

export async function getDailyChallengeDraft(
  uid: string,
  date: string
): Promise<DailyChallengeDraft | null> {
  const snapshot = await getDoc(draftDocRef(uid, date));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    testId: data.testId as string,
    sectionIndex: data.sectionIndex as number,
    questionIndex: data.questionIndex as number,
    sectionTimeLeft: data.sectionTimeLeft as number,
    responses: data.responses as Record<string, number | null>,
    visitStatus: data.visitStatus as Record<string, VisitStatus>,
  };
}

export async function saveDailyChallengeDraft(
  uid: string,
  date: string,
  draft: DailyChallengeDraft
): Promise<void> {
  await setDoc(draftDocRef(uid, date), draft);
}

export async function clearDailyChallengeDraft(uid: string, date: string): Promise<void> {
  await deleteDoc(draftDocRef(uid, date));
}

// --- Result helpers ---

export async function saveDailyChallengeResult(
  uid: string,
  date: string,
  result: DailyChallengeResult
): Promise<void> {
  await setDoc(dailyChallengeDocRef(uid, date), {
    testId: result.testId,
    score: result.score,
    totalMarks: result.totalMarks,
    totalTimeSeconds: result.totalTimeSeconds,
    completedAt: serverTimestamp(),
    sections: result.sections,
  });
}
