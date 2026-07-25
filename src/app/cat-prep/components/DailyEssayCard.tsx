// DailyEssayCard — roadmap widget: loading / cta / completed states for daily essay
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { DailyEssay } from "@/app/cat-prep/models/essay";
import type { EssaySubmissionView } from "@/app/cat-prep/models/essay";
import { getTodayIST } from "@/lib/dateIST";
import { useIsHydrated } from "../lib/useIsHydrated";

type CardState = "loading" | "cta" | "completed" | "login";

const HEADER = (badge: React.ReactNode) => (
  <div
    style={{
      background: "#1E3A5F",
      padding: "11px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 16 }}>📖</span>
      <span className="font-extrabold text-white" style={{ fontSize: 14 }}>
        Daily Essay
      </span>
    </div>
    {badge}
  </div>
);

export default function DailyEssayCard() {
  const [cardState, setCardState] = useState<CardState>("loading");
  const [essay, setEssay] = useState<DailyEssay | null>(null);
  const [loginError, setLoginError] = useState(false);

  const date = getTodayIST();
  // Client-only: this card is statically prerendered, so rendering the date
  // during SSR bakes the build day into the HTML and mismatches on hydration.
  const hydrated = useIsHydrated();
  const dateLabel = hydrated ? date : "";

  useEffect(() => {
    // Fetch today's essay regardless of auth state
    fetch(`/api/daily-essay?date=${date}`)
      .then((r) => (r.ok ? (r.json() as Promise<DailyEssay>) : null))
      .then((data) => { if (data) setEssay(data); })
      .catch(() => null);
  }, [date]);

  useEffect(() => {
    if (!essay) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCardState("cta");
        return;
      }

      try {
        const res = await fetch(
          `/api/daily-essay/submissions?date=${date}&userId=${encodeURIComponent(user.uid)}`
        );
        const data = await res.json() as { submitted: boolean; submissions?: EssaySubmissionView[] };
        setCardState(data.submitted ? "completed" : "cta");
      } catch {
        setCardState("cta");
      }
    });
    return () => unsub();
  }, [essay, date]);

  const handleSignIn = async () => {
    setLoginError(false);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setLoginError(true);
    }
  };

  const cardWrap = (children: React.ReactNode) => (
    <div
      style={{
        borderRadius: 16,
        border: "1.5px solid #1E3A5F25",
        boxShadow: "0 4px 20px rgba(30,58,95,0.08)",
        overflow: "hidden",
        marginBottom: 28,
      }}
    >
      {children}
    </div>
  );

  if (cardState === "loading") {
    return cardWrap(
      <>
        {HEADER(<span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{dateLabel}</span>)}
        <div
          className="animate-pulse"
          style={{
            background: "#fff",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ height: 14, borderRadius: 6, background: "#E2E8F0", width: "60%", marginBottom: 9 }} />
            <div style={{ height: 11, borderRadius: 5, background: "#F1F5F9", width: "35%" }} />
          </div>
          <div style={{ height: 34, width: 110, borderRadius: 8, background: "#E2E8F0", marginLeft: 16, flexShrink: 0 }} />
        </div>
      </>
    );
  }

  if (cardState === "completed") {
    return cardWrap(
      <>
        {HEADER(
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: 100,
              background: "rgba(34,197,94,0.15)",
              color: "#86EFAC",
              border: "1px solid rgba(134,239,172,0.3)",
            }}
          >
            ✓ Responded
          </span>
        )}
        <div style={{ background: "#fff", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p className="font-semibold text-trust-navy" style={{ fontSize: 14, marginBottom: 3 }}>
              {essay?.title ?? "Today's essay"}
            </p>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>
              {essay?.author ? `by ${essay.author}` : "Aeon"}
            </p>
          </div>
          <Link
            href="/cat-prep/daily-dose/essay"
            className="font-bold text-white"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#1E3A5F",
              fontSize: 13,
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginLeft: 16,
            }}
          >
            View Discussion →
          </Link>
        </div>
      </>
    );
  }

  // cta state — essay available, not yet submitted
  return cardWrap(
    <>
      {HEADER(<span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{dateLabel}</span>)}
      <div style={{ background: "#fff", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p className="font-semibold text-trust-navy" style={{ fontSize: 14, marginBottom: 3 }}>
            {essay?.title ?? "Today's essay is ready"}
          </p>
          <p style={{ fontSize: 12, color: "#94A3B8" }}>
            {essay?.author ? `by ${essay.author} · ` : ""}Read &amp; respond · VARC practice
          </p>
          {loginError && (
            <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>Could not sign in. Try again.</p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", marginLeft: 16, flexShrink: 0 }}>
          <Link
            href="/cat-prep/daily-dose/essay"
            className="font-bold text-white"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#1E3A5F",
              fontSize: 13,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Read &amp; Respond →
          </Link>
          {cardState === "login" && (
            <button
              onClick={handleSignIn}
              style={{
                fontSize: 11,
                color: "#64748B",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              Sign in to track progress
            </button>
          )}
        </div>
      </div>
    </>
  );
}
