import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { PYQ_PAPERS } from "@/constants/pyqPapers";
import { PRACTICE_SUBJECTS } from "@/constants/practiceChapters";
import { ENV } from "@/config/env";

export const metadata: Metadata = {
  title: "All Pages",
  description:
    "Complete index of all pages on StudyNaksha — CAT prep resources, PYQ papers from 1990 to 2025, and chapter-level practice.",
  alternates: { canonical: `${ENV.SITE_URL}/sitemap-page` },
};

type PyqGroup = (typeof PYQ_PAPERS)[number][];

const pyqByYear = PYQ_PAPERS.reduce<Record<number, PyqGroup>>((acc, p) => {
  if (!acc[p.examYear]) acc[p.examYear] = [];
  acc[p.examYear].push(p);
  return acc;
}, {});

const years = Object.keys(pyqByYear)
  .map(Number)
  .sort((a, b) => b - a);

const HUB_PAGES = [
  { href: "/cat-prep", label: "CAT Prep Home" },
  { href: "/cat-prep/how-to-prepare", label: "How to Prepare for CAT" },
  { href: "/cat-prep/pyq", label: "PYQ Papers Hub" },
  { href: "/cat-prep/practice", label: "Practice Hub" },
  { href: "/cat-prep/daily-dose/essay", label: "Daily Essay" },
  { href: "/cat-prep/daily-dose/challenge", label: "Daily Challenge" },
];

const SECTION_LABELS: Record<string, string> = {
  Quant: "Quantitative Ability",
  DILR: "Data Interpretation & Logical Reasoning",
  VARC: "Verbal Ability & Reading Comprehension",
};

function chapterHref(
  section: string,
  topicSlug: string,
  chapterSlug: string
): string | null {
  if (section === "Quant") return `/cat-prep/practice/quant/${topicSlug}/${chapterSlug}`;
  if (section === "DILR") return `/cat-prep/practice/dilr/${chapterSlug}/1`;
  if (section === "VARC" && chapterSlug === "reading-comprehensions")
    return `/cat-prep/practice/varc/reading-comprehensions/1`;
  return null;
}

export default function SitemapPage() {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "48px 24px 80px",
        fontFamily: "system-ui, sans-serif",
        color: "#1E3A5F",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>Site Map</h1>
      <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 48px" }}>
        All pages on StudyNaksha.{" "}
        <Link href="/cat-prep" style={{ color: "#3B82F6", textDecoration: "none" }}>
          Go to CAT Prep →
        </Link>
      </p>

      {/* Hub pages */}
      <Section title="Getting Started">
        <ul style={listStyle}>
          {HUB_PAGES.map(({ href, label }) => (
            <li key={href}>
              <LinkRow href={href} label={label} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Practice */}
      <Section title="Practice">
        {PRACTICE_SUBJECTS.map((subject) => (
          <div key={subject.section} style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F766E", margin: "0 0 10px" }}>
              {SECTION_LABELS[subject.section] ?? subject.section}
            </h3>
            {subject.topics.map((topic) => (
              <div key={topic.slug} style={{ paddingLeft: 12, marginBottom: 10 }}>
                {subject.topics.length > 1 && (
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    {topic.name}
                  </div>
                )}
                <ul style={listStyle}>
                  {topic.chapters.map((chapter) => {
                    const href = chapterHref(subject.section, topic.slug, chapter.slug);
                    return (
                      <li key={chapter.slug} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        {href ? (
                          <Link href={href} style={linkStyle}>
                            {chapter.name}
                          </Link>
                        ) : (
                          <span style={{ color: "#94A3B8", fontSize: 14 }}>{chapter.name}</span>
                        )}
                        <span style={{ color: "#CBD5E1", fontSize: 12 }}>
                          {chapter.questionCount}+ q
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </Section>

      {/* PYQ papers */}
      <Section title={`CAT Previous Year Papers — ${PYQ_PAPERS.length} papers`}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px 32px",
          }}
        >
          {years.map((year) => (
            <div key={year}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                CAT {year}
              </div>
              <ul style={listStyle}>
                {pyqByYear[year].map((p) => (
                  <li key={p.slug}>
                    <Link href={`/cat-prep/pyq/${p.slug}`} style={linkStyle}>
                      {p.examSlot ? `Slot ${p.examSlot}` : `${p.examYear} paper`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#1E3A5F",
          borderBottom: "2px solid #EEF2FF",
          paddingBottom: 8,
          margin: "0 0 20px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function LinkRow({ href, label }: { href: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <Link href={href} style={linkStyle}>
        {label}
      </Link>
      <span style={{ color: "#CBD5E1", fontSize: 12 }}>
        {ENV.SITE_URL}{href}
      </span>
    </span>
  );
}

const listStyle: CSSProperties = {
  listStyle: "none",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const linkStyle: CSSProperties = {
  color: "#3B82F6",
  textDecoration: "none",
  fontSize: 14,
};
