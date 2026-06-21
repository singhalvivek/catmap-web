import type { Metadata } from "next";
import Link from "next/link";
import { fetchPyqPapersIndex } from "@/lib/pyqQueries";
import { ProgressProvider } from "../lib/ProgressContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PyqPapersList from "../components/PyqPapersList";
import PyqProgressBar from "./PyqProgressBar";

export const metadata: Metadata = {
  title: "CAT Previous Year Question Papers (PYQ) 1990–2025 | StudyNaksha",
  description:
    "Free CAT previous year question papers from 1990 to 2025 with detailed solutions. Practice question by question or attempt a full timed mock test. Covers VARC, DILR and Quant sections.",
};

const WHY_SOLVE = [
  {
    title: "See the real difficulty",
    body: "CAT questions are distinctly different from coaching material. Only official papers reveal what the exam makers actually test.",
  },
  {
    title: "Spot year-to-year patterns",
    body: "Topic weightage, question types, and difficulty shift across years. Solving a range of papers exposes the trends worth betting on.",
  },
  {
    title: "Build exam stamina",
    body: "Sitting a timed 2-hour paper trains focus and pacing in a way topic drills cannot. Stamina is a skill — it needs practice.",
  },
  {
    title: "Benchmark yourself",
    body: "A mock test score maps to a real percentile band. Know where you stand months before the exam, while there is time to course-correct.",
  },
];

export default async function PyqIndexPage() {
  const papers = await fetchPyqPapersIndex();

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
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span>
              <Link href="/cat-prep" style={{ color: "#94A3B8", textDecoration: "none" }}>
                CAT Prep
              </Link>
              {" / "}
              <span style={{ color: "#1E3A5F", fontWeight: 600 }}>PYQ</span>
            </span>
            <span style={{ color: "#E2E8F0" }}>·</span>
            <Link
              href="/cat-prep/how-to-prepare"
              style={{ color: "#14B8A6", textDecoration: "none", fontWeight: 500 }}
            >
              How to Prepare for CAT →
            </Link>
          </div>
          <h1
            className="font-extrabold text-trust-navy"
            style={{ fontSize: "clamp(24px,4vw,36px)", margin: "0 0 6px", letterSpacing: "-0.5px" }}
          >
            CAT Previous Year Question Papers
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: "0 0 16px" }}>
            {papers.length} official papers, 1990–2025 — with detailed solutions. Practice question by question, or
            sit one as a full timed mock test.
          </p>
          <PyqProgressBar />
        </div>
      </div>

      <div className="flex-1" style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "32px 24px" }}>
        {/* Stat strip */}
        <div
          className="flex gap-8 flex-wrap"
          style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #E2E8F0" }}
        >
          {[
            { value: papers.length, label: "past papers" },
            { value: "1990–2025", label: "years covered" },
            { value: "VARC · DILR · QA", label: "sections per paper" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-extrabold text-trust-navy" style={{ fontSize: 22, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mode explanation */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, background: "#EEF2FF", borderRadius: 12, padding: "14px 16px" }}>
            <div className="font-bold text-trust-navy" style={{ fontSize: 13, marginBottom: 4 }}>
              Practice mode
            </div>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
              Work through a paper at your own pace. Each question reveals the answer and explanation after you
              respond — good for targeted revision.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 200, background: "#F0FDFA", borderRadius: 12, padding: "14px 16px" }}>
            <div className="font-bold text-trust-navy" style={{ fontSize: 13, marginBottom: 4 }}>
              Mock test mode
            </div>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
              Sit the full paper under timed exam conditions — three sections (VARC → DILR → QA), no peeking at
              answers until the end. One attempt per paper.
            </p>
          </div>
        </div>

        {/* Paper list */}
        <ProgressProvider>
          <PyqPapersList papers={papers} />
        </ProgressProvider>

        {/* Why solve section */}
        <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #E2E8F0" }}>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 20, margin: "0 0 8px", letterSpacing: "-0.3px" }}
          >
            Why solve CAT previous year papers?
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", lineHeight: 1.6 }}>
            Coaching material prepares you for the syllabus. PYQs prepare you for the exam. Most toppers credit
            solving past papers as the single highest-leverage activity in their preparation.
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}
          >
            {WHY_SOLVE.map((item) => (
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

        {/* About the exam format — helpful for SEO and newer aspirants */}
        <div style={{ marginTop: 48 }}>
          <h2
            className="font-extrabold text-trust-navy"
            style={{ fontSize: 18, margin: "0 0 12px", letterSpacing: "-0.3px" }}
          >
            About the CAT exam format
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, margin: "0 0 12px" }}>
            The Common Admission Test (CAT) is a computer-based national-level entrance exam conducted by the IIMs
            for admission to their MBA and equivalent programmes. The paper is divided into three sections — Verbal
            Ability and Reading Comprehension (VARC), Data Interpretation and Logical Reasoning (DILR), and
            Quantitative Ability (QA) — each with its own time limit.
          </p>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, margin: 0 }}>
            The scoring follows a +3 / −1 scheme for MCQs and +3 / 0 for non-MCQ (TITA) questions. The exam has
            evolved significantly over the decades: from a 165-question paper in the 1990s to a 66-question format
            introduced in 2020. The papers available here span the full history, letting you trace how difficulty
            and style have changed year by year.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
