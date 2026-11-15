// page — one VARC reading-comprehension passage and its questions
import { notFound } from "next/navigation";
import Header from "@/app/cat-prep/components/Header";
import Footer from "@/app/cat-prep/components/Footer";
import type { Metadata } from "next";
import { fetchRcPassage } from "@/lib/practiceQueries";
import { getDb } from "@/lib/mongodb";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";
import { buildLearningResourceSchema } from "@/app/cat-prep/lib/nodeMetadata";
import RcPlayer from "./RcPlayer";
import Link from "next/link";

type Props = { params: Promise<{ rcNumber: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rcNumber } = await params;
  // The old title never contained "CAT", so it competed for "reading comprehension 12".
  const title = `CAT Reading Comprehension Practice: Passage ${rcNumber}`;
  const description = `Practise CAT VARC reading comprehension with passage ${rcNumber} and its questions. Detailed solutions, free, no sign-up needed.`;
  return {
    title,
    description,
    alternates: { canonical: `${ENV.SITE_URL}/cat-prep/practice/varc/reading-comprehensions/${rcNumber}` },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

async function getTotalRcCount(): Promise<number> {
  const db = await getDb();
  return db.collection("percentyl_rcs").countDocuments();
}

export default async function RcPage({ params }: Props) {
  const { rcNumber } = await params;
  const num = parseInt(rcNumber, 10);
  if (isNaN(num) || num < 1) notFound();

  const [passage, total] = await Promise.all([fetchRcPassage(num), getTotalRcCount()]);
  if (!passage) notFound();

  const pageUrl = `${ENV.SITE_URL}/cat-prep/practice/varc/reading-comprehensions/${rcNumber}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "CAT Prep", item: `${ENV.SITE_URL}/cat-prep` },
        { "@type": "ListItem", position: 2, name: "VARC Practice", item: `${ENV.SITE_URL}/cat-prep/practice/varc` },
        { "@type": "ListItem", position: 3, name: "Reading Comprehensions", item: `${ENV.SITE_URL}/cat-prep/practice/varc/reading-comprehensions` },
        { "@type": "ListItem", position: 4, name: `Passage ${rcNumber}`, item: pageUrl },
      ],
    },
    buildLearningResourceSchema(
      `Reading Comprehension ${rcNumber} — VARC Practice`,
      `Practise CAT Reading Comprehension passage ${rcNumber}. Timed RC practice with detailed solutions — free on StudyNaksha.`,
      pageUrl
    ),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <Header />
      <div
        style={{
          background: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
          padding: "24px 24px 28px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 6 }}>
            <Link href="/cat-prep" style={{ color: "var(--ink-faint)", textDecoration: "none" }}>
              CAT Prep
            </Link>
            {" / "}
            <span style={{ color: "var(--ink-soft)" }}>Practice</span>
            {" / "}
            <span style={{ color: "var(--ink-soft)" }}>VARC</span>
            {" / "}
            <span style={{ color: "var(--caution-text)", fontWeight: 600 }}>Reading Comprehensions</span>
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(26px,3.4vw,34px)", margin: 0, color: "var(--ink)" }}
          >
            Reading Comprehension
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4, marginBottom: 0 }}>
            Passage {num} of {total}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <RcPlayer passage={passage} totalPassages={total} storageKey={`varc-rc-${num}`} />
      </div>
    </div>
      <Footer />
    </>
  );
}
