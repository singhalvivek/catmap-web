// dilr-solution — GET /api/practice/dilr/[setNumber]/solution?chapter= returns full solution
import { NextRequest, NextResponse } from "next/server";
import { fetchDilrSolution } from "@/lib/practiceQueries";

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
    const solution = await fetchDilrSolution(chapter, num);
    if (!solution) {
      return NextResponse.json({ error: "DILR set not found" }, { status: 404 });
    }
    return NextResponse.json(solution);
  } catch (err) {
    console.error("[GET /api/practice/dilr/[setNumber]/solution]", err);
    return NextResponse.json({ error: "Failed to fetch solution" }, { status: 500 });
  }
}
