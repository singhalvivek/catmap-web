"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ProgressStatus } from "../models/progress";

type ProgressMap = Record<number, ProgressStatus>;

const ProgressContext = createContext<{
  progress: ProgressMap;
  updateProgress: (id: number, status: ProgressStatus) => void;
  }>({
  progress: {},
  updateProgress: () => {},
  });

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const stored: ProgressMap = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("progress_")) {
        const id = Number(key.replace("progress_", ""));
        const value = localStorage.getItem(key) as ProgressStatus;
        stored[id] = value;
      }
    }

    setProgress(stored);
  }, []);

  function updateProgress(id: number, status: ProgressStatus) {
    localStorage.setItem(`progress_${id}`, status);

    setProgress((prev) => ({
      ...prev,
      [id]: status,
    }));
  }

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext() {
  return useContext(ProgressContext);
}