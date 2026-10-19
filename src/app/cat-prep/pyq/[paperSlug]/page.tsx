// page — one PYQ paper, server-rendered with every question and solution
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchPyqPaperSolutions } from "@/lib/pyqQueries";
import { PYQ_PAPERS, pyqPaperLabel, pyqPaperSearchName } from "@/constants/pyqPapers";
import { ENV } from "@/config/env";
import Header from "@/app/cat-prep/components/Header";
import PyqPaperReader from "./PyqPaperReader";

type Props = { params: Promise<{ paperSlug: string }> };

export function generateStaticParams() {
  return PYQ_PAPERS.map((p) => ({ paperSlug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paperSlug } = await params;
  const paper = await fetchPyqPaperSolutions(paperSlug);
  if (!paper) return { title: "PYQ Paper" };
  const name = pyqPaperSearchName(paper);
  const questionCount = paper.sections.reduce((sum, s) => sum + s.questions.length, 0);
  // "<year> <slot> question paper with solutions" is the phrase people actually search,
  // and it already matches the URL slug; the old title said "CAT" twice and never used it.
  const title = `${name} Question Paper with Solutions`;
  const description = `All ${questionCount} questions from the ${name} CAT paper with answer keys and detailed explanations. Solve VARC, DILR and Quant online free, or attempt it as a timed mock.`;
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
  const paper = await fetchPyqPaperSolutions(paperSlug);
  if (!paper) notFound();

  const label = pyqPaperLabel(paper);
  const totalQuestions = paper.sections.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Header />

      <div
        style={{
          background: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
          padding: "24px 24px 28px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 6 }}>
            <Link href="/cat-prep" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>
              CAT Prep
            </Link>
            {" / "}
            <Link href="/cat-prep/pyq" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>
              PYQ
            </Link>
            {" / "}
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>{label}</span>
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(26px,3.4vw,34px)", color: "var(--ink)", margin: 0 }}
          >
            {label}
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4, marginBottom: 0 }}>
            {totalQuestions} questions with answers and explanations
          </p>
          <Link
            href={`/cat-prep/pyq/${paperSlug}/mock`}
            className="font-bold"
            style={{
              display: "inline-block",
              marginTop: 14,
              padding: "9px 18px",
              border: "1.5px solid var(--ink)",
              background: "var(--ink)",
              color: "#fff",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Take this as a timed mock →
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 48px" }}>
        <PyqPaperReader paper={paper} />
      </div>
    </div>
  );
}
