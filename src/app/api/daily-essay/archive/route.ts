// daily-essay/archive — GET /api/daily-essay/archive?today=YYYY-MM-DD
import { NextRequest, NextResponse } from "next/server";
import { getEssayArchive } from "@/lib/essayQueries";

export async function GET(request: NextRequest) {
  const today = request.nextUrl.searchParams.get("today");
  if (!today || !/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    return NextResponse.json({ error: "Invalid or missing today param" }, { status: 400 });
  }

  try {
    const entries = await getEssayArchive(today);
    return NextResponse.json(entries);
  } catch (err) {
    console.error("[GET /api/daily-essay/archive]", err);
    return NextResponse.json({ error: "Failed to fetch archive" }, { status: 500 });
  }
}
