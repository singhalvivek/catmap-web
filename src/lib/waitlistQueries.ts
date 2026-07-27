// waitlistQueries — server-side MongoDB writes for the waitlist collection
import { getDb } from "./mongodb";
import type { WaitlistSource } from "@/app/cat-prep/models/waitlist";

const WAITLIST_COLLECTION = "waitlist";

/**
 * Upserts an address keyed on the normalised email, so re-submitting never creates a
 * duplicate and never resets the original signup date. A changed exam answer wins.
 * Returns true when this call created the entry.
 */
export async function saveWaitlistEntry(params: {
  email: string;
  exam: string;
  source: WaitlistSource;
}): Promise<{ created: boolean }> {
  const db = await getDb();
  const now = new Date();

  const result = await db.collection(WAITLIST_COLLECTION).updateOne(
    { email: params.email },
    {
      $set: { exam: params.exam, updatedAt: now },
      $setOnInsert: { email: params.email, source: params.source, createdAt: now },
    },
    { upsert: true }
  );

  return { created: result.upsertedCount > 0 };
}
