/**
 * Day calculation based on calendar days (midnight-to-midnight).
 *
 * Day 1 = the calendar day the lead was created.
 * Day 2 = the next calendar day (after midnight).
 *
 * Example:
 *   Lead added at 23:50 on Monday → Day 1 all of Monday
 *   At 00:01 Tuesday → Day 2
 *
 * Uses the server's local timezone for calendar-day normalization.
 */
export function getDayNumber(createdAt: Date): number {
  const now = new Date();
  const created = new Date(createdAt);

  // Strip time — compare calendar dates only
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const createdMidnight = new Date(
    created.getFullYear(),
    created.getMonth(),
    created.getDate()
  );

  const diffMs = todayMidnight.getTime() - createdMidnight.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return diffDays + 1; // Day 1 = created today
}

export const DAY_LABELS: Record<number, string> = {
  1: "Day 1 — Engage",
  2: "Day 2 — Engage & Follow",
  3: "Day 3 — Engage & DM",
  4: "Day 4 — Waiting",
  5: "Day 5 — Follow-up",
};

export const DAY_COLORS: Record<number, string> = {
  1: "#3b82f6", // blue
  2: "#8b5cf6", // violet
  3: "#f97316", // orange
  4: "#6b7280", // gray
  5: "#ef4444", // red
};

export const DAY_BG_COLORS: Record<number, string> = {
  1: "rgba(59,130,246,0.08)",
  2: "rgba(139,92,246,0.08)",
  3: "rgba(249,115,22,0.08)",
  4: "rgba(107,114,128,0.08)",
  5: "rgba(239,68,68,0.08)",
};
