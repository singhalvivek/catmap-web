// page — /cat-prep/daily-dose/essay/archive; lists all past essays with response counts
import type { Metadata } from "next";
import Link from "next/link";
import { getEssayArchive } from "@/lib/essayQueries";
import { getTodayIST } from "@/lib/dateIST";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Essay Archive | StudyNaksha",
  description: "Browse all past Aeon essays used for daily VARC practice on StudyNaksha.",
};

function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EssayArchivePage() {
  const today = getTodayIST();
  const entries = await getEssayArchive(today).catch(() => []);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
      {/* Header */}
      <div style={{ background: "#1E3A5F", padding: "14px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/cat-prep/daily-dose/essay"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, textDecoration: "none", fontWeight: 500 }}
          >
            ← Today&apos;s Essay
          </Link>
          <span className="font-bold text-white" style={{ fontSize: 13 }}>
            Essay Archive
          </span>
          <span style={{ width: 80 }} />
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <h1 className="font-extrabold text-trust-navy" style={{ fontSize: 24, marginBottom: 6 }}>
          Past Essays
        </h1>
        <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
          Browse previous daily essays and read the community&apos;s responses.
        </p>

        {entries.length === 0 ? (
          <p style={{ fontSize: 14, color: "#94A3B8" }}>No past essays yet — check back tomorrow.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {entries.map((entry) => (
              <Link
                key={entry.date}
                href={`/cat-prep/daily-dose/essay/${entry.date}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="hover:shadow-[0_4px_16px_rgba(30,58,95,0.1)]"
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    padding: "16px 20px",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    transition: "box-shadow 0.15s",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginBottom: 4 }}>
                      {formatDate(entry.date)}
                    </p>
                    <p className="font-semibold text-trust-navy" style={{ fontSize: 15, lineHeight: 1.4, marginBottom: 3 }}>
                      {entry.title}
                    </p>
                    {entry.author && (
                      <p style={{ fontSize: 12, color: "#64748B" }}>by {entry.author}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {entry.responseCount > 0 && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#1E3A5F",
                          background: "#EEF2FF",
                          border: "1px solid #C7D2FE",
                          borderRadius: 100,
                          padding: "3px 10px",
                        }}
                      >
                        {entry.responseCount} {entry.responseCount === 1 ? "response" : "responses"}
                      </span>
                    )}
                    <span style={{ color: "#94A3B8", fontSize: 16 }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
