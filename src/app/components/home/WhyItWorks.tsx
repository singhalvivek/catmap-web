// WhyItWorks — the distraction-free argument, in one passage instead of two sections
import type { CSSProperties } from "react";
import SectionHeading from "./SectionHeading";

export default function WhyItWorks() {
  return (
    <section
      data-section="why_it_works"
      style={{
        padding: "clamp(36px, 4.4vw, 56px) 0",
        borderTop: "3px solid var(--ink)",
      }}
    >
      <div className="ed-split">
        <SectionHeading
          eyebrow="The point of it"
          title="Why it is built this way"
          rule={false}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
        <p
          className="reveal"
          style={{
            "--reveal-delay": "80ms",
            fontSize: "clamp(17px, 1.8vw, 20px)",
            lineHeight: 1.65,
            color: "var(--ink)",
            margin: 0,
          } as CSSProperties}
        >
          The lectures you need are already on the internet and already free. What is missing
          is the order to watch them in, and somewhere to watch them that is not trying to
          keep you watching.
        </p>

        {/* Preserved near-verbatim from the old page: the one line on it that reads as
            written by a person, and the only claim a competitor would have to build
            something to copy. */}
        <p
          className="display reveal"
          style={{
            fontSize: "clamp(22px, 2.8vw, 30px)",
            lineHeight: 1.3,
            color: "var(--ink)",
            margin: "6px 0",
            paddingLeft: 24,
            position: "relative",
            "--reveal-delay": "260ms",
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
              width: 4,
              background: "var(--accent)",
              "--reveal-delay": "190ms",
            } as CSSProperties}
          />
          Every lesson is embedded right inside the roadmap. No recommended videos, no
          Shorts, no autoplay into cat videos at midnight.
        </p>

        <p
          className="reveal"
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--ink-soft)",
            margin: 0,
            "--reveal-delay": "380ms",
          } as CSSProperties}
        >
          Nothing here is paid, and there are no advertisements. The lessons are other
          people&apos;s work, chosen and ordered against the syllabus; the papers are the real
          ones. The code is{" "}
          <a
            href="https://github.com/singhalvivek/catmap-web"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent-text)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            public on GitHub
          </a>{" "}
          if you want to see how any of it works.
          </p>
        </div>
      </div>
    </section>
  );
}
