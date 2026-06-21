// result — GET /api/pyq/[paperSlug]/result?uid= returns the stored mock-test attempt or null
import { NextRequest, NextResponse } from "next/server";
import { getStoredPyqMockResult } from "@/lib/pyqQueries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paperSlug: string }> }
) {
  const { paperSlug } = await params;
  const uid = request.nextUrl.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "Missing required param: uid" }, { status: 400 });
  }

  try {
    const result = await getStoredPyqMockResult(uid, paperSlug);
    if (!result) {
      return NextResponse.json(null);
    }
    return NextResponse.json({
      ...result,
      completedAt: result.completedAt.toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/pyq/[paperSlug]/result]", err);
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 });
  }
}
