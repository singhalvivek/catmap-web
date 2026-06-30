// daily-dose/streak — GET /api/daily-dose/streak?uid=; current streak + today's completion flags
import { NextRequest, NextResponse } from "next/server";
import { getDailyDoseStreak } from "@/lib/dailyDoseQueries";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }

  try {
    const data = await getDailyDoseStreak(uid);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/daily-dose/streak]", err);
    return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
  }
}
