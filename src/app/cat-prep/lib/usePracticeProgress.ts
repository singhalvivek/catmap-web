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

const EMPTY: PracticeProgress = { answers: {}, correctAnswers: {} };

// Newer answers win over older ones; nothing here ever deletes an answer.
function merge(base: PracticeProgress, incoming: PracticeProgress): PracticeProgress {
  return {
    answers: { ...base.answers, ...incoming.answers },
    correctAnswers: { ...base.correctAnswers, ...incoming.correctAnswers },
  };
}

export function usePracticeProgress(storageKey: string) {
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [progress, setProgress] = useState<PracticeProgress>(EMPTY);
  const uidRef = useRef(uid);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync ref after every render so persist() always sees the latest uid without stale closure
  useEffect(() => { uidRef.current = uid; });

  // localStorage is read after mount rather than in a useState initializer. The PYQ
  // paper page is prerendered with every question unanswered, so seeding state from
  // storage during the first client render would mismatch that HTML for anyone
  // returning to a paper they have already worked on.
  useEffect(() => {
    const local = loadLocalProgress(storageKey);
    if (local) setProgress((prev) => merge(local, prev));
  }, [storageKey]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
  }, []);

  // Merge Firestore data when uid becomes available
  useEffect(() => {
    if (!uid) return;
    loadFirestoreProgress(uid, storageKey).then((remote) => {
      if (remote) setProgress((prev) => merge(prev, remote));
    });
  }, [storageKey, uid]);

  // Writes merge over whatever is already stored, so an answer given in the moment
  // before the load effect runs cannot wipe an earlier session.
  function persist(next: PracticeProgress) {
    const stored = loadLocalProgress(storageKey);
    const merged = stored ? merge(stored, next) : next;
    saveLocalProgress(storageKey, merged);

    const currentUid = uidRef.current;
    if (currentUid) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveFirestoreProgress(currentUid, storageKey, merged);
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
