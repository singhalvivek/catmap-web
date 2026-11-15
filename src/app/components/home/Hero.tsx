// Hero — home page opening: one claim, one action, and the real roadmap beside it
import type { CSSProperties } from "react";
import Link from "next/link";
import RoadmapPreview from "./RoadmapPreview";
import { HOME_COUNTS, NEWEST_PYQ } from "@/app/lib/homeCounts";

export default function Hero() {
  return (
    <section
      data-section="hero"
      style={{ padding: "clamp(36px, 5vw, 64px) 0 clamp(40px, 5vw, 60px)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 7fr) minmax(0, 4.6fr)",
          gap: "clamp(32px, 4vw, 56px)",
          alignItems: "start",
        }}
        className="hero-grid"
      >
        <div>
          <p className="ed-kicker reveal" style={{ margin: "0 0 22px" }}>
            Free · No account needed
          </p>

          {/*
            Capped at 50px rather than 76: at 1440 the left column is ~600px, and the second
            sentence overflowed it, orphaning "paper." onto a third line. `text-wrap: balance`
            evens the break at narrow widths; "last paper" is held together so the italic
            phrase never splits across lines.
          */}
          <h1
            className="display"
            style={{
              fontSize: "clamp(34px, 4.6vw, 50px)",
              color: "var(--ink)",
              margin: "0 0 26px",
              textWrap: "balance",
            }}
          >
            <span className="reveal-mask" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
              <span className="reveal-mask__line">Start at the first topic.</span>
            </span>
            <span className="reveal-mask" style={{ "--reveal-delay": "240ms" } as CSSProperties}>
              <span className="reveal-mask__line">
                Finish at the{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--accent-text)",
                    whiteSpace: "nowrap",
                  }}
                >
                  last paper
                </em>
                .
              </span>
            </span>
          </h1>

          <p
            className="reveal"
            style={{
              fontSize: "clamp(17px, 1.7vw, 19px)",
              lineHeight: 1.6,
              color: "var(--ink-soft)",
              maxWidth: "50ch",
              margin: "0 0 34px",
              paddingLeft: 18,
              position: "relative",
              "--reveal-delay": "380ms",
            } as CSSProperties}
          >
            <span
              aria-hidden="true"
              className="reveal-bar"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                background: "var(--accent)",
                "--reveal-delay": "340ms",
              } as CSSProperties}
            />
            A free, self-paced route through the CAT: the syllabus in order, a question set
            for every chapter, and the official past papers to sit when you are ready.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              flexWrap: "wrap",
            }}
          >
            <Link href="/cat-prep" className="ed-cta reveal-pop" style={{ "--reveal-delay": "460ms" } as CSSProperties}>
              Open the syllabus
            </Link>
            <Link href="/cat-prep/pyq" className="ed-link-strong reveal" style={{ "--reveal-delay": "560ms" } as CSSProperties}>
              or sit a past paper
            </Link>
          </div>

          {/* Footnote. Fills the column under the action so the hero balances against the
              plate, and answers the three objections a cold visitor arrives with. */}
          <p
            className="reveal"
            style={{
              "--reveal-delay": "640ms",
              marginTop: 36,
              paddingTop: 16,
              borderTop: "1px solid var(--rule-firm)",
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink-soft)",
              maxWidth: "46ch",
            } as CSSProperties}
          >
            No sign-up, no advertisements, nothing paid. Built on{" "}
            {HOME_COUNTS.pyqPapers} official papers and {HOME_COUNTS.resourceLinks} free
            lessons.
            {NEWEST_PYQ && (
              <>
                {" "}
                Newest:{" "}
                <Link
                  href={NEWEST_PYQ.href}
                  style={{
                    color: "var(--accent-text)",
                    fontWeight: 600,
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  {NEWEST_PYQ.label}
                </Link>
                .
              </>
            )}
          </p>
        </div>

        <RoadmapPreview />
      </div>
    </section>
  );
}
