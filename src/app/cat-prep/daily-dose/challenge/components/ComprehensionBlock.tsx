// ComprehensionBlock — renders the reading passage and optional image for comprehension questions
import type { Comprehension } from "../../../models/dailyChallenge";
import MathText from "./MathText";

export default function ComprehensionBlock({
  comprehension,
}: {
  comprehension: Comprehension;
}) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        borderRadius: 10,
        border: "1.5px solid #E2E8F0",
        padding: "16px 18px",
        marginBottom: 20,
      }}
    >
      <span
        className="font-bold text-slate-400"
        style={{
          fontSize: 10,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 10,
        }}
      >
        Passage
      </span>
      {comprehension.imageUrls.map((url) => (
        /* image origin is scraper-supplied and unknown at build time — next/image requires
           pre-configured remotePatterns, so a plain img is used here */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url}
          src={url}
          alt="Passage illustration"
          style={{ maxWidth: "100%", borderRadius: 6, marginBottom: 12 }}
        />
      ))}
      <p
        style={{
          fontSize: 14,
          color: "#475569",
          lineHeight: 1.85,
          margin: 0,
          whiteSpace: "pre-line",
        }}
      >
        <MathText text={comprehension.text} />
      </p>
    </div>
  );
}
