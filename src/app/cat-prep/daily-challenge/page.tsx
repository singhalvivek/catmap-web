import type { Metadata } from "next";
import { fetchDailyTest } from "@/lib/dailyQuizQueries";
import DailyChallengePageClient from "./components/DailyChallengePageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daily Challenge",
  description: "Take today's timed CAT practice test across VARC, DILR, and Quant. Track your score and build exam stamina.",
  openGraph: {
    title: "Daily Challenge",
    description: "Take today's timed CAT practice test across VARC, DILR, and Quant.",
  },
  twitter: {
    title: "Daily Challenge",
    description: "Take today's timed CAT practice test across VARC, DILR, and Quant.",
  },
};

export function getTodayDate(): string {
  // Use IST (UTC+5:30) so the date matches what Indian users expect
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default async function DailyChallengePage() {
  const date = getTodayDate();
  const test = await fetchDailyTest(date).catch(() => null);
  return <DailyChallengePageClient test={test} date={date} />;
}
