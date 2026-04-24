// ProgressPicker — 3-button progress status row with login hint and error state
"use client";

import { ProgressStatus } from "../../models/progress";

const STATUS_OPTIONS = [
  { value: ProgressStatus.NOT_STARTED, label: "Not Started", color: "#94A3B8", bg: "#F8FAFC" },
  { value: ProgressStatus.IN_PROGRESS, label: "In Progress", color: "#F59E0B", bg: "#FFFBEB" },
  { value: ProgressStatus.COMPLETED,   label: "Done",        color: "#10B981", bg: "#ECFDF5" },
] as const;

export default function ProgressPicker({
  status,
  isLoggedIn,
  saving,
  error,
  onStatusChange,
}: {
  status: ProgressStatus;
  isLoggedIn: boolean;
  saving: boolean;
  error: string | null;
  onStatusChange: (s: ProgressStatus) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="font-semibold mb-2" style={{ fontSize: 12, color: "#64748B" }}>
        Your Progress
      </div>
      <div className="flex gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            disabled={!isLoggedIn || saving}
            style={{
              flex: 1,
              padding: "7px 4px",
              borderRadius: 8,
              border: `2px solid ${status === s.value ? s.color : "#E2E8F0"}`,
              background: status === s.value ? s.bg : "#fff",
              color: status === s.value ? s.color : "#94A3B8",
              fontSize: 11,
              fontWeight: 700,
              cursor: !isLoggedIn || saving ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
              opacity: !isLoggedIn || saving ? 0.6 : 1,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      {!isLoggedIn && (
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: "#94A3B8",
            padding: "4px 8px",
            background: "#F8FAFC",
            borderRadius: 6,
            display: "inline-block",
          }}
        >
          Login with Google to save progress across devices
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
