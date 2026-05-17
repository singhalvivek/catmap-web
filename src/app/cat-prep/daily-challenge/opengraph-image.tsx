// opengraph-image — Daily Challenge OG image via ImageResponse (edge runtime, 1200x630)
import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OG_RUNTIME, OG_BRAND } from "@/app/lib/ogImage";

export const runtime = OG_RUNTIME;
export const alt = "Daily Challenge | StudyNaksha";
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

        {/* Timer icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `6px solid ${OG_BRAND.teal}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            color: OG_BRAND.teal,
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          ⏱
        </div>

        <div style={{ fontSize: 58, fontWeight: 800, color: OG_BRAND.navy, textAlign: "center", lineHeight: 1.15, marginBottom: 20 }}>
          Daily Challenge
        </div>

        <div style={{ fontSize: 24, fontWeight: 400, color: OG_BRAND.slate, textAlign: "center", maxWidth: 700, lineHeight: 1.5 }}>
          Timed CAT practice · VARC · DILR · Quant
        </div>

        <div style={{ position: "absolute", bottom: 48, fontSize: 20, color: OG_BRAND.teal, fontWeight: 600 }}>
          {OG_BRAND.domain}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
