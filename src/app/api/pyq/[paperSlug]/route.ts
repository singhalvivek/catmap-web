// [paperSlug] — GET /api/pyq/[paperSlug] returns a full paper grouped into sections, answers stripped
import { NextRequest, NextResponse } from "next/server";
import { fetchPyqPaper } from "@/lib/pyqQueries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ paperSlug: string }> }
) {
  const { paperSlug } = await params;

  try {
    const paper = await fetchPyqPaper(paperSlug);
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
    return NextResponse.json(paper);
  } catch (err) {
    console.error("[GET /api/pyq/[paperSlug]]", err);
    return NextResponse.json({ error: "Failed to fetch paper" }, { status: 500 });
  }
}
