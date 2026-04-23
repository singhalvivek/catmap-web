// NodeHeader — node type badge, title, and progress status picker with login/error hints
"use client";

import { Node } from "../../models/node";
import { ProgressStatus, ProgressMeta } from "../../models/progress";

export default function NodeHeader({
  node,
  status,
  isLoggedIn,
  savingProgress,
  progressError,
  onStatusChange,
}: {
  node: Node;
  status: ProgressStatus;
  isLoggedIn: boolean;
  savingProgress: boolean;
  progressError: string | null;
  onStatusChange: (status: ProgressStatus) => Promise<void>;
}) {
  const meta = ProgressMeta[status] ?? ProgressMeta.NOT_STARTED;

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-500">{node.type}</div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-trust-navy">{node.title}</h1>
        <select
          value={status}
          disabled={!isLoggedIn || savingProgress}
          onChange={(e) => onStatusChange(e.target.value as ProgressStatus)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border border-calm-border bg-calm-bg ${meta.color} disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {Object.values(ProgressStatus).map((key) => (
            <option key={key} value={key}>
              {ProgressMeta[key].label}
            </option>
          ))}
        </select>
      </div>
      {!isLoggedIn && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 inline-block">
          Login with Google to save progress.
        </p>
      )}
      {progressError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1 inline-block">
          {progressError}
        </p>
      )}
    </div>
  );
}
