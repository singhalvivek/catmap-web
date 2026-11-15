// icon — generated favicon drawing the shared brand mark via ImageResponse
import { ImageResponse } from "next/og";
import { BRAND_ACCENT, BRAND_INK, BRAND_MARK } from "@/constants/brand";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const m = BRAND_MARK;

  // ImageResponse cannot resolve CSS custom properties, so the geometry and colours come
  // from the shared brand constants rather than being redrawn with their own literals.
  return new ImageResponse(
    (
      <div
        style={{
          width: m.viewBox,
          height: m.viewBox,
          display: "flex",
          background: "transparent",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: m.leftX,
            top: m.blockY,
            width: m.blockWidth,
            height: m.blockHeight,
            background: BRAND_INK,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: m.rightX,
            top: m.blockY,
            width: m.blockWidth,
            height: m.blockHeight,
            background: BRAND_ACCENT,
          }}
        />
      </div>
    ),
    { width: m.viewBox, height: m.viewBox }
  );
}
