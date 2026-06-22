import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoadmapNav from "../components/RoadmapNav";

export const metadata: Metadata = {
  title: "How to Prepare for CAT | StudyNaksha",
  description:
    "An honest, no-fluff guide to CAT preparation — when to start, whether you need coaching, what score to target, and how to use PYQ practice to build real exam readiness.",
};

const SCORE_TARGETS = [
  {
    percentile: "99%+",
    label: "IIM A, B, C",
    color: "#1E3A5F",
    bg: "#EEF2FF",
    detail:
      "Top 1% of ~3 lakh test-takers. You need near-perfection across all three sections with no sectional weak spots. Expect 3–5 years of high-performance B-school competition post-selection too.",
  },
  {
    percentile: "97–99%",
    label: "IIM L, K, I + XLRI, FMS",
    color: "#0F766E",
    bg: "#F0FDFA",
    detail:
      "Excellent outcome. These institutes have strong placements. Most serious candidates with 12 months of focused prep land here. Worth targeting even if IIM A is the dream.",
  },
  {
    percentile: "90–97%",
    label: "Newer IIMs + MDI, SPJIMR, IIFT",
    color: "#92400E",
    bg: "#FFFBEB",
    detail:
      "Solid MBA destinations with good ROI. At 90%+, you have real options. Many working professionals comfortably reach this band with 6 focused months.",
  },
  {
    percentile: "80–90%",
    label: "Good non-IIM B-schools",
    color: "#6B7280",
    bg: "#F8FAFC",
    detail:
      "Respectable, especially if other profile factors are strong. Sectional cutoffs matter here — an 85 overall with a weak VARC can still eliminate you from certain colleges.",
  },
];

const COACHING_HONEST = [
  {
    title: "Coaching is worth it if…",
    accent: "#14B8A6",
    points: [
      "You've never prepared for a competitive exam and need a structured baseline",
      "You're a working professional who needs imposed deadlines to study",
      "You're severely weak in one section (QA especially) and need expert doubt resolution",
      "Peer competition and a cohort keeps you motivated",
    ],
  },
  {
    title: "Coaching is NOT necessary if…",
    accent: "#F59E0B",
    points: [
      "You're self-disciplined and can build a study schedule you'll actually follow",
      "You have access to good books, free YouTube resources, and a test series",
      "Your baseline is already decent (scored well in 10th/12th Math, strong English reader)",
      "Budget is a real constraint — top coaching runs ₹60,000–₹1.5L, and ROI is not guaranteed",
    ],
  },
];

const PHASES = [
  {
    phase: "Phase 1",
    months: "Months 1–3",
    title: "Build the foundation",
    tasks: [
      "Take one diagnostic mock test to find your real starting point — not your imagined one",
      "Cover VARC: read one editorial per day (Hindu, Mint, Aeon), tackle RC question types",
      "Cover QA: Arithmetic → Algebra → Geometry. Use standard books (Arun Sharma or Sarvesh Verma)",
      "Cover DILR: practice 1 set daily, focus on LR puzzles and DI caselets",
      "Take a sectional mock at the end of each month",
    ],
  },
  {
    phase: "Phase 2",
    months: "Months 4–6",
    title: "Go deeper and test often",
    tasks: [
      "Move to advanced topics within each section; plug the weak spots from Phase 1",
      "Solve 2 sectional mocks per week per section",
      "Start attempting PYQ papers — they show what the exam actually tests vs. what textbooks cover",
      "Take 1 full mock per week from Month 5 onwards",
      "Maintain an error log: track the same mistakes recurring across mocks",
    ],
  },
  {
    phase: "Phase 3",
    months: "Months 7–9",
    title: "Mock-heavy, analysis-first",
    tasks: [
      "Target 2 full-length mocks per week — one on weekend, one mid-week",
      "Spend as much time analyzing each mock as you spent taking it",
      "Solve CAT PYQs from the last 5 years in mock-test mode for calibration",
      "Identify your attempt strategy per section: which question types to skip, which to lock in on",
      "Don't start new topics. Double down on your strengths; manage your weaknesses",
    ],
  },
  {
    phase: "Phase 4",
    months: "Final 4–6 weeks",
    title: "Sharpen, don't scramble",
    tasks: [
      "3 full mocks per week — timed, no interruptions, phone away",
      "Review your best and worst mock performances to understand what worked",
      "Revise formulas and shortcuts; don't attempt to learn anything new",
      "Simulate actual exam conditions: same time slot (afternoon), no shortcuts",
      "Solve PYQs from earlier years you haven't touched yet",
    ],
  },
];

