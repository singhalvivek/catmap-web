// progress — ProgressStatus enum and ProgressMeta display config
export enum ProgressStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export const ProgressMeta = {
  NOT_STARTED: {
    label: "Not Started",
    color: "bg-orange-200 text-gray-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-yellow-100 text-orange-700",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
};