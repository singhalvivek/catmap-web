// page — /cat-prep/daily-dose/essay/[date]; past essay discussion, view-only (no submission)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchDailyEssay, getEssaySubmissions, getPastEssayDates } from "@/lib/essayQueries";
import { getTodayIST } from "@/lib/dateIST";
import DailyEssayPageClient from "../components/DailyEssayPageClient";
import { JsonLd } from "@/app/components/JsonLd";
import { ENV } from "@/config/env";

// Past essays are prerendered, so `revalidate` is no longer inert — it refreshes the
// response counts that change as people keep replying. Dates not in the build list
// (an essay that went past midnight since) still render on demand via dynamicParams.
export const revalidate = 3600;

// Every past essay, so the 37 archive pages ship as static HTML instead of `no-store`.
// getTodayIST() is read at build time; anything newer falls through to on-demand.
export async function generateStaticParams() {
  const dates = await getPastEssayDates(getTodayIST()).catch(() => []);
  return dates.map((date) => ({ date }));
}

type Props = { params: Promise<{ date: string }> };

/** Past dates only, and only well-formed ones — this route must never pick a new essay. */
function isViewablePastDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date < getTodayIST();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const essay = isViewablePastDate(date) ? await fetchDailyEssay(date).catch(() => null) : null;
  if (!essay) {
    return { title: `Essay – ${date}` };
  }
  const title = `${essay.title} — Daily Essay`;
  const description = essay.excerpt || `Read the community essay discussion from ${date} on StudyNaksha.`;
  return {
    title,
    description,
    alternates: { canonical: `${ENV.SITE_URL}/cat-prep/daily-dose/essay/${date}` },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function PastEssayPage({ params }: Props) {
  const { date } = await params;

  // Past only — today's essay lives on the canonical page
  if (!isViewablePastDate(date)) notFound();

  const essay = await fetchDailyEssay(date).catch(() => null);
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
