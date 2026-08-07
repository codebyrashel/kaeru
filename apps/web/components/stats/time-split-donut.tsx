import type { MediaType } from "database";

const RING_COLORS: Record<MediaType, string> = {
  ANIME: "#7f77dd",
  MANGA: "#1d9e75",
  MANHWA: "#d85a30",
  MANHUA: "#d4537e",
  MOVIE: "#378add",
};

export function TimeSplitDonut({
  countsByType,
  total,
}: {
  countsByType: Record<MediaType, number>;
  total: number;
}) {
  const types = Object.keys(countsByType) as MediaType[];

  let cursor = 0;
  const stops = types
    .filter((t) => countsByType[t] > 0)
    .map((t) => {
      const pct = (countsByType[t] / total) * 100;
      const stop = `${RING_COLORS[t]} ${cursor}% ${cursor + pct}%`;
      cursor += pct;
      return stop;
    });

  const gradient = total > 0 ? `conic-gradient(${stops.join(",")})` : "var(--surface-2)";

  return (
    <div className="flex flex-col items-center rounded-[10px] bg-surface-1 p-4">
      <p className="mb-3 self-start text-xs text-text-secondary">Time split</p>
      <div
        className="flex h-28 w-28 items-center justify-center rounded-full"
        style={{ background: gradient }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-1 text-[11px] text-text-secondary">
          {total} titles
        </div>
      </div>
      <div className="mt-3.5 flex w-full flex-col gap-1">
        {types
          .filter((t) => countsByType[t] > 0)
          .map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ background: RING_COLORS[t] }}
              />
              {t.toLowerCase()} {Math.round((countsByType[t] / total) * 100)}%
            </div>
          ))}
      </div>
    </div>
  );
}
