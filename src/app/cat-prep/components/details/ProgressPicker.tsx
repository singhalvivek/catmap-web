// ProgressPicker — 3-button progress status row; triggers sign-in modal when not logged in
"use client";

import { ProgressStatus } from "../../models/progress";

const STATUS_OPTIONS = [
  { value: ProgressStatus.NOT_STARTED, label: "Not started", state: "inert" },
  { value: ProgressStatus.IN_PROGRESS, label: "In progress", state: "caution" },
  { value: ProgressStatus.COMPLETED, label: "Done", state: "correct" },
] as const;

export default function ProgressPicker({
  status,
  isLoggedIn,
  saving,
  error,
  onStatusChange,
  onNeedSignIn,
}: {
  status: ProgressStatus;
  isLoggedIn: boolean;
  saving: boolean;
  error: string | null;
  onStatusChange: (s: ProgressStatus) => void;
  onNeedSignIn: () => void;
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p className="ed-kicker" style={{ margin: "0 0 10px" }}>
        Your progress
      </p>
      {/* A three-way choice, so radiogroup rather than three buttons whose selected state
          existed only as a border colour. */}
      <div className="status-picker" role="radiogroup" aria-label="Your progress">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={status === s.value}
            onClick={() => {
              if (!isLoggedIn) {
                onNeedSignIn();
                return;
              }
              onStatusChange(s.value);
            }}
            disabled={saving}
            aria-busy={saving}
            className="status-picker__option"
            data-state={s.state}
          >
            {s.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="ed-notice" data-state="wrong" role="alert" style={{ marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
}
