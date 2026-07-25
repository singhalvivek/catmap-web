// PyqMockPageClient — auth gate; checks for prior attempt, then renders PyqMockTestView or ResultView
"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { DailyChallengeDraft, DailyTest, DailyChallengeResult } from "@/app/cat-prep/models/dailyChallenge";
import {
  getPyqMockResult,
  getPyqMockDraft,
  clearPyqMockDraft,
} from "@/app/cat-prep/lib/pyqMockStore";
import PyqMockTestView from "./PyqMockTestView";
import ResultView from "@/app/cat-prep/daily-dose/challenge/components/ResultView";
import { trackEvent } from "@/app/components/analytics";

type Props = {
  test: DailyTest;
  paperSlug: string;
  paperLabel: string;
};

type PageStatus = "loading" | "unauthenticated" | "checking" | "ready" | "resume_prompt" | "completed";

export default function PyqMockPageClient({ test, paperSlug, paperLabel }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<PageStatus>("loading");
  const [priorResult, setPriorResult] = useState<DailyChallengeResult | null>(null);
  const [draft, setDraft] = useState<DailyChallengeDraft | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const landedFired = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setStatus("unauthenticated");
        if (!landedFired.current) {
          landedFired.current = true;
          trackEvent("pyq_mock_landed", { paper_slug: paperSlug, auth_state: "signed_out", resuming_draft: false });
        }
        return;
      }
      setStatus("checking");
      try {
        const result = await getPyqMockResult(nextUser.uid, paperSlug);
        if (result) {
          setPriorResult(result);
          setStatus("completed");
          if (!landedFired.current) {
            landedFired.current = true;
            trackEvent("pyq_mock_landed", { paper_slug: paperSlug, auth_state: "signed_in", resuming_draft: false });
          }
        } else {
          const existingDraft = getPyqMockDraft(nextUser.uid, paperSlug);
          if (existingDraft && existingDraft.testId === test.testId) {
            setDraft(existingDraft);
            setStatus("resume_prompt");
            if (!landedFired.current) {
              landedFired.current = true;
              trackEvent("pyq_mock_landed", { paper_slug: paperSlug, auth_state: "signed_in", resuming_draft: true });
            }
          } else {
            setStatus("ready");
            if (!landedFired.current) {
              landedFired.current = true;
              trackEvent("pyq_mock_landed", { paper_slug: paperSlug, auth_state: "signed_in", resuming_draft: false });
            }
          }
        }
      } catch (err) {
        console.error("[PyqMockPageClient] check failed:", err);
        setStatus("ready");
      }
    });
    return () => unsubscribe();
  }, [paperSlug, test.testId]);

  const handleLogin = async () => {
    setAuthError(null);
    trackEvent("signin_clicked", { trigger_location: "pyq_mock_gate" });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setAuthError("Could not sign in. Please try again.");
    }
  };

  const handleResume = () => {
    trackEvent("pyq_mock_resumed", {
      paper_slug: paperSlug,
      questions_answered: draft ? Object.keys(draft.responses ?? {}).length : 0,
    });
    setStatus("ready");
  };

  const handleFreshStart = () => {
    if (!user) return;
    clearPyqMockDraft(user.uid, paperSlug);
    setDraft(null);
    setStatus("ready");
  };

  if (status === "loading" || status === "checking") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFFDF8" }}
      >
        <p className="text-slate-500 text-sm">Loading…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFFDF8" }}
      >
        <div style={{ maxWidth: 360, textAlign: "center", padding: "32px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 22, marginBottom: 8 }}
          >
            Sign in to take the mock test
          </h2>
          <p className="text-slate-500" style={{ fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
            Your result is saved to your account so you can review it later. You get one attempt per paper.
          </p>
          <button
            type="button"
            onClick={handleLogin}
            className="font-bold text-white w-full"
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              background: "#1E3A5F",
              border: "none",
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Login with Google
          </button>
          {authError && (
            <p className="text-red-600 text-xs mt-3">{authError}</p>
          )}
        </div>
      </div>
    );
  }

  if (status === "completed" && priorResult) {
    return (
      <ResultView
        result={priorResult}
        test={test}
        saveError={false}
        is_returning={true}
        title={`${paperLabel} · Mock Results`}
        backHref="/cat-prep/pyq"
        backLabel="← Back to PYQs"
        analyticsEvent="pyq_mock_result_viewed"
        reviewHref={`/cat-prep/pyq/${paperSlug}/mock/review`}
      />
    );
  }

  if (status === "resume_prompt" && draft) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFFDF8" }}
      >
        <div style={{ maxWidth: 400, width: "100%", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>📝</div>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 22, marginBottom: 8 }}
          >
            Resume your mock attempt?
          </h2>
          <p className="text-slate-500" style={{ fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
            You have an unfinished attempt on this paper. Pick up where you left off, or start
            fresh from the beginning.
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleResume}
              className="font-bold text-white w-full"
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                background: "#1E3A5F",
                border: "none",
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Continue where I left off →
            </button>
            <button
              type="button"
              onClick={handleFreshStart}
              className="font-semibold w-full"
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                background: "#F1F5F9",
                color: "#64748B",
                border: "1.5px solid #E2E8F0",
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Start fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PyqMockTestView
      test={test}
      paperSlug={paperSlug}
      paperLabel={paperLabel}
      uid={user!.uid}
      initialState={draft ?? undefined}
    />
  );
}
