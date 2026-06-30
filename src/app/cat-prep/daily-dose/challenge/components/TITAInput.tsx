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
        className="font-semibold text-slate-500"
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
          borderRadius: 9,
          border: "1.5px solid #CBD5E1",
          fontSize: 16,
          fontFamily: "inherit",
          background: disabled ? "#F8FAFC" : "#fff",
          color: "#1E3A5F",
          outline: "none",
        }}
      />
      <p className="text-slate-400" style={{ fontSize: 12, marginTop: 6 }}>
        Up to 2 decimal places. No negative marking for TITA.
      </p>
    </div>
  );
}
