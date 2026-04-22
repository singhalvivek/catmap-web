import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProgressStatus } from "../models/progress";

function isProgressStatus(value: unknown): value is ProgressStatus {
  return Object.values(ProgressStatus).includes(value as ProgressStatus);
}

function progressDocRef(uid: string, nodeId: number) {
  return doc(db, "users", uid, "progress", String(nodeId));
}

export async function getProgressStatus(
  uid: string,
  nodeId: number
): Promise<ProgressStatus> {
  const snapshot = await getDoc(progressDocRef(uid, nodeId));

  if (!snapshot.exists()) {
    return ProgressStatus.NOT_STARTED;
  }

  const value = snapshot.data()?.status;
  return isProgressStatus(value) ? value : ProgressStatus.NOT_STARTED;
}

export async function setProgressStatus(
  uid: string,
  nodeId: number,
  status: ProgressStatus
) {
  await setDoc(
    progressDocRef(uid, nodeId),
    {
      nodeId,
      status,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getAllProgressStatuses(uid: string) {
  const snapshot = await getDocs(collection(db, "users", uid, "progress"));
  const progressByNodeId: Record<number, ProgressStatus> = {};

  snapshot.forEach((entry) => {
    const nodeId = Number(entry.id);
    const value = entry.data()?.status;

    if (!Number.isNaN(nodeId) && isProgressStatus(value)) {
      progressByNodeId[nodeId] = value;
    }
  });

  return progressByNodeId;
}
