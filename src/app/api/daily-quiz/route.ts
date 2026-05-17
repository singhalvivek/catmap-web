// daily-quiz — GET /api/daily-quiz?date=YYYY-MM-DD; returns DailyTest or 404
import { NextRequest, NextResponse } from "next/server";
import { fetchDailyTest } from "@/lib/dailyQuizQueries";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }

  try {
    const test = await fetchDailyTest(date);
    if (!test) {
      return NextResponse.json({ error: "No quiz scheduled for this date" }, { status: 404 });
    }
    return NextResponse.json(test);
  } catch (err) {
    console.error("[GET /api/daily-quiz]", err);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
