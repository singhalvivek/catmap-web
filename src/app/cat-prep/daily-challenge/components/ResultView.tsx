// ResultView — post-test result screen: overall score, time, and per-section expandable breakdown
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { DailyChallengeResult, DailyTest } from "../../models/dailyChallenge";
import SectionBreakdownCard from "./SectionBreakdownCard";
import { trackEvent } from "@/app/components/analytics";

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return s === 0 ? `${m}m` : `${m}m ${s}s`;
  return `${s}s`;
}

type Props = {
  result: DailyChallengeResult;
  test: DailyTest;
  saveError: boolean;
  is_returning?: boolean;
};

export default function ResultView({ result, test, saveError, is_returning = false }: Props) {
  const pct = result.totalMarks > 0
    ? Math.round((result.score / result.totalMarks) * 100)
    : 0;

  const eventParams = useRef({
    challenge_date: result.completedAt.toISOString().slice(0, 10),
    score_percent: pct,
    is_returning,
  });
  useEffect(() => {
    trackEvent("daily_challenge_result_viewed", eventParams.current);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FFFDF8" }}>
      {/* Sticky top bar */}
      <div
        style={{
          background: "#1E3A5F",
          height: 52,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <span className="font-extrabold text-white" style={{ fontSize: 15 }}>
          Daily Challenge · Results
        </span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 16px 48px" }}>
        {/* Score hero */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1.5px solid #E8EAF0",
            padding: "28px 24px",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <p className="text-slate-400" style={{ fontSize: 12, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 8 }}>
            Total Score
          </p>
          <p
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 44, lineHeight: 1, marginBottom: 4 }}
          >
            {result.score}
            <span className="font-medium text-slate-300" style={{ fontSize: 24 }}>
              {" "}/ {result.totalMarks}
            </span>
          </p>
          <p className="text-slate-400" style={{ fontSize: 13, marginBottom: 16 }}>
            {pct}% · {formatTime(result.totalTimeSeconds)} total time
          </p>

          {/* Quick stat pills */}
          <div className="flex justify-center gap-3" style={{ flexWrap: "wrap" }}>
            {result.sections.map((sec) => (
              <div
                key={sec.name}
                style={{
                  padding: "5px 14px",
                  borderRadius: 100,
                  background: "#F1F5F9",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1E3A5F",
                }}
              >
                {sec.name}: {sec.score > 0 ? `+${sec.score}` : sec.score}
              </div>
            ))}
          </div>
        </div>

        {saveError && (
          <p className="text-red-500 text-xs mb-4 text-center">
            Could not save your result. Please note your score.
          </p>
        )}

        {/* Per-section breakdown */}
        <p
          className="font-extrabold text-trust-navy"
          style={{ fontSize: 13, letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: 10 }}
        >
          Section Breakdown
        </p>

        <div className="flex flex-col gap-3" style={{ marginBottom: 28 }}>
          {result.sections.map((secResult, i) => {
            const testSection = test.sections[i];
            if (!testSection) return null;
            return (
              <SectionBreakdownCard
                key={secResult.name}
                testSection={testSection}
                sectionResult={secResult}
              />
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/cat-prep"
            className="font-bold text-white"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              borderRadius: 10,
              background: "#1E3A5F",
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            ← Back to Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
