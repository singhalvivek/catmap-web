// ogImage — shared constants for Next.js ImageResponse OG images across all routes
import { BRAND_ACCENT, BRAND_INK, BRAND_PAPER } from "@/constants/brand";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Mirrors the site tokens. ImageResponse cannot read a CSS custom property, so these are
// literals — but the mark's own colours come from @/constants/brand so the favicon, the
// social cards and the inline SVG cannot drift apart again.
export const OG_BRAND = {
  teal: BRAND_ACCENT,
  navy: BRAND_INK,
  slate: "#35425a",
  background: BRAND_PAPER,
  rule: "#ada38e",
  domain: "studynaksha.com",
};
