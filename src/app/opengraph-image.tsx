// opengraph-image — root branded OG image via ImageResponse (edge runtime, 1200x630)
import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OG_RUNTIME, OG_BRAND } from "@/app/lib/ogImage";

export const runtime = "edge";
export const alt = "StudyNaksha — Ace your Exams with Interactive Roadmaps";
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

        <div style={{ fontSize: 64, fontWeight: 800, color: OG_BRAND.navy, textAlign: "center", lineHeight: 1.15, marginBottom: 24 }}>
          StudyNaksha
        </div>

        <div style={{ fontSize: 28, fontWeight: 500, color: OG_BRAND.slate, textAlign: "center", maxWidth: 800, lineHeight: 1.4 }}>
          Ace your Exams with Interactive Roadmaps
        </div>

        <div style={{ position: "absolute", bottom: 48, fontSize: 20, color: OG_BRAND.teal, fontWeight: 600 }}>
          {OG_BRAND.domain}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
