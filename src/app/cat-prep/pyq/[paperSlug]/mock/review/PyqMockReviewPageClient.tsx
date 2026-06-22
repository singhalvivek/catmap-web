// PyqMockReviewPageClient — auth gate; fetches the saved mock result and renders ReviewTestView
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { DailyTest, DailyChallengeResult } from "@/app/cat-prep/models/dailyChallenge";
import { getPyqMockResult } from "@/app/cat-prep/lib/pyqMockStore";
import ReviewTestView from "@/app/cat-prep/daily-challenge/components/ReviewTestView";

type Props = {
  test: DailyTest;
  paperSlug: string;
  paperLabel: string;
};

type PageStatus = "loading" | "unauthenticated" | "checking" | "no_result" | "ready";

export default function PyqMockReviewPageClient({ test, paperSlug, paperLabel }: Props) {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [result, setResult] = useState<DailyChallengeResult | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser: User | null) => {
      if (!nextUser) {
        setStatus("unauthenticated");
        return;
      }
      setStatus("checking");
      try {
        const stored = await getPyqMockResult(nextUser.uid, paperSlug);
        if (stored) {
          setResult(stored);
          setStatus("ready");
        } else {
          setStatus("no_result");
        }
      } catch (err) {
        console.error("[PyqMockReviewPageClient] check failed:", err);
        setStatus("no_result");
      }
    });
    return () => unsubscribe();
  }, [paperSlug]);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setAuthError("Could not sign in. Please try again.");
    }
  };

  if (status === "loading" || status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF8" }}>
        <p className="text-slate-500 text-sm">Loading…</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF8" }}>
        <div style={{ maxWidth: 360, textAlign: "center", padding: "32px 24px" }}>
          <h2 className="font-extrabold text-trust-navy" style={{ fontSize: 22, marginBottom: 8 }}>
            Sign in to view your review
          </h2>
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
              marginTop: 12,
            }}
          >
            Login with Google
          </button>
          {authError && <p className="text-red-600 text-xs mt-3">{authError}</p>}
        </div>
      </div>
    );
  }

  if (status === "no_result") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF8" }}>
        <div style={{ maxWidth: 360, textAlign: "center", padding: "32px 24px" }}>
          <h2 className="font-extrabold text-trust-navy" style={{ fontSize: 22, marginBottom: 8 }}>
            No attempt found
          </h2>
          <p className="text-slate-500" style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            You need to complete this mock test before you can review it.
          </p>
          <Link
            href={`/cat-prep/pyq/${paperSlug}/mock`}
            className="font-bold text-white"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 10,
              background: "#1E3A5F",
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Take the Mock Test →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ReviewTestView
      test={test}
      result={result!}
      title={`${paperLabel} · Review`}
      backHref={`/cat-prep/pyq/${paperSlug}/mock`}
    />
  );
}
