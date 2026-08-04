import type { ActivityDay } from "@/lib/stats";

const LEVEL_COLOR: Record<ActivityDay["level"], string> = {
  0: "bg-surface-2",
  1: "bg-accent/25",
  2: "bg-accent/50",
  3: "bg-accent/75",
  4: "bg-accent",
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const CELL = 10;
const GAP = 3;

function buildMonthColumns(monthDays: ActivityDay[]): (ActivityDay | null)[][] {
  if (monthDays.length === 0) return [];

  const firstWeekday = new Date(monthDays[0].date).getDay();

  const colCount = Math.ceil((firstWeekday + monthDays.length) / 7);

  const columns: (ActivityDay | null)[][] = Array.from(
    { length: colCount },
    () => Array(7).fill(null),
  );

  monthDays.forEach((day, idx) => {
    const cellIndex = firstWeekday + idx;
    columns[Math.floor(cellIndex / 7)][cellIndex % 7] = day;
  });

  return columns;
}

export function ActivityHeatmap({
  days,
  year,
}: {
  days: ActivityDay[];
  year: number;
}) {
  const months = Array.from({ length: 12 }, (_, month) =>
    days.filter((day) => new Date(day.date).getMonth() === month),
  );

  return (
    <div className="rounded-[10px] border border-border bg-surface-1 p-4">
      <p className="mb-1 text-xs text-text-secondary">
        Your {year} in updates
      </p>

      <p className="mb-3 text-[11px] text-text-muted">
        Every episode, chapter, and rewatch — mapped out one square at a time.
      </p>

      <div className="w-full overflow-x-auto">
        <div className="inline-flex min-w-max">
          {/* Day Labels */}
          <div
            className="flex flex-col pr-2 pt-3.75"
            style={{ gap: GAP }}
          >
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[9px] leading-none text-text-muted"
                style={{
                  height: CELL,
                  lineHeight: `${CELL}px`,
                  flexShrink: 0,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Months */}
          <div className="flex gap-2">
            {months.map((monthDays, monthIndex) => {
              const columns = buildMonthColumns(monthDays);

              return (
                <div
                  key={monthIndex}
                  className="flex flex-col shrink-0"
                >
                  <div className="h-3.25 text-[9px] text-text-muted">
                    {MONTH_NAMES[monthIndex]}
                  </div>

                  <div
                    className="flex"
                    style={{ gap: GAP }}
                  >
                    {columns.map((column, columnIndex) => (
                      <div
                        key={columnIndex}
                        className="flex flex-col"
                        style={{ gap: GAP }}
                      >
                        {column.map((day, rowIndex) =>
                          day ? (
                            <div
                              key={rowIndex}
                              title={`${day.date}: ${day.count} update${
                                day.count === 1 ? "" : "s"
                              }`}
                              className={`rounded-xs ${LEVEL_COLOR[day.level]}`}
                              style={{
                                width: CELL,
                                height: CELL,
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              key={rowIndex}
                              style={{
                                width: CELL,
                                height: CELL,
                                flexShrink: 0,
                              }}
                            />
                          ),
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}