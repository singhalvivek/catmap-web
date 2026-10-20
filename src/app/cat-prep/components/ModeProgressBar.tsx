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
      {/*
        role="progressbar" with the aria-value* set, which no progress indicator on the
        site carried before. aria-valuetext rather than a bare percentage, because
        "12 of 61 subtopics" is what the sighted label says and the two should agree.
      */}
      <div
        className="ed-meter"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuetext={`${current} of ${total} ${label}`}
        style={{ flex: 1, "--meter-value": pct } as React.CSSProperties}
      >
        <span className="ed-meter__fill" />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--ink)",
          whiteSpace: "nowrap",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {current}/{total} {label}
        <InfoTooltip text={infoText} />
      </span>
    </div>
  );
}
