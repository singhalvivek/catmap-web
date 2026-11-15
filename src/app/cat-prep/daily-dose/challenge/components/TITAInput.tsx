// TITAInput — number input for TITA questions; value capped to 2 decimal places
"use client";

type Props = {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
};

export default function TITAInput({ value, onChange, disabled }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || raw === "-") {
      onChange(null);
      return;
    }
    const parsed = parseFloat(raw);
    if (!Number.isNaN(parsed)) {
      onChange(Math.round(parsed * 100) / 100);
    }
  };

  return (
    <div style={{ paddingTop: 4 }}>
      <label
        className="font-semibold ed-muted"
        style={{ fontSize: 13, display: "block", marginBottom: 8 }}
      >
        Enter your answer:
      </label>
      <input
        type="number"
        step="0.01"
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Type a number…"
        style={{
          width: 200,
          padding: "10px 14px",
          border: "1.5px solid var(--rule-firm)",
          fontSize: 16,
          fontFamily: "inherit",
          background: disabled ? "var(--paper-sunk)" : "var(--paper)",
          color: "var(--ink)",
                  }}
      />
      <p className="ed-muted" style={{ fontSize: 12, marginTop: 6 }}>
        Up to 2 decimal places. No negative marking for TITA.
      </p>
    </div>
  );
}
