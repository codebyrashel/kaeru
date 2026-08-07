export function GenreBars({ genres }: { genres: { genre: string; count: number }[] }) {
  const max = genres[0]?.count ?? 1;

  return (
    <div>
      <p className="mb-2.5 text-xs text-text-secondary">Top genres</p>
      <div className="flex flex-col gap-2">
        {genres.map(({ genre, count }) => (
          <div key={genre}>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-text-primary">{genre}</span>
              <span className="text-text-muted">{count}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full bg-accent"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
