import type { Metadata } from "next";
import { fetchDailyTest } from "@/lib/dailyQuizQueries";
import DailyChallengePageClient from "./components/DailyChallengePageClient";

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

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function DailyChallengePage() {
  const date = getTodayDate();
  const test = await fetchDailyTest(date).catch(() => null);
  return <DailyChallengePageClient test={test} date={date} />;
}
