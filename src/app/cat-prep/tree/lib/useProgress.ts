import { useEffect, useState } from "react";
import { ProgressStatus } from "../models/progress";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

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

    const saved = localStorage.getItem(`progress_${user.uid}_${nodeId}`);
    if (saved) {
      setStatus(saved as ProgressStatus);
      return;
    }

    setStatus(ProgressStatus.NOT_STARTED);
  }, [nodeId, user]);

  function updateStatus(newStatus: ProgressStatus): boolean {
    if (!nodeId || !user) return false;

    localStorage.setItem(`progress_${user.uid}_${nodeId}`, newStatus);
    setStatus(newStatus);
    return true;
  }

  return { status, updateStatus, isLoggedIn: Boolean(user) };
}