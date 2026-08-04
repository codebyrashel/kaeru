import type { LibraryStatus } from "database";

export const STATUS_SLUGS = ["plan-to-watch", "completed", "on-hold"] as const;
export type StatusSlug = (typeof STATUS_SLUGS)[number];

export const SLUG_TO_STATUS: Record<StatusSlug, LibraryStatus> = {
  "plan-to-watch": "PLAN_TO_WATCH",
  completed: "COMPLETED",
  "on-hold": "ON_HOLD",
};

export const STATUS_SLUG_LABELS: Record<StatusSlug, string> = {
  "plan-to-watch": "Plan to watch",
  completed: "Completed",
  "on-hold": "On hold",
};