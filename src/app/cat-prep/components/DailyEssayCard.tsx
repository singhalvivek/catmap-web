// DailyEssayCard — roadmap widget for today's essay: pending / absent / ready / responded
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { DailyEssay, EssaySubmissionView } from "@/app/cat-prep/models/essay";
import { getTodayIST, formatISTDateLong } from "@/lib/dateIST";
import { useIsHydrated } from "../lib/useIsHydrated";
import DailyDoseCardShell, {
  DailyDoseCardRow,
  DailyDoseCardSkeleton,
} from "./DailyDoseCardShell";

/**
 * "absent" is the state this card did not have. It began at "pending", and the only
 * transition out of it ran `if (!essay) return;` — while the fetch set `essay` on success
 * only and its catch did nothing at all. So on a day with no essay, or any failed request,
 * the first card on the Daily Dose hub sat pulsing a skeleton forever.
 */
type CardState = "pending" | "absent" | "ready" | "done";

export default function DailyEssayCard() {
  const [cardState, setCardState] = useState<CardState>("pending");
  const [essay, setEssay] = useState<DailyEssay | null>(null);

  const date = getTodayIST();
  // Client-only: this card is statically prerendered, so rendering the date during SSR
  // bakes the build day into the HTML and mismatches on hydration.
  const hydrated = useIsHydrated();
  const dateLabel = hydrated ? formatISTDateLong(date) : "";

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/daily-essay?date=${date}`)
      .then((r) => (r.ok ? (r.json() as Promise<DailyEssay>) : null))
      .then((data) => {
        if (cancelled) return;
        if (data) setEssay(data);
        else setCardState("absent");
      })
      .catch(() => {
        if (!cancelled) setCardState("absent");
      });

    return () => {
      cancelled = true;
    };
  }, [date]);

  useEffect(() => {
    if (!essay) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCardState("ready");
        return;
      }
      try {
        const res = await fetch(
          `/api/daily-essay/submissions?date=${date}&userId=${encodeURIComponent(user.uid)}`
        );
        const data = (await res.json()) as {
          submitted: boolean;
          submissions?: EssaySubmissionView[];
        };
        setCardState(data.submitted ? "done" : "ready");
      } catch {
        setCardState("ready");
      }
    });
    return () => unsub();
  }, [essay, date]);

  if (cardState === "pending") {
    return (
      <DailyDoseCardShell name="Daily Essay" date={dateLabel}>
        <DailyDoseCardSkeleton />
      </DailyDoseCardShell>
    );
  }

  if (cardState === "absent") {
    return (
      <DailyDoseCardShell name="Daily Essay" date={dateLabel}>
        <DailyDoseCardRow
          muted
          title="No essay for today"
          sub="Every past essay is still open, and responding to an old one practises the same reading."
          action={
            <Link
              href="/cat-prep/daily-dose/essay/archive"
              className="ed-btn"
              data-weight="secondary"
            >
              Browse the archive
            </Link>
          }
        />
      </DailyDoseCardShell>
    );
  }

  if (cardState === "done") {
    return (
      <DailyDoseCardShell
        name="Daily Essay"
        date={dateLabel}
        badge={<span className="ed-pill" data-state="correct">Responded</span>}
      >
        <DailyDoseCardRow
          title={essay?.title ?? "Today's essay"}
          sub={essay?.author ? `by ${essay.author}` : "Aeon"}
          action={
            <Link
              href="/cat-prep/daily-dose/essay"
              className="ed-btn"
              data-weight="secondary"
            >
              See the discussion
            </Link>
          }
        />
      </DailyDoseCardShell>
    );
  }

  return (
    <DailyDoseCardShell name="Daily Essay" date={dateLabel}>
      <DailyDoseCardRow
        title={essay?.title ?? "Today's essay is ready"}
        sub={
          <>
            {essay?.author ? `by ${essay.author} · ` : ""}Read and respond &middot; VARC
            practice
          </>
        }
        action={
          <Link href="/cat-prep/daily-dose/essay" className="ed-btn" data-weight="primary">
            Read and respond
          </Link>
        }
      />
    </DailyDoseCardShell>
  );
}
