// opengraph-image — CAT Prep Roadmap OG image via ImageResponse (edge runtime, 1200x630)
import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OG_RUNTIME, OG_BRAND } from "@/app/lib/ogImage";

export const runtime = OG_RUNTIME;
export const alt = "CAT Prep Roadmap | StudyNaksha";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: OG_BRAND.background,
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div style={{ width: 72, height: 8, borderRadius: 4, background: OG_BRAND.teal, marginBottom: 40 }} />

        <div style={{ fontSize: 58, fontWeight: 800, color: OG_BRAND.navy, textAlign: "center", lineHeight: 1.15, marginBottom: 24 }}>
          CAT Prep Roadmap
        </div>

        <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
          {["Quantitative Aptitude", "DILR", "VARC"].map((s) => (
            <div
              key={s}
              style={{ padding: "10px 24px", borderRadius: 32, background: "#F0FDFA", border: `2px solid ${OG_BRAND.teal}`, color: "#0F766E", fontSize: 20, fontWeight: 600 }}
            >
              {s}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 24, fontWeight: 400, color: OG_BRAND.slate, textAlign: "center" }}>
          Free · Structured · Community-driven
        </div>

        <div style={{ position: "absolute", bottom: 48, fontSize: 20, color: OG_BRAND.teal, fontWeight: 600 }}>
          {OG_BRAND.domain}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
