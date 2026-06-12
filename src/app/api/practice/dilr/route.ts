// dilr — GET /api/practice/dilr?chapter= returns all sets for a chapter (answers stripped)
import { NextRequest, NextResponse } from "next/server";
import { fetchDilrSets } from "@/lib/practiceQueries";

export async function GET(request: NextRequest) {
  const chapter = request.nextUrl.searchParams.get("chapter");

  if (!chapter) {
    return NextResponse.json({ error: "Missing required param: chapter" }, { status: 400 });
  }

  try {
    const sets = await fetchDilrSets(chapter);
    return NextResponse.json(sets);
  } catch (err) {
    console.error("[GET /api/practice/dilr]", err);
    return NextResponse.json({ error: "Failed to fetch DILR sets" }, { status: 500 });
  }
}
