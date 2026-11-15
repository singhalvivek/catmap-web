// SNLogo — inline SVG brand mark: a book opened flat, in ink and accent
import { BRAND_MARK } from "@/constants/brand";

/**
 * This copy of the mark is inline SVG in the document, so unlike icon.tsx and the
 * OpenGraph routes it CAN resolve custom properties — and it has to. It was drawn with the
 * literal BRAND_INK, which is #101a2b against a dark page ground of #111823: 1.02:1, so
 * the left block of a two-block mark simply was not there. On the footer band the same
 * problem runs the other way, which is what onDark is for.
 */
export default function SNLogo({ size = 32, onDark = false }: { size?: number; onDark?: boolean }) {
  const m = BRAND_MARK;
  const ink = onDark ? "var(--invert-ink)" : "var(--ink)";
  const paper = onDark ? "var(--invert-bg)" : "var(--paper)";
  const accent = onDark ? "var(--accent-bright)" : "var(--accent)";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${m.viewBox} ${m.viewBox}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect x={m.leftX} y={m.blockY} width={m.blockWidth} height={m.blockHeight} fill={ink} />
      <rect
        x={m.rightX}
        y={m.blockY}
        width={m.blockWidth}
        height={m.blockHeight}
        fill={accent}
      />
      {m.rules.map((rule) => (
        <rect
          key={rule.y}
          x={m.rightX + 2}
          y={rule.y}
          width={rule.width}
          height={1.5}
          fill={paper}
          opacity={0.85}
        />
      ))}
    </svg>
  );
}
