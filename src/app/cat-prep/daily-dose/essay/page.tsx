// page — /cat-prep/daily-dose/essay server page; pre-fetches today's essay
import type { Metadata } from "next";
import { ENV } from "@/config/env";
import { fetchOrPickDailyEssay } from "@/lib/essayQueries";
import { getTodayIST } from "@/lib/dateIST";
import DailyEssayPageClient from "./components/DailyEssayPageClient";

// Dynamic, not ISR: a cached render would freeze `date` and keep serving
// yesterday's essay for up to an hour past IST midnight.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daily Essay",
  description: "Read today's Aeon essay, reflect on it, and see how others responded. Daily VARC practice for CAT.",
  alternates: { canonical: `${ENV.SITE_URL}/cat-prep/daily-dose/essay` },
  openGraph: {
    title: "Daily Essay",
    description: "Read today's Aeon essay and respond. VARC practice for CAT aspirants.",
  },
};

export default async function DailyEssayPage() {
  const date = getTodayIST();
  const essay = await fetchOrPickDailyEssay(date).catch(() => null);
  return <DailyEssayPageClient essay={essay} date={date} />;
}
