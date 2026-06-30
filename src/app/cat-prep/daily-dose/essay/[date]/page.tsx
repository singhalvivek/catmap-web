// page — /cat-prep/daily-dose/essay/[date]; past essay discussion, view-only (no submission)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchOrPickDailyEssay, getEssaySubmissions } from "@/lib/essayQueries";
import DailyEssayPageClient from "../components/DailyEssayPageClient";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";

export const revalidate = 86400;

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const essay = await fetchOrPickDailyEssay(date).catch(() => null);
  if (!essay) {
    return { title: `Essay – ${date} | StudyNaksha` };
  }
  const title = `${essay.title} — Daily Essay | StudyNaksha`;
  const description = essay.excerpt || `Read the community essay discussion from ${date} on StudyNaksha.`;
  return {
    title,
    description,
    alternates: { canonical: `${ENV.SITE_URL}/cat-prep/daily-dose/essay/${date}` },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

function getTodayIST(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default async function PastEssayPage({ params }: Props) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  // Past only — redirect today's date to the canonical page
  const today = getTodayIST();
  if (date >= today) notFound();

  const essay = await fetchOrPickDailyEssay(date).catch(() => null);
  if (!essay) notFound();

  // Past essays: fetch all submissions publicly (no submit gate needed)
  const submissions = await getEssaySubmissions(date, "").catch(() => []);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.excerpt,
    datePublished: date,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: "StudyNaksha",
      url: ENV.SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${ENV.SITE_URL}/cat-prep/daily-dose/essay/${date}`,
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <DailyEssayPageClient
        essay={essay}
        date={date}
        viewOnly
        initialSubmissions={submissions}
      />
    </>
  );
}
