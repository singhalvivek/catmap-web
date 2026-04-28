// NoChallengeTodayView — empty state when no test JSON exists for today's date
import Link from "next/link";

export default function NoChallengeTodayView({ date }: { date: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#FFFDF8" }}
    >
      <div style={{ maxWidth: 360, textAlign: "center", padding: "32px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
        <h2
          className="font-extrabold text-trust-navy"
          style={{ fontSize: 22, marginBottom: 8 }}
        >
          No challenge today
        </h2>
        <p className="text-slate-500" style={{ fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>
          There is no daily challenge for <strong>{date}</strong>.
        </p>
        <p className="text-slate-400" style={{ fontSize: 13, marginBottom: 28 }}>
          Challenges are published daily — check back tomorrow.
        </p>
        <Link
          href="/cat-prep"
          className="font-bold text-white"
          style={{
            display: "inline-block",
            padding: "11px 28px",
            borderRadius: 10,
            background: "#1E3A5F",
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Back to Roadmap
        </Link>
      </div>
    </div>
  );
}
