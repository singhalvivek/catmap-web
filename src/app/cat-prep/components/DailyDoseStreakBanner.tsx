// DailyDoseStreakBanner — shows the signed-in user's current Daily Dose streak + today's status.
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

type StreakData = {
  streak: number;
  essayDoneToday: boolean;
  challengeDoneToday: boolean;
};

type BannerState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "ready"; data: StreakData };

const WRAP_STYLE = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap" as const,
  background: "#fff",
  border: "1.5px solid rgba(20,184,166,0.35)",
  padding: "12px 16px",
};

function Dot({ done, label }: { done: boolean; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-soft)" }}>
      <span
        style={{
          width: 16,
          height: 16,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          background: done ? "var(--accent)" : "var(--rule)",
          color: done ? "#fff" : "var(--ink-faint)",
        }}
      >
        {done ? "✓" : ""}
      </span>
      {label}
    </span>
  );
}

export default function DailyDoseStreakBanner() {
  const [state, setState] = useState<BannerState>({ status: "loading" });

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

  if (state.status === "loading") {
    return (
      <div className="animate-pulse" style={{ ...WRAP_STYLE, height: 48 }}>
        <div style={{ width: 140, height: 16, background: "var(--rule)" }} />
      </div>
    );
  }

  if (state.status === "signed-out") {
    return (
      <div style={WRAP_STYLE}>
        <span style={{ fontSize: 20 }}>🔥</span>
        <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          Sign in to build and track your daily streak.
        </span>
      </div>
    );
  }

  const { streak, essayDoneToday, challengeDoneToday } = state.data;

  return (
    <div style={WRAP_STYLE}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🔥</span>
        <span className="font-extrabold" style={{ fontSize: 22, lineHeight: 1 }}>
          {streak}
        </span>
        <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          day{streak === 1 ? "" : "s"} streak
        </span>
      </div>
      <div style={{ display: "flex", gap: 14, marginLeft: "auto", flexWrap: "wrap" }}>
        <Dot done={essayDoneToday} label="Essay today" />
        <Dot done={challengeDoneToday} label="Challenge today" />
      </div>
    </div>
  );
}
