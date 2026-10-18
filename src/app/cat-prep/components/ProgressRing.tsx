// ProgressRing — SVG circle progress ring; rotated -90deg with animated stroke-dashoffset
export default function ProgressRing({
  percent,
  size = 48,
  stroke = 4,
  color = "var(--accent)",
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label={`${Math.round(percent)}% complete`}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--rule)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </svg>
  );
}
