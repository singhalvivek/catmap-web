import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchRcPassage } from "@/lib/practiceQueries";
import { getDb } from "@/lib/mongodb";
import RcPlayer from "./RcPlayer";
import Link from "next/link";

type Props = { params: Promise<{ rcNumber: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rcNumber } = await params;
  return {
    title: `Reading Comprehension ${rcNumber} — VARC Practice | StudyNaksha`,
  };
}

async function getTotalRcCount(): Promise<number> {
  const db = await getDb();
  return db.collection("percentyl_rcs").countDocuments();
}

export default async function RcPage({ params }: Props) {
  const { rcNumber } = await params;
  const num = parseInt(rcNumber, 10);
  if (isNaN(num) || num < 1) notFound();

  const [passage, total] = await Promise.all([fetchRcPassage(num), getTotalRcCount()]);
  if (!passage) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
      <div
        style={{
          background: "linear-gradient(160deg, #FFFBEB 0%, #FEF3C7 100%)",
          padding: "24px 24px 28px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
            <Link href="/cat-prep" style={{ color: "#94A3B8", textDecoration: "none" }}>
              CAT Prep
            </Link>
            {" / "}
            <span style={{ color: "#64748B" }}>Practice</span>
            {" / "}
            <span style={{ color: "#64748B" }}>VARC</span>
            {" / "}
            <span style={{ color: "#92400E", fontWeight: 600 }}>Reading Comprehensions</span>
          </div>
          <h1
            className="font-extrabold"
            style={{ fontSize: "clamp(18px,3vw,26px)", margin: 0, color: "#92400E", letterSpacing: "-0.3px" }}
          >
            Reading Comprehension
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", marginTop: 4, marginBottom: 0 }}>
            Passage {num} of {total}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <RcPlayer passage={passage} totalPassages={total} storageKey={`varc-rc-${num}`} />
      </div>
    </div>
  );
}
