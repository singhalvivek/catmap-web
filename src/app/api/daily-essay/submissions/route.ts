// daily-essay/submissions — GET /api/daily-essay/submissions?date=X&userId=Y
// Returns submissions only if the requesting user has already submitted (prevents peeking)
import { NextRequest, NextResponse } from "next/server";
import { getEssaySubmissions } from "@/lib/essayQueries";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const userId = request.nextUrl.searchParams.get("userId");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const submissions = await getEssaySubmissions(date, userId);
    const hasSubmitted = submissions.some((s) => s.userId === userId);

    if (!hasSubmitted) {
      return NextResponse.json({ submitted: false });
    }

    return NextResponse.json({ submitted: true, submissions });
  } catch (err) {
    console.error("[GET /api/daily-essay/submissions]", err);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}
