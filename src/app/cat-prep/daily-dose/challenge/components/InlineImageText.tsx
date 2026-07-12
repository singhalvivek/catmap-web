// InlineImageText — renders scraped text with its images placed inline at their
// original positions, using the pure `interleaveImages` ordering (unit-tested).
"use client";

import type { CSSProperties, ReactNode } from "react";
import { interleaveImages } from "@/lib/interleaveImages";

type Props = {
  text: string;
  imageUrls: string[];
  imagePositions?: number[];
  // Caller owns the paragraph markup (font, colour, MathText) so each surface keeps
  // its own styling; InlineImageText only decides ordering.
  renderParagraph: (segment: string, key: string) => ReactNode;
  imgStyle?: CSSProperties;
  imgAlt?: string;
};

export default function InlineImageText({
  text,
  imageUrls,
  imagePositions,
  renderParagraph,
  imgStyle,
  imgAlt = "Illustration",
}: Props) {
  const items = interleaveImages(text, imageUrls, imagePositions);
  return (
    <>
      {items.map((item) =>
        item.kind === "text" ? (
          renderParagraph(item.value, item.key)
        ) : (
          // image origin is scraper-supplied and unknown at build time — next/image
          // needs pre-configured remotePatterns, so a plain img is used here
          // eslint-disable-next-line @next/next/no-img-element
          <img key={item.key} src={item.url} alt={imgAlt} style={imgStyle} />
        )
      )}
    </>
  );
}
