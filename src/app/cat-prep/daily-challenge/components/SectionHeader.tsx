// SectionHeader — sticky bar showing challenge name, timers, and submit button
"use client";

import Link from "next/link";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  challengeName: string;
  sectionTimeLeft: number;
  questionTimeLeft: number | null;
  onSubmitChallenge: () => void;
};

export default function SectionHeader({
  challengeName,
  sectionTimeLeft,
  questionTimeLeft,
  onSubmitChallenge,
}: Props) {
  const sectionCritical = sectionTimeLeft <= 30;
  const sectionWarning = sectionTimeLeft <= 60;
  const questionWarning = questionTimeLeft !== null && questionTimeLeft <= 10;

  const timerColor = sectionCritical ? "#EF4444" : sectionWarning ? "#FBBF24" : "#fff";

  return (
    <div
      style={{
        background: "#1E3A5F",
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
        {/* Left: back link + challenge name */}
        <div className="flex items-center gap-3">
          <Link
            href="/cat-prep"
            className="font-semibold"
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
              letterSpacing: "0.2px",
            }}
          >
            ← Back
          </Link>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>|</span>
          <span className="font-extrabold text-white" style={{ fontSize: 15 }}>
            {challengeName}
          </span>
        </div>

        {/* Right: per-question timer + section timer + submit */}
        <div className="flex items-center gap-3">
          {questionTimeLeft !== null && (
            <span
              className="font-semibold"
              style={{
                fontSize: 12,
                color: questionWarning ? "#FCA5A5" : "rgba(255,255,255,0.6)",
              }}
            >
              Q: {formatTime(questionTimeLeft)}
            </span>
          )}

          <span
            className="font-bold"
            style={{
              fontSize: 16,
              color: timerColor,
              fontVariantNumeric: "tabular-nums",
              minWidth: 44,
              textAlign: "right",
              letterSpacing: "0.5px",
            }}
          >
            {formatTime(sectionTimeLeft)}
          </span>

          <button
            type="button"
            onClick={onSubmitChallenge}
            className="font-bold"
            style={{
              padding: "5px 14px",
              borderRadius: 7,
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.22)",
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
