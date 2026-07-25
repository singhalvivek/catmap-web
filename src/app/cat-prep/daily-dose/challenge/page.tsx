// page — /cat-prep/daily-dose/challenge server page; resolves today's test
import type { Metadata } from "next";
import { ENV } from "@/config/env";
import { fetchDailyTest } from "@/lib/dailyQuizQueries";
import { getTodayIST } from "@/lib/dateIST";
import DailyChallengePageClient from "./components/DailyChallengePageClient";

// Dynamic, not ISR: a cached render would freeze `date` and keep serving
// yesterday's challenge for up to an hour past IST midnight.
export const dynamic = "force-dynamic";

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

export default async function DailyChallengePage() {
  const date = getTodayIST();
  const rawTest = await fetchDailyTest(date).catch(() => null);
  // Guard: ensure only plain, serializable objects cross into the client component
  // (a stray ObjectId/Buffer in the data would otherwise crash client hydration).
  const test = rawTest ? JSON.parse(JSON.stringify(rawTest)) : null;
  return <DailyChallengePageClient test={test} date={date} />;
}
