// DailyChallengeCard — roadmap widget for today's challenge: pending / absent / login / cta / done
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getDailyChallengeResult } from "../lib/dailyChallengeStore";
import type { DailyChallengeResult } from "../models/dailyChallenge";
import { getTodayIST, formatISTDateLong, formatDuration } from "@/lib/dateIST";
import { useIsHydrated } from "../lib/useIsHydrated";
import { trackEvent } from "@/app/components/analytics";
import DailyDoseCardShell, {
  DailyDoseCardRow,
  DailyDoseCardSkeleton,
} from "./DailyDoseCardShell";

type CardStatus = "pending" | "absent" | "login" | "cta" | "done";

/** A signed figure reads by sign, not by hue alone: zero is neither right nor wrong. */
function signState(value: number): string {
  if (value > 0) return "correct";
  if (value < 0) return "wrong";
  return "inert";
}

export default function DailyChallengeCard() {
  const [cardStatus, setCardStatus] = useState<CardStatus>("pending");
  const [result, setResult] = useState<DailyChallengeResult | null>(null);
  const [loginError, setLoginError] = useState(false);

  const date = getTodayIST();
  // Client-only: this card sits on a statically prerendered page, so rendering the date
  // during SSR would ship the build day in the HTML and mismatch on hydration.
  const hydrated = useIsHydrated();
  const today = hydrated ? formatISTDateLong(date) : "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const challengeExists = await fetch(`/api/daily-quiz?date=${date}`)
        .then((r) => r.ok)
        .catch(() => false);

      if (!challengeExists) {
        setCardStatus("absent");
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
          setCardStatus("done");
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

  if (cardStatus === "pending") {
    return (
      <DailyDoseCardShell name="Daily Challenge" date={today}>
        <DailyDoseCardSkeleton />
      </DailyDoseCardShell>
    );
  }

  if (cardStatus === "absent") {
    return (
      <DailyDoseCardShell name="Daily Challenge" date={today}>
        {/* This used to read "Check back tomorrow!" and stop, which on the page whose whole
            premise is a daily habit is a dead end. The other half of the Dose is still here. */}
        <DailyDoseCardRow
          muted
          title="No challenge today"
          sub="Today's essay still counts towards your streak, and a practice set keeps the habit."
          action={
            <Link href="/cat-prep/practice" className="ed-btn" data-weight="secondary">
              Practise instead
            </Link>
          }
        />
      </DailyDoseCardShell>
    );
  }

  if (cardStatus === "login") {
    return (
      <DailyDoseCardShell name="Daily Challenge" date={today}>
        <DailyDoseCardRow
          title="Test your CAT skills today"
          sub={
            loginError ? (
              <span style={{ color: "var(--wrong-text)" }}>
                Could not sign in. Please try again.
              </span>
            ) : (
              "Sign in to start — your results are saved automatically"
            )
          }
          action={
            <button
              type="button"
              onClick={handleSignIn}
              className="ed-btn"
              data-weight="primary"
            >
              Sign in
            </button>
          }
        />
      </DailyDoseCardShell>
    );
  }

  if (cardStatus === "done" && result) {
    return (
      <DailyDoseCardShell
        name="Daily Challenge"
        date={today}
        badge={
          <span className="ed-pill" data-state="correct">
            Completed
          </span>
        }
      >
        <div className="dd-card__row">
          <div className="dd-card__text">
            <p className="dd-score">
              <span className="dd-score__value">{result.score}</span>
              <span className="dd-score__total"> / {result.totalMarks}</span>
            </p>
            <p className="dd-card__sub">
              {result.sections.map((sec) => (
                <span key={sec.name} className="dd-score__section">
                  {sec.name}{" "}
                  {/* A section scored 0 of 9 used to print in the correct-answer green,
                      because the test was score >= 0. */}
                  <strong data-state={signState(sec.score)}>
                    {sec.score > 0 ? `+${sec.score}` : sec.score}
                  </strong>
                </span>
              ))}
              <span className="dd-score__time">{formatDuration(result.totalTimeSeconds)}</span>
            </p>
          </div>
          <Link
            href="/cat-prep/daily-dose/challenge"
            className="ed-btn"
            data-weight="secondary"
            onClick={() =>
              trackEvent("daily_challenge_card_clicked", {
                challenge_date: date,
                auth_state: "signed_in",
                button_id: "view_results",
              })
            }
          >
            See results
          </Link>
        </div>
      </DailyDoseCardShell>
    );
  }

  return (
    <DailyDoseCardShell name="Daily Challenge" date={today}>
      <DailyDoseCardRow
        title="Test your CAT skills today"
        sub="VARC &middot; Quantitative &middot; DILR &middot; timed sections"
        action={
          <Link
            href="/cat-prep/daily-dose/challenge"
            className="ed-btn"
            data-weight="primary"
            onClick={() =>
              trackEvent("daily_challenge_card_clicked", {
                challenge_date: date,
                auth_state: "signed_in",
                button_id: "take_challenge",
              })
            }
          >
            Take the challenge
          </Link>
        }
      />
    </DailyDoseCardShell>
  );
}
