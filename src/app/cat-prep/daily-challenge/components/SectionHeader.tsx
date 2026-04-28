// SectionHeader — sticky bar showing challenge name, section count, timers, and submit button
"use client";

import { useState } from "react";
import Link from "next/link";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  challengeName: string;
  sectionIndex: number;
  totalSections: number;
  sectionTimeLeft: number;
  questionTimeLeft: number | null;
  onSubmitChallenge: () => void;
};

export default function SectionHeader({
  challengeName,
  sectionIndex,
  totalSections,
  sectionTimeLeft,
  questionTimeLeft,
  onSubmitChallenge,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const sectionWarning = sectionTimeLeft <= 60;
  const questionWarning = questionTimeLeft !== null && questionTimeLeft <= 10;

  function handleSubmitClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onSubmitChallenge();
  }

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
        {/* Left: back link + challenge name + section count */}
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
            ← Roadmap
          </Link>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>|</span>
          <span className="font-extrabold text-white" style={{ fontSize: 15 }}>
            {challengeName}
          </span>
          <span
            className="font-medium"
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.6)",
              padding: "2px 9px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            {sectionIndex + 1} / {totalSections}
          </span>
        </div>

        {/* Right: per-question timer + section timer + submit */}
        <div className="flex items-center gap-3">
          {questionTimeLeft !== null && (
            <span
              className="font-semibold"
              style={{
                fontSize: 13,
                color: questionWarning ? "#FCA5A5" : "rgba(255,255,255,0.7)",
              }}
            >
              Q: {formatTime(questionTimeLeft)}
            </span>
          )}

          <span
            className="font-bold"
            style={{
              fontSize: 15,
              color: sectionWarning ? "#FCA5A5" : "#fff",
              fontVariantNumeric: "tabular-nums",
              minWidth: 42,
              textAlign: "right",
            }}
          >
            {formatTime(sectionTimeLeft)}
          </span>

          <button
            type="button"
            onClick={handleSubmitClick}
            onBlur={() => setConfirming(false)}
            className="font-bold"
            style={{
              padding: "5px 14px",
              borderRadius: 7,
              background: confirming ? "#EF4444" : "rgba(255,255,255,0.15)",
              color: "#fff",
              border: confirming ? "1.5px solid #EF4444" : "1.5px solid rgba(255,255,255,0.25)",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {confirming ? "Confirm submit?" : "Submit Challenge"}
          </button>
        </div>
      </div>
    </div>
  );
}
