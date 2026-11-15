// PracticeOptionButton — the shared answer option for every practice and test player
"use client";

import type { ReactNode } from "react";

export type OptionState = "idle" | "selected" | "correct" | "wrong";

/**
 * Spoken state. Correctness was colour-only across the whole site: the letter marker read
 * "A" identically whether the option was untouched, chosen, right or wrong, so a screen
 * reader user got no verdict at all and a colour-blind user got a tint they could not
 * separate. The marker now also changes shape, and the word reaches the accessible name.
 */
const STATE_WORD: Record<OptionState, string | null> = {
  idle: null,
  selected: "selected",
  correct: "correct answer",
  wrong: "your answer, incorrect",
};

type Props = {
  /** "A" | "B" | "C" | "D" */
  label: string;
  state: OptionState;
  disabled?: boolean;
  onClick: () => void;
  /** Option text — a plain string, or a MathContent component. */
  children: ReactNode;
};

export function PracticeOptionButton({ label, state, disabled, onClick, children }: Props) {
  const word = STATE_WORD[state];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="ed-option"
      data-state={state}
      aria-pressed={state === "selected" || state === "wrong"}
      style={{ marginBottom: 8 }}
    >
      <span className="ed-option__key" aria-hidden="true">
        {state === "correct" ? "✓" : state === "wrong" ? "✕" : label}
      </span>
      <span style={{ flex: 1 }}>
        {children}
        {word && <span className="ed-sr-only">, {word}</span>}
      </span>
    </button>
  );
}
