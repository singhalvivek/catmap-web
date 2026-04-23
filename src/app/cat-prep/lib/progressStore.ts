// progressStore — Firestore helpers for user progress; all nodes stored in one document per user
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { FirestoreError } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProgressStatus } from "../models/progress";

const PROGRESS_DOC_ID = "cat-prep";

function isProgressStatus(value: unknown): value is ProgressStatus {
  return Object.values(ProgressStatus).includes(value as ProgressStatus);
}

function progressDocRef(uid: string) {
  return doc(db, "users", uid, "progress", PROGRESS_DOC_ID);
}

export async function getAllProgressStatuses(
  uid: string
): Promise<Record<number, ProgressStatus>> {
  const snapshot = await getDoc(progressDocRef(uid));
  if (!snapshot.exists()) return {};

  const nodeProgress: Record<string, unknown> =
    snapshot.data()?.nodeProgress ?? {};
  const result: Record<number, ProgressStatus> = {};

  for (const [key, value] of Object.entries(nodeProgress)) {
    const nodeId = Number(key);
    if (!Number.isNaN(nodeId) && isProgressStatus(value)) {
      result[nodeId] = value;
    }
  }

  return result;
}

export async function setProgressStatus(
  uid: string,
  nodeId: number,
  status: ProgressStatus
) {
  const ref = progressDocRef(uid);
  try {
    await updateDoc(ref, {
      [`nodeProgress.${nodeId}`]: status,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    if ((err as FirestoreError).code === "not-found") {
      await setDoc(ref, {
        nodeProgress: { [nodeId]: status },
        updatedAt: serverTimestamp(),
      });
    } else {
      throw err;
    }
  }
}
