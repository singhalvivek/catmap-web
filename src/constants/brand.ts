// brand — the one definition of the StudyNaksha mark's geometry and colours
//
// The mark is drawn three times in three technologies: as inline SVG in SNLogo, and as
// ImageResponse divs in icon.tsx and the OpenGraph routes, neither of which can read a CSS
// custom property. Before this file each copy carried its own hex, so retoning the brand
// meant finding all three — and the favicon and social card had already drifted from the
// site. Everything that draws the mark reads these values.

/** Mirrors --ink. Hard-coded because ImageResponse cannot resolve a CSS variable. */
export const BRAND_INK = "#101a2b";
/** Mirrors --accent. */
export const BRAND_ACCENT = "#0d8b7f";
/** Mirrors --paper, the page ground the mark is cut against. */
export const BRAND_PAPER = "#fcf9f2";

/**
 * Two squared blocks with a gutter between them: a book opened flat, seen from above.
 * Square corners, because the editorial language has none — the previous mark used rx=3.
 * Coordinates are in the mark's own 32x32 viewBox and scale with it.
 */
export const BRAND_MARK = {
  viewBox: 32,
  blockY: 3,
  blockHeight: 26,
  leftX: 4,
  rightX: 17,
  blockWidth: 11,
  /** Short rules on the right block, suggesting set text. */
  rules: [
    { y: 10, width: 7 },
    { y: 15, width: 7 },
    { y: 20, width: 4 },
  ],
} as const;
