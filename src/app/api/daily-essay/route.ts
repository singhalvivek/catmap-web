// daily-essay — GET /api/daily-essay?date=YYYY-MM-DD; returns or picks today's Aeon essay
import { NextRequest, NextResponse } from "next/server";
import { fetchOrPickDailyEssay, fetchDailyEssay } from "@/lib/essayQueries";
import { getTodayIST } from "@/lib/dateIST";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }

  try {
    // Only today may pick a new essay; any other date reads what was stored.
    // Picking on an arbitrary date would let callers drain the essay pool.
    const isToday = date === getTodayIST();
    const essay = isToday ? await fetchOrPickDailyEssay(date) : await fetchDailyEssay(date);
    if (!essay) {
      return isToday
        ? NextResponse.json({ error: "Could not fetch essay for today" }, { status: 503 })
        : NextResponse.json({ error: "No essay stored for that date" }, { status: 404 });
    }
    return NextResponse.json(essay);
  } catch (err) {
    console.error("[GET /api/daily-essay]", err);
    return NextResponse.json({ error: "Failed to fetch essay" }, { status: 500 });
  }
}
