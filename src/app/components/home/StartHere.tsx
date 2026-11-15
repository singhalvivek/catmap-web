// StartHere — three entry points chosen by situation, not three abstract steps
import type { CSSProperties } from "react";
import Link from "next/link";
import { HOME_COUNTS } from "@/app/lib/homeCounts";
import SectionHeading from "./SectionHeading";

/**
 * Keyed on what the reader already knows about themselves, which is the question a cold
 * visitor can actually answer. The old "01 Open / 02 Follow / 03 Track" described the
 * software's flow instead, which tells a stranger nothing about where to click.
 */
const ENTRY_POINTS = [
  {
    id: "beginner",
    condition: "If you have not started yet",
    action: "Read how to prepare",
    href: "/cat-prep/how-to-prepare",
    detail:
      "What percentile the schools you want actually ask for, whether coaching is worth it in your case, and a plan laid out month by month.",
  },
  {
    id: "diagnostic",
    condition: "If you want to know where you stand",
    action: "Sit a recent paper",
    href: "/cat-prep/pyq",
    detail: `Take one of the ${HOME_COUNTS.pyqPapers} official papers under exam timing, then read every solution. It is the fastest honest answer about your level.`,
  },
  {
    id: "topic",
    condition: "If you already know your weak topic",
    action: "Go to that topic",
    href: "/cat-prep",
    detail:
      "Open the syllabus, find it in the tree, watch the lessons attached to it, then work the chapter's questions.",
  },
];

export default function StartHere() {
  return (
    <section data-section="start_here" style={{ padding: "clamp(36px, 4.4vw, 56px) 0" }}>
      <SectionHeading
        eyebrow="Three ways in"
        title="Where to start"
        note="Nothing below needs an account, and none of it is a trial."
      />

      <div style={{ marginTop: 34 }}>
        {ENTRY_POINTS.map((entry, i) => (
          <div
            key={entry.id}
            className="ed-row reveal-left"
            style={{ "--reveal-delay": `${i * 110}ms` } as CSSProperties}
          >
            <Link
              href={entry.href}
              className="ed-row-plain"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>
                <span
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--accent-text)",
                    marginBottom: 9,
                  }}
                >
                  {entry.condition}
                </span>
                <span
                  className="display"
                  style={{
                    display: "block",
                    fontSize: "clamp(23px, 2.8vw, 30px)",
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  {entry.action}
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
                  {entry.detail}
                </span>
              </span>
              <span
                className="ed-arrow"
                aria-hidden="true"
                style={{
                  display: "block",
                  fontSize: 20,
                  color: "var(--accent-text)",
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
