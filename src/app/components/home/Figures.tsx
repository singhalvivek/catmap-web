// Figures — the four derived counts, set as editorial numerals
import type { CSSProperties } from "react";
import { HOME_COUNTS, PYQ_YEAR_RANGE } from "@/app/lib/homeCounts";

/**
 * Four figures only, and every one is a fact about StudyNaksha rather than about the CAT.
 * "3 sections" is deliberately absent — anyone preparing for the CAT already knows it has
 * three, so it pads a row rather than informing one.
 */
const FIGURES = [
  {
    value: String(HOME_COUNTS.pyqPapers),
    label: "official past papers",
    note: PYQ_YEAR_RANGE,
  },
  {
    value: `${HOME_COUNTS.practiceQuestions}+`,
    label: "practice questions",
    note: `across ${HOME_COUNTS.practiceChapters} chapters, each with a solution`,
  },
  {
    value: String(HOME_COUNTS.subtopics),
    label: "subtopics in order",
    note: `${HOME_COUNTS.subtopicsWithResources} of them have lessons attached`,
  },
  {
    value: String(HOME_COUNTS.resourceLinks),
    label: "lesson links",
    note: "free videos and articles, embedded in the page",
  },
];

export default function Figures() {
  return (
    <section
      data-section="figures"
      className="ed-invert"
      style={{ padding: "clamp(52px, 7vw, 84px) 0" }}
    >
      <div className="ed-shell">
        <p className="ed-kicker reveal" style={{ margin: "0 0 10px" }}>
          Counted, not estimated
        </p>
        <h2
          className="display reveal-mask"
          style={{
            fontSize: "clamp(28px, 3.6vw, 40px)",
            color: "#fff",
            margin: "0 0 40px",
            "--reveal-delay": "110ms",
          } as CSSProperties}
        >
          <span className="reveal-mask__line">What that adds up to</span>
        </h2>

        <div className="ed-figures">
          {FIGURES.map((f, i) => (
            <div key={f.label} style={{ "--reveal-delay": `${i * 120}ms` } as CSSProperties}>
              <div
                className="reveal-rule"
                style={{
                  height: 2,
                  background: "var(--accent-bright)",
                  marginBottom: 16,
                  "--reveal-delay": `${i * 120}ms`,
                } as CSSProperties}
              />
              <div
                className="display reveal"
                style={{
                  fontSize: "clamp(54px, 7.5vw, 82px)",
                  color: "var(--accent-bright)",
                  marginBottom: 8,
                  "--reveal-delay": `${i * 120 + 80}ms`,
                } as CSSProperties}
              >
                <span className="countup">{f.value}</span>
              </div>
              <div
                className="reveal"
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 5,
                  "--reveal-delay": `${i * 120 + 170}ms`,
                } as CSSProperties}
              >
                {f.label}
              </div>
              <div
                className="reveal"
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.62)",
                  "--reveal-delay": `${i * 120 + 230}ms`,
                } as CSSProperties}
              >
                {f.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
