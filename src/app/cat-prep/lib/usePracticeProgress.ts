// usePracticeProgress — cross-session persistence of practice attempt state (localStorage + Firestore)
"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  loadLocalProgress,
  saveLocalProgress,
  loadFirestoreProgress,
  saveFirestoreProgress,
  type PracticeProgress,
} from "./practiceProgressStore";

export function usePracticeProgress(storageKey: string) {
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [progress, setProgress] = useState<PracticeProgress>({ answers: {}, correctAnswers: {} });
  const uidRef = useRef(uid);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep ref in sync so persist() always sees latest uid
  uidRef.current = uid;

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
  }, []);

  // Load on mount; re-load when uid becomes available (Firestore merge)
  useEffect(() => {
    const local = loadLocalProgress(storageKey);
    if (local) setProgress(local);

    if (uid) {
      loadFirestoreProgress(uid, storageKey).then((remote) => {
        if (remote) {
          setProgress((prev) => ({
            answers: { ...prev.answers, ...remote.answers },
            correctAnswers: { ...prev.correctAnswers, ...remote.correctAnswers },
          }));
        }
      });
    }
  }, [storageKey, uid]);

  function persist(next: PracticeProgress) {
    saveLocalProgress(storageKey, next);
    const currentUid = uidRef.current;
    if (currentUid) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveFirestoreProgress(currentUid, storageKey, next);
      }, 500);
    }
  }

  function setAnswer(qNum: number, option: string) {
    setProgress((prev) => {
      const next = { ...prev, answers: { ...prev.answers, [qNum]: option } };
      persist(next);
      return next;
    });
  }

  function setCorrectAnswer(qNum: number, letter: string) {
    setProgress((prev) => {
      if (prev.correctAnswers[qNum]) return prev;
      const next = { ...prev, correctAnswers: { ...prev.correctAnswers, [qNum]: letter } };
      persist(next);
      return next;
    });
  }

  return {
    answers: progress.answers,
    correctAnswers: progress.correctAnswers,
    setAnswer,
    setCorrectAnswer,
  };
}
