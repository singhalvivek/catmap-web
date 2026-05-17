// icon — generated favicon using the SNLogo mark (two overlapping books, navy + teal)
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          position: "relative",
        }}
      >
        {/* Navy book (left) */}
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 3,
            width: 15,
            height: 26,
            borderRadius: 3,
            background: "#1E3A5F",
          }}
        />
        {/* Teal book (right) */}
        <div
          style={{
            position: "absolute",
            left: 13,
            top: 3,
            width: 15,
            height: 26,
            borderRadius: 3,
            background: "#14B8A6",
          }}
        />
      </div>
    ),
    { width: 32, height: 32 }
  );
}
