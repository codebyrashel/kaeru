import type { ActivityDay } from "@/lib/stats";

const LEVEL_OPACITY: Record<ActivityDay["level"], string> = {
  0: "bg-surface-2",
  1: "bg-accent/25",
  2: "bg-accent/50",
  3: "bg-accent/75",
  4: "bg-accent",
};

export function ActivityHeatmap({ days }: { days: ActivityDay[] }) {
  return (
    <div>
      <p className="mb-2 text-xs text-text-secondary">
        Activity, last {Math.round(days.length / 7)} weeks
      </p>
      <div className="grid grid-cols-14 gap-0.75">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} update${day.count === 1 ? "" : "s"}`}
            className={`aspect-square rounded-xs ${LEVEL_OPACITY[day.level]}`}
          />
        ))}
      </div>
    </div>
  );
}
