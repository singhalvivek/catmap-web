// page — /cat-prep/daily-dose/challenge/review; per-question review of a completed challenge
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchDailyTest } from "@/lib/dailyQuizQueries";
import { getTodayIST } from "@/lib/dateIST";
import DailyChallengeReviewPageClient from "./DailyChallengeReviewPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Daily Challenge · Review | StudyNaksha" };

type Props = { searchParams: Promise<{ date?: string }> };

export default async function DailyChallengeReviewPage({ searchParams }: Props) {
  const { date: requestedDate } = await searchParams;
  const date = requestedDate ?? getTodayIST();

  // Review is post-attempt, so include explanations (mirrors the mock review).
  const test = await fetchDailyTest(date, { includeExplanation: true });
  if (!test) notFound();

  return <DailyChallengeReviewPageClient test={test} date={date} />;
}
