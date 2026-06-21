// mock — GET /api/pyq/[paperSlug]/mock returns a timed 3-section DailyTest-shaped mock, answers stripped
import { NextRequest, NextResponse } from "next/server";
import { fetchPyqMockTest } from "@/lib/pyqQueries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ paperSlug: string }> }
) {
  const { paperSlug } = await params;

  try {
    const test = await fetchPyqMockTest(paperSlug);
    if (!test) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json(test);
  } catch (err) {
    console.error("[GET /api/pyq/[paperSlug]/mock]", err);
    return NextResponse.json({ error: "Failed to fetch mock test" }, { status: 500 });
  }
}
