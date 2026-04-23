"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ProgressStatus } from "../models/progress";
import { getAllProgressStatuses, setProgressStatus } from "./progressStore";

type ProgressMap = Record<number, ProgressStatus>;

type ProgressContextValue = {
  progress: ProgressMap;
  updateProgress: (nodeId: number, status: ProgressStatus) => Promise<boolean>;
  isLoggedIn: boolean;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setProgress({});
        return;
      }

      try {
        const allProgress = await getAllProgressStatuses(nextUser.uid);
        setProgress(allProgress);
      } catch (error) {
        console.error("Failed to sync progress from Firestore", error);
      }
    });

    return () => unsubscribe();
  }, []);

  async function updateProgress(
    nodeId: number,
    status: ProgressStatus
  ): Promise<boolean> {
    if (!user) return false;

    try {
      await setProgressStatus(user.uid, nodeId, status);
      setProgress((prev) => ({ ...prev, [nodeId]: status }));
      return true;
    } catch (error) {
      console.error("Failed to save progress to Firestore", error);
      return false;
    }
  }

  return (
    <ProgressContext.Provider
      value={{ progress, updateProgress, isLoggedIn: Boolean(user) }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgressContext must be used within ProgressProvider");
  return ctx;
}
