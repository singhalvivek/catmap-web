// DailyChallengeCard — roadmap widget: no-challenge / login / CTA / completed states
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getDailyChallengeResult } from "../lib/dailyChallengeStore";
import type { DailyChallengeResult } from "../models/dailyChallenge";
import { getTodayIST, formatISTDateLong } from "@/lib/dateIST";
import { useIsHydrated } from "../lib/useIsHydrated";
import { trackEvent } from "@/app/components/analytics";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m > 0) return s === 0 ? `${m}m` : `${m}m ${s}s`;
  return `${s}s`;
}

type CardStatus = "loading" | "no-challenge" | "login" | "cta" | "completed";

const CARD_HEADER = (
  rightSlot: React.ReactNode,
  today: string,
  showDate = false
) => (
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
      <span style={{ fontSize: 16 }}>⚡</span>
      <span className="font-extrabold text-white" style={{ fontSize: 14 }}>
        Daily Challenge
      </span>
    </div>
    {showDate ? (
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
        {today}
      </span>
    ) : (
      rightSlot
    )}
  </div>
);

export default function DailyChallengeCard() {
  const [cardStatus, setCardStatus] = useState<CardStatus>("loading");
  const [result, setResult] = useState<DailyChallengeResult | null>(null);
  const [loginError, setLoginError] = useState(false);

  const date = getTodayIST();
  // Client-only: this card sits on a statically prerendered page, so rendering
  // the date during SSR would ship the build-day's date in the HTML and
  // mismatch on hydration.
  const hydrated = useIsHydrated();
  const today = hydrated ? formatISTDateLong(date) : "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Check if today's quiz exists in MongoDB
      const challengeExists = await fetch(`/api/daily-quiz?date=${date}`)
        .then((r) => r.ok)
        .catch(() => false);

      if (!challengeExists) {
        setCardStatus("no-challenge");
        return;
      }

      if (!user) {
        setCardStatus("login");
        return;
      }

      try {
        const r = await getDailyChallengeResult(user.uid, date);
        if (r) {
          setResult(r);
          setCardStatus("completed");
        } else {
          setCardStatus("cta");
        }
      } catch (err) {
        console.error("[DailyChallengeCard] result check failed:", err);
        setCardStatus("cta");
      }
    });
    return () => unsubscribe();
  }, [date]);

  const handleSignIn = async () => {
    setLoginError(false);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will fire and update the card
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

  if (cardStatus === "loading") {
    return cardWrap(
      <>
        {CARD_HEADER(null, today, true)}
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
            <div
              style={{
                height: 14,
                borderRadius: 6,
                background: "#E2E8F0",
                width: "55%",
                marginBottom: 9,
              }}
            />
            <div
              style={{
                height: 11,
                borderRadius: 5,
                background: "#F1F5F9",
                width: "38%",
              }}
            />
          </div>
          <div
            style={{
              height: 34,
              width: 100,
              borderRadius: 8,
              background: "#E2E8F0",
              marginLeft: 16,
              flexShrink: 0,
            }}
          />
        </div>
      </>
    );
  }

  if (cardStatus === "no-challenge") {
    return cardWrap(
      <>
        {CARD_HEADER(null, today, true)}
        <div style={{ background: "#fff", padding: "14px 20px" }}>
          <p className="font-semibold text-slate-400" style={{ fontSize: 14 }}>
            No challenge scheduled for today
          </p>
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>
            Check back tomorrow!
          </p>
        </div>
      </>
    );
  }

  if (cardStatus === "login") {
    return cardWrap(
      <>
        {CARD_HEADER(null, today, true)}
        <div
          style={{
            background: "#fff",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="font-semibold text-trust-navy" style={{ fontSize: 14, marginBottom: 3 }}>
              Test your CAT skills today
            </p>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>
              Sign in to start — your results are saved automatically
            </p>
            {loginError && (
              <p style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>
                Could not sign in. Please try again.
              </p>
            )}
          </div>
          <button
            onClick={handleSignIn}
            className="font-bold text-white"
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              background: "#1E3A5F",
              border: "none",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginLeft: 16,
            }}
          >
            Sign in →
          </button>
        </div>
      </>
    );
  }

  if (cardStatus === "completed" && result) {
    return cardWrap(
      <>
        {CARD_HEADER(
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
            ✓ Completed
          </span>,
          today
        )}
        <div
          style={{
            background: "#fff",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="font-extrabold text-trust-navy" style={{ fontSize: 22, lineHeight: 1, marginBottom: 5 }}>
              {result.score}
              <span className="font-medium text-slate-300" style={{ fontSize: 15 }}>
                {" "}/ {result.totalMarks}
              </span>
            </p>
            <div className="flex items-center gap-3" style={{ flexWrap: "wrap" }}>
              {result.sections.map((sec) => (
                <span key={sec.name} style={{ fontSize: 12, color: "#64748B" }}>
                  {sec.name}:{" "}
                  <span className="font-semibold" style={{ color: sec.score >= 0 ? "#166534" : "#991B1B" }}>
                    {sec.score > 0 ? `+${sec.score}` : sec.score}
                  </span>
                </span>
              ))}
              <span style={{ fontSize: 12, color: "#94A3B8" }}>
                · {formatTime(result.totalTimeSeconds)}
              </span>
            </div>
          </div>
          <Link
            href="/cat-prep/daily-dose/challenge"
            className="font-bold text-white"
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              background: "#1E3A5F",
              fontSize: 13,
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginLeft: 16,
            }}
            onClick={() => trackEvent("daily_challenge_card_clicked", { challenge_date: date, auth_state: "signed_in", button_id: "view_results" })}
          >
            View Results →
          </Link>
        </div>
      </>
    );
  }

  // cta state
  return cardWrap(
    <>
      {CARD_HEADER(null, today, true)}
      <div
        style={{
          background: "#fff",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p className="font-semibold text-trust-navy" style={{ fontSize: 14, marginBottom: 3 }}>
            Test your CAT skills today
          </p>
          <p style={{ fontSize: 12, color: "#94A3B8" }}>
            VARC · Quantitative · DILR · Timed sections
          </p>
        </div>
        <Link
          href="/cat-prep/daily-dose/challenge"
          className="font-bold text-white"
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            background: "#1E3A5F",
            fontSize: 13,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginLeft: 16,
          }}
          onClick={() => trackEvent("daily_challenge_card_clicked", { challenge_date: date, auth_state: "signed_in", button_id: "take_challenge" })}
        >
          Take Challenge →
        </Link>
      </div>
    </>
  );
}
