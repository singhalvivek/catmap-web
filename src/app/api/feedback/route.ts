import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/config/env";

console.log("SHEETS_WEBHOOK_URL =", process.env.SHEETS_WEBHOOK_URL);
const SHEETS_WEBHOOK_URL = ENV.SHEETS_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const payload = {
    parentId: body.parentId,
    nodeTitle: body.nodeTitle,
    description: body.description,
    resources: body.resources,
    name: body.name,
    email: body.email,
    comment: body.comment,
  };

  await fetch(SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({ success: true });
}
