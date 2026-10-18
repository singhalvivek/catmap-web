// SurfaceList — the five product surfaces as a rule-separated contents list
import type { CSSProperties } from "react";
import Link from "next/link";
import { HOME_SURFACES } from "@/constants/homeSurfaces";
import SectionHeading from "./SectionHeading";

export default function SurfaceList() {
  return (
    <section data-section="surfaces" style={{ padding: "clamp(36px, 4.4vw, 56px) 0" }}>
      <SectionHeading
        eyebrow={`${HOME_SURFACES.length} parts`}
        title="What is inside"
        note="All of it is free, and three of the five need no account at all."
      />

      <div style={{ marginTop: 34 }}>
        {HOME_SURFACES.map((surface, i) => (
          <div
            key={surface.id}
            className="ed-row reveal-left"
            style={{ "--reveal-delay": `${i * 95}ms` } as CSSProperties}
          >
            <Link
              href={surface.href}
              className="ed-row-grid"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span
                className="display"
                style={{ fontSize: 24, color: "var(--accent)" }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span>
                <span
                  className="display"
                  style={{
                    display: "block",
                    fontSize: "clamp(23px, 2.8vw, 30px)",
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  {surface.label}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "var(--ink-soft)",
                    maxWidth: "58ch",
                  }}
                >
                  {surface.blurb}
                </span>
                {surface.signIn && (
                  <span
                    style={{
                      display: "block",
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: "var(--ink-faint)",
                      marginTop: 8,
                    }}
                  >
                    {surface.signIn}
                  </span>
                )}
              </span>

              <span
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  color: "var(--accent-text)",
                  marginTop: 12,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {surface.meta}
              </span>

              <span
                className="ed-arrow"
                aria-hidden="true"
                style={{
                  display: "block",
                  fontSize: 20,
                  color: "var(--accent)",
                  marginTop: 10,
                }}
              >
                &rarr;
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
