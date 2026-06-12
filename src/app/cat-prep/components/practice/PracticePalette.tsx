// PracticePalette — question number palette for practice players; sidebar (desktop) or fixed bottom bar (mobile)
"use client";

import { useEffect, useRef } from "react";

export type PillState = "unanswered" | "answered" | "correct" | "wrong" | "current";

const PILL_STYLES: Record<PillState, { bg: string; color: string; border: string }> = {
  unanswered: { bg: "#F1F5F9", color: "#94A3B8", border: "#E2E8F0" },
  answered:   { bg: "#EEF2FF", color: "#1E3A5F", border: "#1E3A5F" },
  correct:    { bg: "#D1FAE5", color: "#065F46", border: "#10B981" },
  wrong:      { bg: "#FEE2E2", color: "#991B1B", border: "#EF4444" },
  current:    { bg: "#1E3A5F", color: "#fff",    border: "#1E3A5F" },
};

const LEGEND: Array<{ state: PillState; label: string }> = [
  { state: "correct",    label: "Correct" },
  { state: "wrong",      label: "Wrong" },
  { state: "answered",   label: "Answered" },
  { state: "unanswered", label: "Not attempted" },
];

type Props = {
  total: number;
  getPillState: (qNum: number) => PillState;
  currentNum: number;
  onSelect: (qNum: number) => void;
  variant: "sidebar" | "bottom-bar";
};

export function PracticePalette({ total, getPillState, currentNum, onSelect, variant }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the active pill centred in the mobile bottom bar on navigation
  useEffect(() => {
    if (variant !== "bottom-bar" || !containerRef.current) return;
    const btn = containerRef.current.children[currentNum - 1] as HTMLElement | undefined;
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentNum, variant]);

  const pills = Array.from({ length: total }, (_, i) => {
    const qNum = i + 1;
    const s = PILL_STYLES[getPillState(qNum)];
    return (
      <button
        key={qNum}
        onClick={() => onSelect(qNum)}
        style={{
          width: variant === "bottom-bar" ? 36 : 32,
          height: variant === "bottom-bar" ? 36 : 32,
          borderRadius: 8,
          background: s.bg,
          color: s.color,
          border: `1.5px solid ${s.border}`,
          fontSize: variant === "bottom-bar" ? 12 : 11,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          flexShrink: 0,
        }}
      >
        {qNum}
      </button>
    );
  });

  if (variant === "bottom-bar") {
    return (
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1.5px solid #E8EAF0",
          boxShadow: "0 -4px 20px rgba(30,58,95,0.08)",
          zIndex: 50,
          padding: "10px 16px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          ref={containerRef}
          style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none" }}
        >
          {pills}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-extrabold text-trust-navy" style={{ fontSize: 12, marginBottom: 10 }}>
        Questions
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {pills}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {LEGEND.map(({ state, label }) => {
          const s = PILL_STYLES[state];
          return (
            <div key={state} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: s.bg,
                  border: `1.5px solid ${s.border}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: "#64748B" }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
