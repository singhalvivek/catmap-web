// solution — GET /api/pyq/[paperSlug]/questions/[id]/solution returns the answer + explanation for one question
import { NextRequest, NextResponse } from "next/server";
import { fetchPyqQuestionSolution } from "@/lib/pyqQueries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ paperSlug: string; id: string }> }
) {
  const { paperSlug, id } = await params;

  try {
    const solution = await fetchPyqQuestionSolution(paperSlug, id);
    if (!solution) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json(solution);
  } catch (err) {
    console.error("[GET /api/pyq/[paperSlug]/questions/[id]/solution]", err);
    return NextResponse.json({ error: "Failed to fetch solution" }, { status: 500 });
  }
}
