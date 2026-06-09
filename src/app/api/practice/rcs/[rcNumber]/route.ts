// rc-passage — GET /api/practice/rcs/[rcNumber] returns passage and questions (answers stripped)
import { NextRequest, NextResponse } from "next/server";
import { fetchRcPassage } from "@/lib/practiceQueries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ rcNumber: string }> }
) {
  const { rcNumber } = await params;

  const num = parseInt(rcNumber, 10);
  if (isNaN(num)) {
    return NextResponse.json({ error: "Invalid rcNumber" }, { status: 400 });
  }

  try {
    const passage = await fetchRcPassage(num);
    if (!passage) {
      return NextResponse.json({ error: "RC passage not found" }, { status: 404 });
    }
    return NextResponse.json(passage);
  } catch (err) {
    console.error("[GET /api/practice/rcs/[rcNumber]]", err);
    return NextResponse.json({ error: "Failed to fetch RC passage" }, { status: 500 });
  }
}