const SECTION_TIPS = [
  {
    section: "VARC",
    full: "Verbal Ability & Reading Comprehension",
    icon: "📖",
    tip: "RC is ~75% of VARC. The only reliable way to improve is to read widely and often — not to practice 200 RC passages with tricks. Read good prose daily for 3–6 months and comprehension becomes intuitive. VA (para jumbles, odd one out) can be cracked with pattern recognition — practice past papers.",
    weight: "24 questions (~40% of total score)",
  },
  {
    section: "DILR",
    full: "Data Interpretation & Logical Reasoning",
    icon: "🧩",
    tip: "The most variable section — difficulty swings wildly year to year. CAT 2021 DILR was notoriously brutal; 2023 was relatively gentler. Train your set-selection instinct: spend 90 seconds reading a set, decide if it's worth attempting. Don't brute-force every set. Speed comes from practice, not from reading theory.",
    weight: "20 questions (~33% of total score)",
  },
  {
    section: "QA",
    full: "Quantitative Ability",
    icon: "📐",
    tip: "The most learnable section if you're willing to put in the arithmetic. Arithmetic alone (percentages, ratios, TSD, PnC) covers 50%+ of questions. Don't panic if Geometry or Number Theory feels hard early — they can be learned. Target accuracy over speed in early prep, speed follows naturally.",
    weight: "22 questions (~37% of total score)",
  },
];

const SN_VALUE = [
  {
    title: "PYQ papers from 1990 to 2025",
    body: "Every official CAT paper, fully digitised. The only free resource with this depth and coverage.",
  },
  {
    title: "Practice mode for concept reinforcement",
    body: "Work through any paper question by question with instant answers and detailed explanations — ideal for focused revision.",
  },
  {
    title: "Mock test mode for real simulation",
    body: "Sit the full paper under timed exam conditions: three sections, per-section timers, no answer peeking. Same format as the actual CAT.",
  },
  {
    title: "Progress tracking across papers",
    body: "See how your PYQ solve rate changes over time. Know where you stand, not just where you hope to be.",
  },
];

const MISTAKES = [
  {
    mistake: "Starting with mocks before covering basics",
    fix: "A mock score before concepts are solid is meaningless noise. Build foundation first, then add mocks.",
  },
  {
    mistake: "Collecting resources instead of using them",
    fix: "Three good books and one test series beat 12 books you never finish. More material ≠ more prep.",
  },
  {
    mistake: "Taking mocks without analyzing them",
    fix: "Analysis is where the learning happens. A mock you review for 2 hours is worth more than three you just score.",
  },
  {
    mistake: "Ignoring sectional cutoffs",
    fix: "A 97 overall with a 60 percentile VARC gets you nowhere in most top colleges. All three sections matter.",
  },
  {
    mistake: "Burning out in Month 3 and disappearing",
    fix: "Consistency over intensity. 2 focused hours daily beats 8-hour Sunday sessions. CAT rewards the long game.",
  },
];

