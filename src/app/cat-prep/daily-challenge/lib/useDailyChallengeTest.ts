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

  // Ref keeps responses readable inside useCallback without adding it to deps
  const responsesRef = useRef<Record<string, number | null>>({});
  responsesRef.current = responses;

  // Time tracking refs — no state needed since these don't drive re-renders
  const testStartTimeRef = useRef<number>(Date.now());
  const questionEnterTimeRef = useRef<number>(Date.now());
  const activeQuestionIdRef = useRef<string | undefined>(undefined);
  const timeSpentRef = useRef<Record<string, number>>({});

  // Mark the current question as visited whenever it changes; also record time on the previous question
  useEffect(() => {
    const prev = activeQuestionIdRef.current;
    if (prev) {
      const elapsed = Math.round((Date.now() - questionEnterTimeRef.current) / 1000);
      timeSpentRef.current[prev] = (timeSpentRef.current[prev] ?? 0) + elapsed;
    }
    activeQuestionIdRef.current = questionId;
    questionEnterTimeRef.current = Date.now();

    if (!questionId) return;
    setVisitStatus((prev) => {
      if (prev[questionId] === "answered" || prev[questionId] === "marked_for_review")
        return prev;
      return { ...prev, [questionId]: "visited" };
    });
  }, [questionId]);

  // Section countdown — restarts when section changes
  useEffect(() => {
    if (isComplete) return;
    const id = setInterval(() => {
      setSectionTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [sectionIndex, isComplete]);

  // Auto-advance section when its timer reaches zero
  useEffect(() => {
    if (isComplete || sectionTimeLeft > 0) return;
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
  }, [sectionTimeLeft, sectionIndex, isComplete, test.sections]);

  // Per-question override timer — resets whenever the active question changes
  useEffect(() => {
    setQuestionTimeLeft(questionTimeLimit);
    if (questionTimeLimit === null || isComplete) return;
    const id = setInterval(() => {
      setQuestionTimeLeft((t) => (t !== null ? Math.max(0, t - 1) : null));
    }, 1000);
    return () => clearInterval(id);
  }, [questionId, questionTimeLimit, isComplete]);

  // Auto-advance question when its per-question timer reaches zero
  useEffect(() => {
    if (questionTimeLeft === null || questionTimeLeft > 0 || isComplete) return;
    const next = questionIndex + 1;
    if (next < section.questions.length) {
      setQuestionIndex(next);
    }
    // If last question in section, the section timer drives the advance
  }, [questionTimeLeft, questionIndex, isComplete, section?.questions.length]);

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
