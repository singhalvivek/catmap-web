import { useEffect, useState } from "react";
import { ProgressStatus } from "../models/progress";

export function useProgress(nodeId: number | null) {
  const [status, setStatus] = useState<ProgressStatus>(
    ProgressStatus.NOT_STARTED
  );

  useEffect(() => {
    if (!nodeId) return;

    const saved = localStorage.getItem(`progress_${nodeId}`);
    if (saved) {
      setStatus(saved as ProgressStatus);
    }
  }, [nodeId]);

  function updateStatus(newStatus: ProgressStatus) {
    if (!nodeId) return;

    localStorage.setItem(`progress_${nodeId}`, newStatus);
    setStatus(newStatus);
  }

  return { status, updateStatus };
}