// DailyDoseSection — Daily Dose body: short intro + today's essay and challenge cards.
"use client";

import DailyEssayCard from "./DailyEssayCard";
import DailyChallengeCard from "./DailyChallengeCard";

export default function DailyDoseSection() {
  return (
    <div>
      {/* Intro */}
      <div
        style={{
          background: "#F0FDFA",
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 24,
          borderLeft: "3px solid #14B8A6",
        }}
      >
        <p className="font-bold text-trust-navy" style={{ fontSize: 14, margin: "0 0 4px" }}>
          Two things a day. That&apos;s it.
        </p>
        <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
          Read today&apos;s Aeon essay and respond for sharper VARC, then take the timed Daily
          Challenge to keep your problem-solving warm. Do either to keep your streak alive — doing
          both is even better.
        </p>
      </div>

      {/* Today's essay */}
      <DailyEssayCard />

      {/* Today's challenge */}
      <DailyChallengeCard />

      {/* Why a daily habit */}
      <div style={{ marginTop: 32, paddingTop: 28, borderTop: "1px solid #E2E8F0" }}>
        <h2
          className="font-extrabold text-trust-navy"
          style={{ fontSize: 20, margin: "0 0 8px", letterSpacing: "-0.3px" }}
        >
          Why a daily habit beats cramming
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.6 }}>
          CAT rewards consistency, not bursts. A few focused minutes every day compounds into the
          reading speed, vocabulary, and calculation fluency that decide your percentile.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: 14,
          }}
        >
          {[
            {
              title: "Sharper VARC, daily",
              body: "Real Aeon essays stretch your reading and reasoning far more than drilled RC passages — and you see how others interpreted the same piece.",
            },
            {
              title: "Stay exam-warm",
              body: "A short timed challenge every day keeps section pacing and accuracy from going rusty between full mocks.",
            },
            {
              title: "Build a streak",
              body: "Showing up daily is the habit toppers credit most. The streak turns 'I should study' into 'I already did today'.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "#F8FAFC",
                borderRadius: 12,
                padding: "16px 16px",
                borderLeft: "3px solid #14B8A6",
              }}
            >
              <div className="font-bold text-trust-navy" style={{ fontSize: 13, marginBottom: 6 }}>
                {item.title}
              </div>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.55 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
