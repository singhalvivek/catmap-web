// SNLogo — inline SVG brand mark: a book opened flat, in ink and accent
import { BRAND_ACCENT, BRAND_INK, BRAND_MARK, BRAND_PAPER } from "@/constants/brand";

export default function SNLogo({ size = 32 }: { size?: number }) {
  const m = BRAND_MARK;

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
      <rect x={m.leftX} y={m.blockY} width={m.blockWidth} height={m.blockHeight} fill={BRAND_INK} />
      <rect
        x={m.rightX}
        y={m.blockY}
        width={m.blockWidth}
        height={m.blockHeight}
        fill={BRAND_ACCENT}
      />
      {m.rules.map((rule) => (
        <rect
          key={rule.y}
          x={m.rightX + 2}
          y={rule.y}
          width={rule.width}
          height={1.5}
          fill={BRAND_PAPER}
          opacity={0.85}
        />
      ))}
    </svg>
  );
}
