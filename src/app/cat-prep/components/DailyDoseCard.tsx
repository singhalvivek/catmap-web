// DailyDoseCard — Learn-home promo tile linking to the Daily Dose section.
"use client";

import Link from "next/link";

export default function DailyDoseCard() {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1.5px solid rgba(20,184,166,0.30)",
        boxShadow: "0 4px 20px rgba(20,184,166,0.10)",
        overflow: "hidden",
        marginBottom: 28,
      }}
    >
      <div
        style={{
          background: "#14B8A6",
          padding: "11px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>💊</span>
        <span className="font-extrabold text-white" style={{ fontSize: 14 }}>
          Daily Dose
        </span>
      </div>
      <div
        style={{
          background: "#fff",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <p className="font-semibold text-trust-navy" style={{ fontSize: 14, marginBottom: 3 }}>
            Today&apos;s essay + challenge
          </p>
          <p style={{ fontSize: 12, color: "#94A3B8" }}>
            A small daily habit · build your streak
          </p>
        </div>
        <Link
          href="/cat-prep/daily-dose"
          className="font-bold text-white"
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: "#14B8A6",
            fontSize: 13,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Open Daily Dose →
        </Link>
      </div>
    </div>
  );
}
