// useDailyChallengeTest — manages timers, navigation, and answer state for a test session
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DailyChallengeDraft,
  DailyTest,
  VisitStatus,
} from "../../models/dailyChallenge";

export type TestHook = ReturnType<typeof useDailyChallengeTest>;

export function useDailyChallengeTest(test: DailyTest, draft?: DailyChallengeDraft) {
  // Clamp draft indices so stale drafts don't crash if the test structure changed
  const initSectionIndex = Math.min(
    draft?.sectionIndex ?? 0,
    Math.max(0, test.sections.length - 1)
  );
  const initSection = test.sections[initSectionIndex];
  const initQuestionIndex = Math.min(
    draft?.questionIndex ?? 0,
    Math.max(0, (initSection?.questions.length ?? 1) - 1)
  );

  const [sectionIndex, setSectionIndex] = useState(initSectionIndex);
  const [questionIndex, setQuestionIndex] = useState(initQuestionIndex);
  const [sectionTimeLeft, setSectionTimeLeft] = useState(
    draft?.sectionTimeLeft ?? (test.sections[0]?.timeLimitSeconds ?? 0)
  );
  // Per-question timer is not persisted — starts fresh on resume
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number | null>(
    () => initSection?.questions[initQuestionIndex]?.timeLimitSeconds ?? null
  );
  const [visitStatus, setVisitStatus] = useState<Record<string, VisitStatus>>(
    draft?.visitStatus ?? {}
  );
  const [responses, setResponses] = useState<Record<string, number | null>>(
    draft?.responses ?? {}
  );
  const [isComplete, setIsComplete] = useState(false);

  const section = test.sections[sectionIndex];
  const question = section?.questions[questionIndex] ?? null;

  // Stable derived values used as effect deps to avoid optional-chaining in dep arrays
  const questionId = question?.questionId;
  const questionTimeLimit = question?.timeLimitSeconds ?? null;

  const responsesRef = useRef<Record<string, number | null>>({});
  // Keep ref in sync after each render so callbacks always see the latest responses
  useEffect(() => { responsesRef.current = responses; });

  const testStartTimeRef = useRef(0);
  const questionEnterTimeRef = useRef(0);
  const activeQuestionIdRef = useRef<string | undefined>(undefined);
  const timeSpentRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const now = Date.now();
    testStartTimeRef.current = now;
    questionEnterTimeRef.current = now;
  }, []);

  // Reset question timer and mark as visited when the active question changes
  const [prevQId, setPrevQId] = useState(questionId);
  if (prevQId !== questionId) {
    setPrevQId(questionId);
    setQuestionTimeLeft(questionTimeLimit);
    if (questionId) {
      setVisitStatus((prev) => {
        if (prev[questionId] === "answered" || prev[questionId] === "marked_for_review")
          return prev;
        return { ...prev, [questionId]: "visited" };
      });
    }
  }

  // Auto-advance section when its countdown reaches zero
  const [prevSectionTimeLeft, setPrevSectionTimeLeft] = useState(sectionTimeLeft);
  if (prevSectionTimeLeft !== sectionTimeLeft) {
    setPrevSectionTimeLeft(sectionTimeLeft);
    if (!isComplete && sectionTimeLeft === 0) {
      if (sectionIndex >= test.sections.length - 1) {
        setIsComplete(true);
      } else {
        const next = sectionIndex + 1;
        const nextSection = test.sections[next];
        setSectionIndex(next);
        setQuestionIndex(0);
        setSectionTimeLeft(nextSection.timeLimitSeconds);
        setQuestionTimeLeft(nextSection.questions[0]?.timeLimitSeconds ?? null);
      }
    }
  }

  // Auto-advance question when its per-question timer reaches zero
  const [prevQTimeLeft, setPrevQTimeLeft] = useState(questionTimeLeft);
  if (prevQTimeLeft !== questionTimeLeft) {
    setPrevQTimeLeft(questionTimeLeft);
    if (questionTimeLeft === 0 && !isComplete) {
      const next = questionIndex + 1;
      if (next < (section?.questions.length ?? 0)) {
        setQuestionIndex(next);
      }
    }
  }

  // Update timing refs when question changes — ref mutations only, no setState
  useEffect(() => {
    const prev = activeQuestionIdRef.current;
    if (prev) {
      const elapsed = Math.round((Date.now() - questionEnterTimeRef.current) / 1000);
      timeSpentRef.current[prev] = (timeSpentRef.current[prev] ?? 0) + elapsed;
    }
    activeQuestionIdRef.current = questionId;
    questionEnterTimeRef.current = Date.now();
  }, [questionId]);

  // Section countdown — restarts when section changes
  useEffect(() => {
    if (isComplete) return;
    const id = setInterval(() => {
      setSectionTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [sectionIndex, isComplete]);

  // Per-question override timer — initial reset is handled above; only manages the interval
  useEffect(() => {
    if (questionTimeLimit === null || isComplete) return;
    const id = setInterval(() => {
      setQuestionTimeLeft((t) => (t !== null ? Math.max(0, t - 1) : null));
    }, 1000);
    return () => clearInterval(id);
  }, [questionId, questionTimeLimit, isComplete]);

  const goToQuestion = useCallback(
    (idx: number) => {
      if (!section || idx < 0 || idx >= section.questions.length) return;
      setQuestionIndex(idx);
    },
    [section]
  );

  const setMCQAnswer = useCallback((questionId: string, optionIndex: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: optionIndex }));
    setVisitStatus((prev) => ({ ...prev, [questionId]: "answered" }));
  }, []);

  const setTITAAnswer = useCallback((questionId: string, value: number | null) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setVisitStatus((prev) => ({
      ...prev,
      [questionId]: value !== null ? "answered" : "visited",
    }));
  }, []);

  const toggleMarkForReview = useCallback((questionId: string) => {
    setVisitStatus((prev) => {
      if (prev[questionId] === "marked_for_review") {
        const hasAnswer =
          responsesRef.current[questionId] !== null &&
          responsesRef.current[questionId] !== undefined;
        return { ...prev, [questionId]: hasAnswer ? "answered" : "visited" };
      }
      return { ...prev, [questionId]: "marked_for_review" };
    });
  }, []);

  const submitChallenge = useCallback(() => {
    setIsComplete(true);
  }, []);

  const goToNextSection = useCallback(() => {
    const next = sectionIndex + 1;
    if (next >= test.sections.length) return;
    const nextSection = test.sections[next];
    setSectionIndex(next);
    setQuestionIndex(0);
    setSectionTimeLeft(nextSection.timeLimitSeconds);
    setQuestionTimeLeft(nextSection.questions[0]?.timeLimitSeconds ?? null);
  }, [sectionIndex, test.sections]);

  /**
   * Snapshot current timing data for submission.
   * Flushes time for the active question before returning — call only once on submit.
   */
  const collectTimingSnapshot = useCallback((): {
    timings: Record<string, number>;
    totalTimeSeconds: number;
  } => {
    const activeId = activeQuestionIdRef.current;
    if (activeId) {
      const elapsed = Math.round((Date.now() - questionEnterTimeRef.current) / 1000);
      timeSpentRef.current[activeId] = (timeSpentRef.current[activeId] ?? 0) + elapsed;
      questionEnterTimeRef.current = Date.now(); // prevent double-counting if called again
    }
    return {
      timings: { ...timeSpentRef.current },
      totalTimeSeconds: Math.round((Date.now() - testStartTimeRef.current) / 1000),
    };
  }, []);

  return {
    section,
    question,
    sectionIndex,
    questionIndex,
    sectionTimeLeft,
    questionTimeLeft,
    visitStatus,
    responses,
    isComplete,
    goToQuestion,
    goToNextSection,
    setMCQAnswer,
    setTITAAnswer,
    toggleMarkForReview,
    submitChallenge,
    collectTimingSnapshot,
  };
}
