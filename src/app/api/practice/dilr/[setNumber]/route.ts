// dilr-set — GET /api/practice/dilr/[setNumber]?chapter= returns a single DILR set (answers stripped)
import { NextRequest, NextResponse } from "next/server";
import { fetchDilrSet } from "@/lib/practiceQueries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ setNumber: string }> }
) {
  const { setNumber } = await params;
  const chapter = request.nextUrl.searchParams.get("chapter");

  if (!chapter) {
    return NextResponse.json({ error: "Missing required param: chapter" }, { status: 400 });
  }

  const num = parseInt(setNumber, 10);
  if (isNaN(num)) {
    return NextResponse.json({ error: "Invalid setNumber" }, { status: 400 });
  }

  try {
    const set = await fetchDilrSet(chapter, num);
    if (!set) {
      return NextResponse.json({ error: "DILR set not found" }, { status: 404 });
    }
    return NextResponse.json(set);
  } catch (err) {
    console.error("[GET /api/practice/dilr/[setNumber]]", err);
    return NextResponse.json({ error: "Failed to fetch DILR set" }, { status: 500 });
  }
}
