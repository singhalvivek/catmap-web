// page — /cat-prep/daily-dose/essay server page; pre-fetches today's essay
import type { Metadata } from "next";
import { ENV } from "@/config/env";
import { fetchOrPickDailyEssay } from "@/lib/essayQueries";
import DailyEssayPageClient from "./components/DailyEssayPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daily Essay | StudyNaksha",
  description: "Read today's Aeon essay, reflect on it, and see how others responded. Daily VARC practice for CAT.",
  alternates: { canonical: `${ENV.SITE_URL}/cat-prep/daily-dose/essay` },
  openGraph: {
    title: "Daily Essay | StudyNaksha",
    description: "Read today's Aeon essay and respond. VARC practice for CAT aspirants.",
  },
};

function getTodayIST(): string {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default async function DailyEssayPage() {
  const date = getTodayIST();
  const essay = await fetchOrPickDailyEssay(date).catch(() => null);
  return <DailyEssayPageClient essay={essay} date={date} />;
}
