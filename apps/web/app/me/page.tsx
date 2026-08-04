import { prisma } from "database";
import { DEMO_USER_ID } from "@/lib/demo-user";
import { getLibraryStats, getActivity, computeStreak } from "@/lib/stats";
import { StatCard } from "@/components/stat-card";
import { TimeSplitDonut } from "@/components/time-split-donut";
import { GenreBars } from "@/components/genre-bars";
import { ActivityHeatmap } from "@/components/activity-heatmap";

export default async function MePage() {
  const [user, stats, activity] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: DEMO_USER_ID } }),
    getLibraryStats(),
    getActivity(),
  ]);

  const streak = computeStreak(activity);

  return (
    <div className="px-6 py-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-bg text-[15px] font-medium text-accent-text">
          {(user.name ?? user.email).slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-medium text-text-primary">
            {user.name ?? user.email}
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">
            Tracking since{" "}
            {user.createdAt.toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-warning-bg px-3 py-1.5 text-xs text-warning-text">
            🔥 {streak} day{streak === 1 ? "" : "s"} streak
          </div>
        )}
      </div>

      <div className="mb-5 grid grid-cols-5 gap-2.5">
        <StatCard label="Anime watched" value={stats.countsByType.ANIME} />
        <StatCard label="Episodes" value={stats.episodesWatched} />
        <StatCard
          label="Manga/manhwa/manhua"
          value={stats.countsByType.MANGA + stats.countsByType.MANHWA + stats.countsByType.MANHUA}
        />
        <StatCard label="Chapters" value={stats.chaptersRead} />
        <StatCard label="Est. hours" value={stats.estimatedHours} />
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-6">
        <TimeSplitDonut countsByType={stats.countsByType} total={stats.totalTitles} />
        <div className="flex flex-col gap-5">
          {stats.topGenres.length > 0 && <GenreBars genres={stats.topGenres} />}
          <ActivityHeatmap days={activity} />
        </div>
      </div>

      <p className="mt-4 text-[11px] text-text-muted">
        Est. hours is a rough estimate based on average episode/chapter length, not tracked watch time.
      </p>
    </div>
  );
}
