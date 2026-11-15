// DailyDoseStreakBanner — the signed-in streak and today's two items, or a way to start one
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type StreakData = {
  streak: number;
  essayDoneToday: boolean;
  challengeDoneToday: boolean;
};

type BannerState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "ready"; data: StreakData };

/**
 * State reaches a screen reader as a word. This used to be a tick glyph in a filled box
 * with the same label either way, so "Essay today" was announced identically whether it was
 * done or not — and the not-done fill was --rule at 1.47:1, below the 3:1 WCAG 1.4.11 asks
 * of a non-text indicator.
 */
function Item({ done, label }: { done: boolean; label: string }) {
  return (
    <span className="dd-streak__item" data-done={done}>
      <span className="dd-streak__mark" aria-hidden="true" />
      {label}
      <span className="ed-sr-only">{done ? ", done" : ", not done yet"}</span>
    </span>
  );
}

export default function DailyDoseStreakBanner() {
  const [state, setState] = useState<BannerState>({ status: "loading" });
  const [signInError, setSignInError] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ status: "signed-out" });
        return;
      }
      try {
        const res = await fetch(`/api/daily-dose/streak?uid=${encodeURIComponent(user.uid)}`);
        const data = (await res.json()) as StreakData;
        setState({ status: "ready", data });
      } catch {
        setState({ status: "signed-out" });
      }
    });
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    setSignInError(false);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setSignInError(true);
    }
  };

  if (state.status === "loading") {
    return (
      <div className="dd-streak" aria-hidden="true">
        <span className="ed-skeleton" style={{ width: 160, height: 16 }} />
      </div>
    );
  }

  if (state.status === "signed-out") {
    return (
      <div className="dd-streak">
        <p className="dd-streak__prompt">
          {signInError
            ? "Could not sign in. Please try again."
            : "Sign in and today counts as day one."}
        </p>
        {/* The whole slot used to be this sentence and nothing else: a instruction to sign
            in, with no control anywhere near it to do so. */}
        <button
          type="button"
          onClick={handleSignIn}
          className="ed-btn"
          data-weight="secondary"
        >
          Sign in
        </button>
      </div>
    );
  }

  const { streak, essayDoneToday, challengeDoneToday } = state.data;

  return (
    <div className="dd-streak">
      <p className="dd-streak__count">
        <span className="dd-streak__figure display">{streak}</span>
        {/* Day zero is a beginning, not a failure, and it is the state every new reader
            sees first. */}
        <span className="dd-streak__unit">
          {streak === 0 ? "days so far — today starts it" : `day${streak === 1 ? "" : "s"} in a row`}
        </span>
      </p>
      <div className="dd-streak__items">
        <Item done={essayDoneToday} label="Essay today" />
        <Item done={challengeDoneToday} label="Challenge today" />
      </div>
    </div>
  );
}
