export function progressPercent(entry: {
  currentEpisode: number | null;
  currentChapter: number | null;
  media: { totalEpisodes: number | null; totalChapters: number | null };
}): number | null {
  const current = entry.currentEpisode ?? entry.currentChapter ?? 0;
  const total = entry.media.totalEpisodes ?? entry.media.totalChapters ?? null;
  if (!total || total === 0) return null;
  return Math.min(100, Math.round((current / total) * 100));
}