// RoadmapNav — hero button row for switching the roadmap view mode (Learn / Practice / PYQ)
"use client";

export type Mode = "learn" | "practice" | "pyq";

const ITEMS: { key: Mode; label: string }[] = [
  { key: "learn", label: "Learn" },
  { key: "practice", label: "Practice" },
  { key: "pyq", label: "PYQ" },
];

const PILL_STYLE = {
  padding: "9px 20px",
  borderRadius: 999,
  fontSize: 14,
  fontFamily: "inherit",
  transition: "all 0.18s",
  cursor: "pointer",
} as const;

export default function RoadmapNav({
  mode,
  onModeChange,
}: {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap" style={{ marginBottom: 20 }}>
      {ITEMS.map((item) => {
        const isActive = mode === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onModeChange(item.key)}
            className="font-bold"
            style={{
              ...PILL_STYLE,
              border: `1.5px solid ${isActive ? "#1E3A5F" : "rgba(30,58,95,0.18)"}`,
              background: isActive ? "#1E3A5F" : "#fff",
              color: isActive ? "#fff" : "#1E3A5F",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
