// daily-challenge-result — GET /api/daily-challenge-result?uid=&date=; returns stored result or null
import { NextRequest, NextResponse } from "next/server";
import { getStoredResult } from "@/lib/dailyQuizQueries";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid");
  const date = request.nextUrl.searchParams.get("date");

  if (!uid || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Missing or invalid uid/date" }, { status: 400 });
  }

  try {
    const result = await getStoredResult(uid, date);
    if (!result) {
      return NextResponse.json(null);
    }
    return NextResponse.json({
      ...result,
      completedAt: result.completedAt.toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/daily-challenge-result]", err);
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 });
  }
}
