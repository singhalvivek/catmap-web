// opengraph-image — CAT prep page OG image with logo mark, headline, and tagline (1200x630)
import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, OG_BRAND } from "@/app/lib/ogImage";

export const runtime = "edge";
export const alt = "Free CAT Preparation Roadmap | StudyNaksha";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function CatPrepOGImage() {
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
        {/* Logo mark — two overlapping books (scaled from icon.tsx) */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 96,
            height: 100,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 4,
              top: 0,
              width: 58,
              height: 100,
              borderRadius: 10,
              background: OG_BRAND.navy,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 0,
              width: 58,
              height: 100,
              borderRadius: 10,
              background: OG_BRAND.teal,
            }}
          />
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: OG_BRAND.navy,
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 28,
          }}
        >
          CAT Roadmap
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: OG_BRAND.slate,
            textAlign: "center",
          }}
        >
          Structured · Trackable · Distraction-free
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 20,
            color: OG_BRAND.teal,
            fontWeight: 600,
          }}
        >
          {OG_BRAND.domain}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
