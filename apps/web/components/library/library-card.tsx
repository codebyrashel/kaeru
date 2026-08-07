import Link from "next/link";
import { CATEGORY_STYLES, STATUS_STYLES } from "@/lib/media-style";
import { progressPercent } from "@/lib/progress";
import { CoverImage } from "@/components/shared/cover-image";
import type { LibraryEntry, Media, MediaType, LibraryStatus } from "database";
import { RemoveFromLibraryButton } from "@/components/library/remove-from-library-button";

type EntryWithMedia = LibraryEntry & { media: Media };

export function LibraryCard({ entry }: { entry: EntryWithMedia }) {
  const category = CATEGORY_STYLES[entry.media.type as MediaType];
  const status = STATUS_STYLES[entry.status as LibraryStatus];
  const percent = progressPercent(entry);
  const sourceSlug = entry.media.externalSource === "ANILIST" ? "anilist" : "tmdb";

  return (
    <Link
      href={`/title/${sourceSlug}/${entry.media.externalId}`}
      className="block overflow-hidden rounded-[10px] bg-surface-1 transition-transform hover:scale-[1.02]"
    >
      <div className={`relative flex aspect-2/3 items-center justify-center ${category.bg}`}>
        <span className={`text-xs ${category.text}`}>{category.label}</span>
        {entry.media.coverImageUrl && (
          <CoverImage
            src={entry.media.coverImageUrl}
            alt={entry.media.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className={`absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-[10px] ${category.bg} ${category.text}`}>
          {category.label}
        </span>
        <RemoveFromLibraryButton entryId={entry.id} />
      </div>
      <div className="p-2.5">
        <p className="mb-1.5 truncate text-xs font-medium text-text-primary">{entry.media.title}</p>
        {(entry.status === "WATCHING" || entry.status === "READING") && percent !== null ? (
          <>
            <div className="mb-1 h-1 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-[11px] text-text-muted">
              {entry.currentEpisode ?? entry.currentChapter ?? 0} /{" "}
              {entry.media.totalEpisodes ?? entry.media.totalChapters ?? "?"}
            </p>
          </>
        ) : (
          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        )}
      </div>
    </Link>
  );
}
