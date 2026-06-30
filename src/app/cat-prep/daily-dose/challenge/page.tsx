import type { Metadata } from "next";
import { ENV } from "@/config/env";
import { fetchDailyTest } from "@/lib/dailyQuizQueries";
import DailyChallengePageClient from "./components/DailyChallengePageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daily Challenge | StudyNaksha",
  description: "Take today's timed CAT practice test across VARC, DILR, and Quant. Track your score and build exam stamina.",
  alternates: { canonical: `${ENV.SITE_URL}/cat-prep/daily-dose/challenge` },
  openGraph: {
    title: "Daily Challenge | StudyNaksha",
    description: "Take today's timed CAT practice test across VARC, DILR, and Quant.",
  },
  twitter: {
    title: "Daily Challenge | StudyNaksha",
    description: "Take today's timed CAT practice test across VARC, DILR, and Quant.",
  },
};

export function getTodayDate(): string {
  // Use IST (UTC+5:30) so the date matches what Indian users expect
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default async function DailyChallengePage() {
  const date = getTodayDate();
  const rawTest = await fetchDailyTest(date).catch(() => null);
  // Guard: ensure only plain, serializable objects cross into the client component
  // (a stray ObjectId/Buffer in the data would otherwise crash client hydration).
  const test = rawTest ? JSON.parse(JSON.stringify(rawTest)) : null;
  return <DailyChallengePageClient test={test} date={date} />;
}
