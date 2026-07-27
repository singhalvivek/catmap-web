import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchPyqPaper, fetchPyqPaperSolutions } from "@/lib/pyqQueries";
import { PYQ_PAPERS, pyqPaperLabel } from "@/constants/pyqPapers";
import { ENV } from "@/config/env";
import PyqPaperPlayer from "./PyqPaperPlayer";
import PyqPaperSolutions from "./PyqPaperSolutions";

type Props = { params: Promise<{ paperSlug: string }> };

export function generateStaticParams() {
  return PYQ_PAPERS.map((p) => ({ paperSlug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paperSlug } = await params;
  const paper = await fetchPyqPaper(paperSlug);
  if (!paper) return { title: "PYQ Paper | StudyNaksha" };
  const label = pyqPaperLabel(paper);
  const title = `${label} — CAT Previous Year Paper | StudyNaksha`;
  const description = `Practice ${label} question by question with answers and explanations. Free CAT previous-year paper on StudyNaksha.`;
  return {
    title,
    description,
    alternates: { canonical: `${ENV.SITE_URL}/cat-prep/pyq/${paperSlug}` },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function PyqPaperPage({ params }: Props) {
  const { paperSlug } = await params;
  // Two queries rather than one derived shape: the player's answer-free paper stays
  // excluded at the query level, so a solution can't reach it by a mapping slip.
  const [paper, solvedPaper] = await Promise.all([
    fetchPyqPaper(paperSlug),
    fetchPyqPaperSolutions(paperSlug),
  ]);
  if (!paper) notFound();

  const label = pyqPaperLabel(paper);
  const totalQuestions = paper.sections.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
      <div
        style={{
          background: "linear-gradient(160deg, #EEF2FF 0%, #F0FDFA 100%)",
          padding: "24px 24px 28px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
            <Link href="/cat-prep" style={{ color: "#94A3B8", textDecoration: "none" }}>
              CAT Prep
            </Link>
            {" / "}
            <Link href="/cat-prep/pyq" style={{ color: "#94A3B8", textDecoration: "none" }}>
              PYQ
            </Link>
            {" / "}
            <span style={{ color: "#1E3A5F", fontWeight: 600 }}>{label}</span>
          </div>
          <h1
            className="font-extrabold text-trust-navy"
            style={{ fontSize: "clamp(20px,3vw,28px)", margin: 0, letterSpacing: "-0.3px" }}
          >
            {label}
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4, marginBottom: 0 }}>
            {totalQuestions} questions
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <PyqPaperPlayer paper={paper} />
        {solvedPaper && <PyqPaperSolutions paper={solvedPaper} label={label} />}
      </div>
    </div>
  );
}
