// page — /cat-prep/how-to-prepare: the written CAT preparation guide
import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoadmapNav from "../components/RoadmapNav";
import { JsonLd } from "@/app/components/JsonLd";
import ScrollReveal from "@/app/components/ScrollReveal";
import { ENV } from "@/config/env";
import { PYQ_PAPERS, PYQ_EARLIEST_YEAR, PYQ_LATEST_YEAR } from "@/constants/pyqPapers";
import {
  COACHING_HONEST,
  GUIDE_FAQS,
  GUIDE_FAQ_SCHEMA,
  GUIDE_SECTIONS,
  MISTAKES,
  PHASES,
  SCORE_TARGETS,
  SECTION_TIPS,
} from "@/constants/catPrepGuide";

export const metadata: Metadata = {
  title: "How to Prepare for CAT",
  description:
    "An honest, no-fluff guide to CAT preparation — when to start, whether you need coaching, what score to target, and how to use PYQ practice to build real exam readiness.",
  alternates: { canonical: `${ENV.SITE_URL}/cat-prep/how-to-prepare` },
};

/** Section headings all render from one array, so they cannot drift from the contents. */
function section(id: string) {
  const found = GUIDE_SECTIONS.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown guide section: ${id}`);
  return found;
}

function SectionHead({ id, step }: { id: string; step?: number }) {
  const { title } = section(id);
  return (
    <>
      {step !== undefined && (
        <p className="ed-kicker" style={{ margin: "0 0 10px" }}>
          Step {step}
        </p>
      )}
      <h2 id={id} className="display guide-heading">
        {title}
      </h2>
    </>
  );
}

export default function HowToPreparePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <Header />
      <JsonLd data={GUIDE_FAQ_SCHEMA} />
      <ScrollReveal />

      {/* Hero */}
      <div className="roadmap-hero">
        <div className="roadmap-hero__inner">
          <p className="ed-kicker" style={{ margin: "0 0 12px" }}>
            CAT preparation
          </p>
          <h1 className="display roadmap-hero__title">How to prepare for CAT</h1>
          <p className="roadmap-hero__subtitle">
            A straight guide, with no hype and no coaching ads: what score to aim for, whether
            you need coaching, how to plan your months, and what actually moves the needle.
          </p>
        </div>
      </div>

      {/*
        The switcher pins here as it does on every other surface. It used to sit inside the
        hero on this page alone — and a sticky element only sticks within its parent's box,
        so on the longest page on the site, six and a half thousand pixels, the way back to
        Learn or Practice scrolled away after the first screen.
      */}
      <div className="roadmap-navbar sticky-under-header">
        <div className="roadmap-navbar__inner">
          <RoadmapNav />
        </div>
      </div>

      <div className="guide">
        {/*
          Contents. Three thousand words with six headings, none of them addressable, and
          no way in except the top — while the page's own search traffic arrives looking for
          one answer in particular.
        */}
        <nav className="guide-contents reveal" aria-label="On this page">
          <p className="ed-kicker" style={{ margin: "0 0 12px" }}>
            On this page
          </p>
          <ol className="guide-contents__list">
            {GUIDE_SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="guide-contents__link">
                  <span className="guide-contents__num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.short}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 1 — the target */}
        <section className="guide-section reveal-fade">
          <SectionHead id="target" step={1} />
          <p className="guide-lede">
            CAT aspirants often say &ldquo;I want IIM A&rdquo; without understanding what
            percentile that requires — or what a more realistic target looks like. Set a
            concrete goal first. Everything else (timeline, effort level, coaching decision)
            follows from that.
          </p>

          {/*
            A ladder, not four tinted blocks. The bands are ordered and the order is the
            point; one of them used to carry --caution-wash, which painted a good outcome
            as a warning.
          */}
          <ol className="guide-ladder">
            {SCORE_TARGETS.map((t) => (
              <li key={t.percentile} className="guide-ladder__row">
                <p className="guide-ladder__figure display">{t.percentile}</p>
                <div>
                  <p className="guide-ladder__label">{t.label}</p>
                  <p className="guide-prose">{t.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="guide-footnote">
            These are General category cutoffs. OBC/EWS cutoffs are ~10–15 percentile points
            lower; SC/ST cutoffs are considerably lower still. Category matters — factor
            yours in.
          </p>
        </section>

        {/* 2 — coaching */}
        <section className="guide-section reveal-fade">
          <SectionHead id="coaching" step={2} />
          <p className="guide-lede">
            The honest answer: <strong>coaching is a tool, not a requirement.</strong> Every
            year, multiple 99%ilers crack CAT through self-study. And every year, thousands of
            coaching students underperform because structure without effort is worthless. The
            real question is: which environment helps you stay consistent?
          </p>

          {/*
            A rule between the two columns, which is the whole of the typographic argument
            the spec asked for here. It used to be a 4px border on one block and a 1px
            border on the other — the page arguing, in the only way it argued anything, for
            the side its own lede argues against.
          */}
          <div className="guide-debate">
            {COACHING_HONEST.map((block) => (
              <div key={block.title} className="guide-debate__side">
                <p className="ed-kicker" style={{ margin: "0 0 10px" }}>
                  {block.kicker}
                </p>
                <p className="display guide-debate__title">{block.title}</p>
                <ul className="guide-list">
                  {block.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="ed-notice">
            <strong>The hybrid path</strong> is often the smartest: take coaching only for your
            weakest section (usually QA for engineers, DILR for commerce students), and
            self-prepare the rest. This cuts cost, keeps flexibility, and still gives you doubt
            resolution where you most need it.
          </p>
        </section>

        {/* 3 — phases */}
        <section className="guide-section reveal-fade">
          <SectionHead id="phases" step={3} />
          <p className="guide-lede">
            Most serious aspirants start 9–12 months before the exam (CAT is held in November).
            If you have less time, compress — but don&rsquo;t skip phases. The sequence matters
            more than the duration.
          </p>

          {/* A sequence, so it is numbered and the months are the figure you scan for. */}
          <ol className="guide-phases">
            {PHASES.map((p, i) => (
              <li key={p.months} className="guide-phase">
                <div className="guide-phase__mark">
                  <span className="guide-phase__num display">{i + 1}</span>
                  <span className="guide-phase__months">{p.months}</span>
                </div>
                <div>
                  <p className="guide-phase__title">{p.title}</p>
                  <ul className="guide-list">
                    {p.tasks.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 4 — the three sections */}
        <section className="guide-section reveal-fade">
          <SectionHead id="sections" step={4} />
          <p className="guide-lede">
            CAT has three sections with separate time limits — 40 minutes each. You cannot skip
            between sections mid-exam. Each section rewards a different type of preparation.
          </p>

          <div className="guide-sections">
            {SECTION_TIPS.map((s) => (
              <article key={s.section} className="guide-paper">
                <p className="guide-paper__abbr display">{s.section}</p>
                <div>
                  <p className="guide-paper__full">{s.full}</p>
                  <p className="guide-paper__share">{s.share}</p>
                  <p className="guide-prose">{s.tip}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5 — where this site fits */}
        <section className="guide-section reveal-fade">
          <SectionHead id="studynaksha" />
          <p className="guide-lede">
            StudyNaksha is built specifically for the Phase 2–4 work: PYQ practice and mock-test
            simulation. It doesn&rsquo;t replace a textbook for concepts, and it doesn&rsquo;t
            compete with coaching. It fills the gap that most aspirants neglect — actually
            solving official past papers, not just knowing they exist.
          </p>

          <dl className="guide-value">
            {/* The count and the range are derived. The copy here used to claim every
                official CAT paper, for a collection with twelve years missing. */}
            <div>
              <dt>
                {PYQ_PAPERS.length} past papers, {PYQ_EARLIEST_YEAR} to {PYQ_LATEST_YEAR}
              </dt>
              <dd>
                Every official paper we have been able to digitise, free and complete. Some
                years in that range have no paper available.
              </dd>
            </div>
            <div>
              <dt>Practice mode for concept reinforcement</dt>
              <dd>
                Work through any paper question by question with instant answers and detailed
                explanations — ideal for focused revision.
              </dd>
            </div>
            <div>
              <dt>Mock test mode for real simulation</dt>
              <dd>
                Sit the full paper under timed exam conditions: three sections, per-section
                timers, no answer peeking. Same format as the actual CAT.
              </dd>
            </div>
            <div>
              <dt>Progress tracking across papers</dt>
              <dd>
                See how your PYQ solve rate changes over time. Know where you stand, not just
                where you hope to be.
              </dd>
            </div>
          </dl>
        </section>

        {/* 6 — mistakes */}
        <section className="guide-section reveal-fade">
          <SectionHead id="mistakes" />
          <p className="guide-lede">
            These patterns repeat every year. Recognise them early.
          </p>

          {/*
            Two columns from 600px, one below it. This was gridTemplateColumns: "1fr 1fr"
            set inline, with flex-col sm:flex-row beside it that could never override an
            inline grid — so at 390px each column measured 147px, about twenty characters
            a line, five times over.
          */}
          <ul className="guide-mistakes">
            {MISTAKES.map((m) => (
              <li key={m.mistake} className="guide-mistake">
                <div>
                  <p className="guide-mistake__tag" data-kind="mistake">
                    Mistake
                  </p>
                  <p className="guide-mistake__text">{m.mistake}</p>
                </div>
                <div>
                  <p className="guide-mistake__tag" data-kind="fix">
                    Instead
                  </p>
                  <p className="guide-prose">{m.fix}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 7 — the FAQ the schema has always declared */}
        <section className="guide-section reveal-fade">
          <SectionHead id="questions" />
          <p className="guide-lede">
            The five questions this page is most often found by.
          </p>

          <div className="guide-faqs">
            {GUIDE_FAQS.map((f) => (
              <details key={f.q} className="guide-faq">
                <summary className="guide-faq__q">
                  <span>{f.q}</span>
                  <span className="guide-faq__mark" aria-hidden="true" />
                </summary>
                <p className="guide-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="ed-invert reveal" style={{ padding: "36px 28px" }}>
          <p className="ed-kicker" style={{ margin: "0 0 12px" }}>
            Next step
          </p>
          <h2 className="display" style={{ fontSize: 26, color: "var(--invert-ink)", margin: "0 0 10px" }}>
            Ready to put this into practice?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--invert-ink-soft)",
              margin: "0 0 26px",
              lineHeight: 1.6,
              maxWidth: "60ch",
            }}
          >
            Start with a real past paper. It will tell you more about where you stand than any
            coaching mock, because it is the actual exam.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/*
              The band is ink, so the primary action inverts: bright accent with ink type.
              White on --accent is 4.19:1 and fails AA, which is why it is never used as a
              button fill anywhere in this system.
            */}
            <Link
              href="/cat-prep/pyq"
              className="ed-btn"
              style={{ background: "var(--accent-bright)", color: "var(--on-accent)" }}
            >
              Browse past papers
            </Link>
            <Link href="/cat-prep" className="ed-btn" data-weight="on-dark">
              Open the syllabus
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