export default function HowToPreparePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFFDF8" }}>
      <Header />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(160deg, #EEF2FF 0%, #F0FDFA 100%)",
          padding: "36px 24px 32px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="font-semibold mb-1" style={{ fontSize: 12, color: "#94A3B8", letterSpacing: "0.5px" }}>
            CAT
          </div>

          <h1
            className="font-extrabold text-trust-navy"
            style={{ fontSize: "clamp(24px,4vw,36px)", margin: "0 0 6px", letterSpacing: "-0.5px" }}
          >
            How to Prepare for CAT
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: "0 0 16px", maxWidth: 620 }}>
            A straight-talk guide — no hype, no coaching ads. What score to aim for, whether you need
            coaching, how to plan your months, and what actually moves the needle.
          </p>

          {/* Nav pills */}
          <RoadmapNav />
        </div>
      </div>

      <div className="flex-1" style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "40px 24px 64px" }}>

        {/* Section 1 — Know what you're aiming for */}
        <section style={{ marginBottom: 56 }}>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 20, margin: "0 0 6px", letterSpacing: "-0.3px" }}
          >
            Step 1: Know what score you're actually aiming for
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.65 }}>
            CAT aspirants often say "I want IIM A" without understanding what percentile that requires — or
            what a more realistic target looks like. Set a concrete goal first. Everything else (timeline,
            effort level, coaching decision) follows from that.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SCORE_TARGETS.map((t) => (
              <div
                key={t.percentile}
                style={{
                  background: t.bg,
                  borderRadius: 12,
                  padding: "16px 18px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div
                    className="font-extrabold"
                    style={{ fontSize: 17, color: t.color, lineHeight: 1 }}
                  >
                    {t.percentile}
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>percentile</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold" style={{ fontSize: 13, color: t.color, marginBottom: 4 }}>
                    {t.label}
                  </div>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.55 }}>{t.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "#94A3B8", margin: "16px 0 0", lineHeight: 1.6 }}>
            Note: These are General category cutoffs. OBC/EWS cutoffs are ~10–15 percentile points lower;
            SC/ST cutoffs are considerably lower still. Category matters — factor yours in.
          </p>
        </section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #E2E8F0", marginBottom: 56 }} />

        {/* Section 2 — Coaching vs self-study */}
        <section style={{ marginBottom: 56 }}>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 20, margin: "0 0 6px", letterSpacing: "-0.3px" }}
          >
            Step 2: Coaching or self-study?
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.65 }}>
            The honest answer: <strong>coaching is a tool, not a requirement.</strong> Every year, multiple
            99%ilers crack CAT through self-study. And every year, thousands of coaching students underperform
            because structure without effort is worthless. The real question is: which environment helps
            you stay consistent?
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {COACHING_HONEST.map((block) => (
              <div
                key={block.title}
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: "18px 18px",
                  borderTop: `3px solid ${block.accent}`,
                }}
              >
                <div
                  className="font-bold"
                  style={{ fontSize: 13, color: "#1E3A5F", marginBottom: 12 }}
                >
                  {block.title}
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                  {block.points.map((p) => (
                    <li key={p} style={{ fontSize: 13, color: "#64748B", marginBottom: 7, lineHeight: 1.55 }}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 20,
              background: "#FFFBEB",
              borderRadius: 10,
              padding: "14px 16px",
              borderLeft: "3px solid #F59E0B",
            }}
          >
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: "#92400E" }}>The hybrid path</strong> is often the smartest: take
              coaching only for your weakest section (usually QA for engineers, DILR for commerce students),
              and self-prepare the rest. This cuts cost, keeps flexibility, and still gives you doubt
              resolution where you most need it.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #E2E8F0", marginBottom: 56 }} />

        {/* Section 3 — Preparation phases */}
        <section style={{ marginBottom: 56 }}>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 20, margin: "0 0 6px", letterSpacing: "-0.3px" }}
          >
            Step 3: Plan your preparation in phases
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.65 }}>
            Most serious aspirants start 9–12 months before the exam (CAT is held in November). If you have
            less time, compress — but don't skip phases. The sequence matters more than the duration.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PHASES.map((p, i) => (
              <div
                key={p.phase}
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: "18px 20px",
                  borderLeft: "3px solid #14B8A6",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                  <div
                    className="font-extrabold"
                    style={{
                      fontSize: 11,
                      color: "#14B8A6",
                      background: "#F0FDFA",
                      padding: "2px 8px",
                      borderRadius: 20,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {p.phase} · {p.months}
                  </div>
                  <div className="font-bold text-trust-navy" style={{ fontSize: 14 }}>
                    {p.title}
                  </div>
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
                  {p.tasks.map((task) => (
                    <li key={task} style={{ fontSize: 13, color: "#64748B", marginBottom: 6, lineHeight: 1.55 }}>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #E2E8F0", marginBottom: 56 }} />

        {/* Section 4 — Section-wise tips */}
        <section style={{ marginBottom: 56 }}>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 20, margin: "0 0 6px", letterSpacing: "-0.3px" }}
          >
            Step 4: What each section actually requires
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.65 }}>
            CAT has three sections with separate time limits — 40 minutes each. You cannot skip between
            sections mid-exam. Each section rewards a different type of preparation.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SECTION_TIPS.map((s) => (
              <div
                key={s.section}
                style={{
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: "18px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span className="font-extrabold text-trust-navy" style={{ fontSize: 14 }}>
                        {s.section}
                      </span>
                      <span style={{ fontSize: 12, color: "#94A3B8" }}>— {s.full}</span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#14B8A6",
                          background: "#F0FDFA",
                          padding: "1px 7px",
                          borderRadius: 20,
                          fontWeight: 600,
                        }}
                      >
                        {s.weight}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.6 }}>{s.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #E2E8F0", marginBottom: 56 }} />

        {/* Section 5 — Where StudyNaksha fits */}
        <section style={{ marginBottom: 56 }}>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 20, margin: "0 0 6px", letterSpacing: "-0.3px" }}
          >
            Where StudyNaksha fits in your prep
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.65 }}>
            StudyNaksha is built specifically for the Phase 2–4 work: PYQ practice and mock-test
            simulation. It doesn't replace a textbook for concepts, and it doesn't compete with coaching.
            It fills the gap that most aspirants neglect — actually solving official past papers, not just
            knowing they exist.
          </p>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}
          >
            {SN_VALUE.map((item) => (
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

          <div style={{ marginTop: 28 }}>
            <Link
              href="/cat-prep/pyq"
              style={{
                display: "inline-block",
                background: "#1E3A5F",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 24px",
                borderRadius: 8,
                textDecoration: "none",
                letterSpacing: "-0.2px",
              }}
            >
              Browse PYQ Papers →
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #E2E8F0", marginBottom: 56 }} />

        {/* Section 6 — Common mistakes */}
        <section style={{ marginBottom: 56 }}>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 20, margin: "0 0 6px", letterSpacing: "-0.3px" }}
          >
            Mistakes most aspirants make (and how to avoid them)
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.65 }}>
            These patterns repeat every year. Recognise them early.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MISTAKES.map((m) => (
              <div
                key={m.mistake}
                style={{
                  borderRadius: 10,
                  padding: "14px 16px",
                  background: "#F8FAFC",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
                className="flex-col sm:flex-row"
              >
                <div>
                  <div style={{ fontSize: 11, color: "#EF4444", fontWeight: 700, marginBottom: 3, letterSpacing: "0.3px" }}>
                    MISTAKE
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
                    {m.mistake}
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#14B8A6", fontWeight: 700, marginBottom: 3, letterSpacing: "0.3px" }}>
                    INSTEAD
                  </div>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.55 }}>{m.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div
          style={{
            background: "linear-gradient(135deg, #1E3A5F 0%, #0F5132 100%)",
            borderRadius: 16,
            padding: "32px 28px",
            textAlign: "center",
          }}
        >
          <h3
            className="font-extrabold"
            style={{ fontSize: 20, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.3px" }}
          >
            Ready to put this into practice?
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 0 24px", lineHeight: 1.6 }}>
            Start with a CAT PYQ paper. It'll tell you more about where you stand than any mock of
            coaching material — because it's the real thing.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/cat-prep/pyq"
              style={{
                background: "#14B8A6",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 24px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Browse PYQ Papers
            </Link>
            <Link
              href="/cat-prep"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                padding: "12px 24px",
                borderRadius: 8,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              View CAT Roadmap
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
