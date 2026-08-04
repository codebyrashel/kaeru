import { CATEGORY_STYLES, STATUS_STYLES } from "@/lib/media-style";
import { progressPercent } from "@/lib/library";
import type { LibraryEntry, Media, MediaType, LibraryStatus } from "database";

type EntryWithMedia = LibraryEntry & { media: Media };

export function LibraryCard({ entry }: { entry: EntryWithMedia }) {
  const category = CATEGORY_STYLES[entry.media.type as MediaType];
  const status = STATUS_STYLES[entry.status as LibraryStatus];
  const percent = progressPercent(entry);

  return (
    <div className="overflow-hidden rounded-[10px] bg-surface-1">
      <div
        className={`relative flex h-32 items-center justify-center ${category.bg}`}
      >
        {entry.media.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.media.coverImageUrl}
            alt={entry.media.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className={`text-xs ${category.text}`}>{category.label}</span>
        )}
        <span
          className={`absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[10px] ${category.bg} ${category.text}`}
        >
          {category.label}
        </span>
      </div>
      <div className="p-2.5">
        <p className="mb-1.5 truncate text-xs font-medium text-text-primary">
          {entry.media.title}
        </p>
        {percent !== null ? (
          <>
            <div className="mb-1 h-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full bg-accent"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-[11px] text-text-muted">
              {entry.currentEpisode ?? entry.currentChapter ?? 0} /{" "}
              {entry.media.totalEpisodes ?? entry.media.totalChapters ?? "?"}
            </p>
          </>
        ) : (
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
        )}
      </div>
    </div>
  );
}