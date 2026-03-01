export enum ProgressStatus {
  NOT_STARTED = "NOT_STARTED",
  PLANNED = "PLANNED",
  THIS_WEEK = "THIS_WEEK",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export const ProgressMeta = {
  NOT_STARTED: {
    label: "Not Started",
    color: "bg-gray-200 text-gray-700",
  },
  PLANNED: {
    label: "Planned",
    color: "bg-blue-100 text-blue-700",
  },
  THIS_WEEK: {
    label: "This Week",
    color: "bg-yellow-100 text-yellow-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-orange-100 text-orange-700",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
};