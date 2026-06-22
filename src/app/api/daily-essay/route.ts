// daily-essay — GET /api/daily-essay?date=YYYY-MM-DD; returns or picks today's Aeon essay
import { NextRequest, NextResponse } from "next/server";
import { fetchOrPickDailyEssay } from "@/lib/essayQueries";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }

  try {
    const essay = await fetchOrPickDailyEssay(date);
    if (!essay) {
      return NextResponse.json({ error: "Could not fetch essay for today" }, { status: 503 });
    }
    return NextResponse.json(essay);
  } catch (err) {
    console.error("[GET /api/daily-essay]", err);
    return NextResponse.json({ error: "Failed to fetch essay" }, { status: 500 });
  }
}
