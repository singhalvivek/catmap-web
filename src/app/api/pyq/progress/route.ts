// progress — GET /api/pyq/progress?uid= returns per-paper mock-answered-question counts for a user
import { NextRequest, NextResponse } from "next/server";
import { getPyqMockAnsweredCounts } from "@/lib/pyqQueries";

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ error: "Missing required param: uid" }, { status: 400 });
  }

  try {
    const counts = await getPyqMockAnsweredCounts(uid);
    return NextResponse.json(counts);
  } catch (err) {
    console.error("[GET /api/pyq/progress]", err);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
