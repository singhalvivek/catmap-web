import { useEffect, useState } from "react";
import { ProgressStatus } from "../models/progress";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getProgressStatus, setProgressStatus } from "./progressStore";

export function useProgress(nodeId: number | null) {
  const [status, setStatus] = useState<ProgressStatus>(
    ProgressStatus.NOT_STARTED
  );
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!nodeId) return;

    if (!user) {
      setStatus(ProgressStatus.NOT_STARTED);
      return;
    }

    let alive = true;

    const load = async () => {
      try {
        const remoteStatus = await getProgressStatus(user.uid, nodeId);

        if (!alive) return;

        setStatus(remoteStatus);
        localStorage.setItem(`progress_${user.uid}_${nodeId}`, remoteStatus);
      } catch (error) {
        console.error("Failed to load progress from Firestore", error);

        if (!alive) return;

        const saved = localStorage.getItem(`progress_${user.uid}_${nodeId}`);
        if (saved) {
          setStatus(saved as ProgressStatus);
          return;
        }

        setStatus(ProgressStatus.NOT_STARTED);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [nodeId, user]);

  async function updateStatus(newStatus: ProgressStatus): Promise<boolean> {
    if (!nodeId || !user) return false;

    try {
      await setProgressStatus(user.uid, nodeId, newStatus);
      localStorage.setItem(`progress_${user.uid}_${nodeId}`, newStatus);
      setStatus(newStatus);
      return true;
    } catch (error) {
      console.error("Failed to save progress to Firestore", error);
      return false;
    }
  }

  return { status, updateStatus, isLoggedIn: Boolean(user) };
}