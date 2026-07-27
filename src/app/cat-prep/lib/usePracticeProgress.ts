// usePracticeProgress — cross-session persistence of practice attempt state (localStorage + Firestore)
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useIsHydrated } from "./useIsHydrated";
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
  // Three layers, merged during render, most recent winning: what is in localStorage,
  // what Firestore returned for this account, and what the user has done since mount.
  const [remote, setRemote] = useState<PracticeProgress>(EMPTY);
  const [edits, setEdits] = useState<PracticeProgress>(EMPTY);
  const uidRef = useRef(uid);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // localStorage is read during render but only once hydrated, never in an effect and
  // never in a useState initializer. The paper page is prerendered with every question
  // unanswered, so reading storage on the first client render would mismatch that HTML
  // for anyone returning to work they had already done; useIsHydrated is false for that
  // render and true for every one after it.
  const isHydrated = useIsHydrated();
  const stored = useMemo(
    () => (isHydrated ? loadLocalProgress(storageKey) ?? EMPTY : EMPTY),
    [isHydrated, storageKey]
  );
  const progress = merge(merge(stored, remote), edits);

  // Sync ref after every render so persist() always sees the latest uid without stale closure
  useEffect(() => { uidRef.current = uid; });

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
  }, []);

  // Merge Firestore data when uid becomes available
  useEffect(() => {
    if (!uid) return;
    loadFirestoreProgress(uid, storageKey).then((r) => {
      if (r) setRemote(r);
    });
  }, [storageKey, uid]);

  // Writes re-read storage and merge over it, so a second tab's answers survive and a
  // write can never replace a session it didn't know about.
  function persist(nextEdits: PracticeProgress) {
    const onDisk = loadLocalProgress(storageKey);
    const merged = merge(merge(onDisk ?? EMPTY, remote), nextEdits);
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
    setEdits((prev) => {
      const next = { ...prev, answers: { ...prev.answers, [qNum]: option } };
      persist(next);
      return next;
    });
  }

  function setCorrectAnswer(qNum: number, letter: string) {
    // Checking an already-checked question must not overwrite the recorded answer.
    if (progress.correctAnswers[qNum]) return;
    setEdits((prev) => {
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
