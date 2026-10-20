// SectionHeading — shared heading block for the home page sections
type Props = {
  eyebrow: string;
  title: string;
  note?: string;
  /** False when the parent section owns the full-width rule, as in a split layout. */
  rule?: boolean;
};

export default function SectionHeading({ eyebrow, title, note, rule = true }: Props) {
  return (
    <div>
      {/* The rule draws itself across before the heading arrives. */}
      {rule && (
        <div
          className="reveal-rule"
          style={{ height: 3, background: "var(--ink)", marginBottom: 18 }}
        />
      )}

      <p className="ed-kicker reveal" style={{ margin: "0 0 10px", "--reveal-delay": "90ms" } as React.CSSProperties}>
        {eyebrow}
      </p>

      <h2
        className="display reveal-mask"
        style={{
          fontSize: "clamp(30px, 3.8vw, 42px)",
          color: "var(--ink)",
          margin: 0,
          "--reveal-delay": "170ms",
        } as React.CSSProperties}
      >
        <span className="reveal-mask__line">{title}</span>
      </h2>

      {note && (
        <p
          className="reveal"
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "var(--ink-soft)",
            margin: "12px 0 0",
            maxWidth: "58ch",
            "--reveal-delay": "280ms",
          } as React.CSSProperties}
        >
          {note}
        </p>
      )}
    </div>
  );
}
