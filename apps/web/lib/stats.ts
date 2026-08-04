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

  // Heuristic estimate, not tracked watch time — flagged as such in the UI.
  const estimatedMinutes =
    episodesWatched * 24 + chaptersRead * 6 + countsByType.MOVIE * 110;

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

export async function getActivity(weeks = 12): Promise<ActivityDay[]> {
  const totalDays = weeks * 7;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (totalDays - 1));

  const logs = await prisma.progressLog.findMany({
    where: { userId: DEMO_USER_ID, loggedAt: { gte: start } },
    select: { loggedAt: true },
  });

  const countsByDay = new Map<string, number>();
  for (const log of logs) {
    const key = log.loggedAt.toISOString().slice(0, 10);
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  const days: ActivityDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const count = countsByDay.get(key) ?? 0;
    const level: ActivityDay["level"] =
      count === 0 ? 0 : count === 1 ? 1 : count <= 2 ? 2 : count <= 4 ? 3 : 4;
    days.push({ date: key, count, level });
  }

  return days;
}

export function computeStreak(activity: ActivityDay[]): number {
  const mostRecentFirst = [...activity].reverse();
  let streak = 0;

  for (let i = 0; i < mostRecentFirst.length; i++) {
    const day = mostRecentFirst[i];
    if (day.count > 0) {
      streak += 1;
    } else if (i === 0) {
      // No activity yet today doesn't break the streak — the day isn't over.
      continue;
    } else {
      break;
    }
  }

  return streak;
}
