// submit — POST /api/pyq/[paperSlug]/submit grades mock-test answers server-side and saves the attempt
import { NextRequest, NextResponse } from "next/server";
import { gradeAndSavePyqMockAttempt, DuplicatePyqAttemptError } from "@/lib/pyqQueries";

type RequestBody = {
  uid: string;
  responses: Record<string, number | null>;
  timings: Record<string, number>;
  totalTimeSeconds: number;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ paperSlug: string }> }
) {
  const { paperSlug } = await params;

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { uid, responses, timings, totalTimeSeconds } = body;
  if (!uid || typeof responses !== "object" || typeof totalTimeSeconds !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await gradeAndSavePyqMockAttempt({ paperSlug, uid, responses, timings, totalTimeSeconds });
    return NextResponse.json({
      ...result,
      completedAt: result.completedAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof DuplicatePyqAttemptError) {
      return NextResponse.json({ error: "Already submitted" }, { status: 409 });
    }
    console.error("[POST /api/pyq/[paperSlug]/submit]", err);
    return NextResponse.json({ error: "Failed to submit attempt" }, { status: 500 });
  }
}
