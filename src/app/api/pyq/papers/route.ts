// papers — GET /api/pyq/papers returns all scraped PYQ papers with per-section question counts
import { NextResponse } from "next/server";
import { fetchPyqPapersIndex } from "@/lib/pyqQueries";

export async function GET() {
  try {
    const papers = await fetchPyqPapersIndex();
    return NextResponse.json(papers);
  } catch (err) {
    console.error("[GET /api/pyq/papers]", err);
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 });
  }
}
