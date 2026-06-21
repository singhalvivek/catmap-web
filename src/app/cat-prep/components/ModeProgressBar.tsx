// ModeProgressBar — labelled progress bar with an info tooltip explaining the metric
import InfoTooltip from "./InfoTooltip";

export default function ModeProgressBar({
  current,
  total,
  label,
  infoText,
}: {
  current: number;
  total: number;
  label: string;
  infoText: string;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 3,
          background: "#E2E8F0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#14B8A6",
            borderRadius: 3,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span
        className="font-bold text-trust-navy"
        style={{ fontSize: 13, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6 }}
      >
        {current}/{total} {label}
        <InfoTooltip text={infoText} />
      </span>
    </div>
  );
}
