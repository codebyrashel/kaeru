import { prisma } from "database";
import { DEMO_USER_ID } from "./demo-user";
import type { MediaType } from "database";

export interface LibraryStats {
  countsByType: Record<MediaType, number>;
  totalTitles: number;
  episodesWatched: number;
  chaptersRead: number;
  estimatedHours: number;
  topGenres: { genre: string; count: number }[];
}

export async function getLibraryStats(): Promise<LibraryStats> {
  const entries = await prisma.libraryEntry.findMany({
    where: { userId: DEMO_USER_ID },
    select: {
      currentEpisode: true,
      currentChapter: true,
      media: { select: { type: true, genres: true } },
    },
  });

  const countsByType: Record<MediaType, number> = {
    ANIME: 0,
    MANGA: 0,
    MANHWA: 0,
    MANHUA: 0,
    MOVIE: 0,
  };
  let episodesWatched = 0;
  let chaptersRead = 0;
  const genreCounts = new Map<string, number>();

  for (const entry of entries) {
    const type = entry.media.type as MediaType;
    countsByType[type] += 1;
    episodesWatched += entry.currentEpisode ?? 0;
    chaptersRead += entry.currentChapter ?? 0;
    for (const genre of entry.media.genres) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
    }
  }

  const estimatedMinutes = episodesWatched * 24 + chaptersRead * 6 + countsByType.MOVIE * 110;

  const topGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  return {
    countsByType,
    totalTitles: entries.length,
    episodesWatched,
    chaptersRead,
    estimatedHours: Math.round(estimatedMinutes / 60),
    topGenres,
  };
}

export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// Always derive date keys from LOCAL date parts, never toISOString()
// (which is UTC) — mixing the two caused today's activity to sometimes
// not appear for timezones ahead of UTC.
function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function getActivity(year = new Date().getFullYear()): Promise<ActivityDay[]> {
  const start = new Date(year, 0, 1, 0, 0, 0, 0);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);

  const logs = await prisma.progressLog.findMany({
    where: { userId: DEMO_USER_ID, loggedAt: { gte: start, lte: end } },
    select: { loggedAt: true },
  });

  const countsByDay = new Map<string, number>();
  for (const log of logs) {
    const key = dateKey(log.loggedAt);
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  const days: ActivityDay[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = dateKey(cursor);
    const count = countsByDay.get(key) ?? 0;
    const level: ActivityDay["level"] =
      count === 0 ? 0 : count === 1 ? 1 : count <= 2 ? 2 : count <= 4 ? 3 : 4;
    days.push({ date: key, count, level });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function computeStreak(activity: ActivityDay[]): number {
  const todayKey = dateKey(new Date());
  const upToToday = activity.filter((d) => d.date <= todayKey);
  const mostRecentFirst = [...upToToday].reverse();
  let streak = 0;

  for (let i = 0; i < mostRecentFirst.length; i++) {
    const day = mostRecentFirst[i];
    if (day.count > 0) {
      streak += 1;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}