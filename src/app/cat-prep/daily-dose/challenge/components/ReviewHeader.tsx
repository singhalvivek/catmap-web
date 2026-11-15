// ReviewHeader — sticky bar for review screens: back link + title, no timer/submit
"use client";

import Link from "next/link";

type Props = {
  title: string;
  backHref: string;
};

export default function ReviewHeader({ title, backHref }: Props) {
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
      <div className="flex items-center gap-3" style={{ maxWidth: 960, margin: "0 auto", width: "100%" }}>
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
          ← Back to Results
        </Link>
        <span style={{ color: "var(--invert-rule)", fontSize: 14 }}>|</span>
        <span className="font-extrabold" style={{ fontSize: 15, color: "var(--invert-ink)" }}>
          {title}
        </span>
      </div>
    </div>
  );
}
