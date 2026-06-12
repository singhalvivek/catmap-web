// PracticeOptionButton — shared option button for all practice players; idle/selected/correct/wrong states
"use client";

import type { ReactNode } from "react";

export type OptionState = "idle" | "selected" | "correct" | "wrong";

const STATE_STYLES: Record<OptionState, { border: string; bg: string; dotBg: string; dotBorder: string; dotColor: string }> = {
  idle:     { border: "#E2E8F0", bg: "#fff",    dotBg: "#fff",    dotBorder: "#CBD5E1", dotColor: "#94A3B8" },
  selected: { border: "#1E3A5F", bg: "#EEF2FF", dotBg: "#1E3A5F", dotBorder: "#1E3A5F", dotColor: "#fff"    },
  correct:  { border: "#10B981", bg: "#D1FAE5", dotBg: "#10B981", dotBorder: "#10B981", dotColor: "#fff"    },
  wrong:    { border: "#EF4444", bg: "#FEE2E2", dotBg: "#EF4444", dotBorder: "#EF4444", dotColor: "#fff"    },
};

type Props = {
  label: string;       // "A" | "B" | "C" | "D"
  state: OptionState;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode; // option text — plain string or MathContent component
};

export function PracticeOptionButton({ label, state, disabled, onClick, children }: Props) {
  const s = STATE_STYLES[state];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 10,
        border: `1.5px solid ${s.border}`,
        background: s.bg,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "inherit",
        fontSize: 14,
        textAlign: "left",
        transition: "all 0.15s",
        marginBottom: 8,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: `1.5px solid ${s.dotBorder}`,
          background: s.dotBg,
          color: s.dotColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
          transition: "all 0.15s",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1 }}>{children}</span>
    </button>
  );
}
