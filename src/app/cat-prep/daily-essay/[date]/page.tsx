// page — /cat-prep/daily-essay/[date]; past essay discussion, view-only (no submission)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchOrPickDailyEssay, getEssaySubmissions } from "@/lib/essayQueries";
import DailyEssayPageClient from "../components/DailyEssayPageClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `Essay – ${date} | StudyNaksha`,
    description: "Read the Aeon essay and community responses from this day.",
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

  return (
    <DailyEssayPageClient
      essay={essay}
      date={date}
      viewOnly
      initialSubmissions={submissions}
    />
  );
}
