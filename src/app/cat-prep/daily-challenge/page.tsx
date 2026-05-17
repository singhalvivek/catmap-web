import { readFileSync } from "fs";
import path from "path";
import type { Metadata } from "next";
import type { DailyTest } from "../models/dailyChallenge";
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
  // Returns YYYY-MM-DD in UTC; acceptable for a daily cadence
  return new Date().toISOString().slice(0, 10);
}

function loadDailyTest(date: string): DailyTest | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "daily-challenges",
      `${date}.json`
    );
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as DailyTest;
  } catch {
    return null;
  }
}

export default function DailyChallengePage() {
  const date = getTodayDate();
  const test = loadDailyTest(date);
  return <DailyChallengePageClient test={test} date={date} />;
}
