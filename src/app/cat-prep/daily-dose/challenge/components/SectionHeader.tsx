// SectionHeader — sticky bar showing challenge name, timers, and submit button
"use client";

import Link from "next/link";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  sectionName: string;
  sectionTimeLeft: number;
  questionTimeLeft: number | null;
  onSubmitChallenge: () => void;
  backHref?: string;
};

export default function SectionHeader({
  sectionName,
  sectionTimeLeft,
  questionTimeLeft,
  onSubmitChallenge,
  backHref = "/cat-prep",
}: Props) {
  const sectionCritical = sectionTimeLeft <= 30;
  const sectionWarning = sectionTimeLeft <= 60;
  const questionWarning = questionTimeLeft !== null && questionTimeLeft <= 10;

  const timerChip = sectionCritical
    ? { bg: "rgba(239,68,68,0.18)", border: "rgba(248,113,113,0.55)", text: "var(--wrong-bright)" }
    : sectionWarning
    ? { bg: "rgba(251,191,36,0.18)", border: "rgba(251,191,36,0.5)", text: "var(--caution-bright)" }
    : { bg: "rgba(255,255,255,0.12)", border: "var(--invert-rule)", text: "var(--invert-ink)" };

  return (
    <div
      style={{
        background: "var(--invert-bg)",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="flex items-center justify-between w-full"
        style={{ maxWidth: 960, margin: "0 auto" }}
      >
        {/* Left: back link + section name */}
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="font-semibold"
            style={{
              fontSize: 12,
              color: "var(--invert-ink-soft)",
              textDecoration: "none",
              letterSpacing: "0.2px",
            }}
          >
            ← Back
          </Link>
          <span style={{ color: "var(--invert-rule)", fontSize: 14 }}>|</span>
          <span className="font-extrabold" style={{ fontSize: 15, color: "var(--invert-ink)" }}>
            {sectionName}
          </span>
        </div>

        {/* Right: per-question timer + section timer + submit */}
        <div className="flex items-center gap-3">
          {questionTimeLeft !== null && (
            <span
              className="font-semibold"
              style={{
                fontSize: 12,
                color: questionWarning ? "var(--wrong-bright)" : "var(--invert-ink-soft)",
              }}
            >
              Q: {formatTime(questionTimeLeft)}
            </span>
          )}

          <span
            className="font-bold"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 15,
              color: timerChip.text,
              background: timerChip.bg,
              border: `1.5px solid ${timerChip.border}`,
              padding: "5px 10px",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.5px",
              transition: "background 0.3s, border-color 0.3s, color 0.3s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M12 9v4l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {formatTime(sectionTimeLeft)}
          </span>

          <button
            type="button"
            onClick={onSubmitChallenge}
            className="font-bold"
            style={{
              padding: "5px 14px",
              background: "rgba(255,255,255,0.12)",
              color: "var(--invert-ink)",
              border: "1.5px solid var(--invert-rule)",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
