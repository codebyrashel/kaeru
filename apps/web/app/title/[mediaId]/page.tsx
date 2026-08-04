import Link from "next/link";
import { notFound } from "next/navigation";
import { getLibraryEntryByMediaId } from "@/lib/library";
import { CATEGORY_STYLES } from "@/lib/media-style";
import { StatusSelector } from "@/components/status-selector";
import { ProgressStepper } from "@/components/progress-stepper";
import type { MediaType } from "database";

export default async function TitleDetailPage({
  params,
}: {
  params: Promise<{ mediaId: string }>;
}) {
  const { mediaId } = await params;
  const id = Number(mediaId);
  if (Number.isNaN(id)) notFound();

  const entry = await getLibraryEntryByMediaId(id);

  if (!entry) {
    return (
      <div className="px-6 py-5">
        <p className="text-sm text-text-secondary">
          This title isn&apos;t in your library yet.{" "}
          <Link href="/anime" className="text-accent-text underline">
            Browse and add it
          </Link>{" "}
          to track progress.
        </p>
      </div>
    );
  }

  const { media } = entry;
  const category = CATEGORY_STYLES[media.type as MediaType];
  const isChapterBased = media.type !== "ANIME" && media.type !== "MOVIE";

  return (
    <div className="px-6 py-5">
      <div className="mb-5 flex gap-5">
        <div className={`h-56 w-40 shrink-0 overflow-hidden rounded-[10px] ${category.bg}`}>
          {media.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.coverImageUrl} alt={media.title} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex-1">
          <span className={`mb-2 inline-block rounded px-2 py-0.5 text-[11px] ${category.bg} ${category.text}`}>
            {category.label}
          </span>
          <h1 className="mb-1 text-xl font-medium text-text-primary">{media.title}</h1>
          <p className="mb-3 text-sm text-text-muted">
            {media.releaseYear ?? "—"}
            {media.genres.length > 0 && ` · ${media.genres.join(", ")}`}
          </p>
          {media.synopsis && (
            <p
              className="mb-4 max-w-2xl text-sm leading-relaxed text-text-secondary"
              dangerouslySetInnerHTML={{ __html: media.synopsis }}
            />
          )}
          <StatusSelector entryId={entry.id} current={entry.status} />
        </div>
      </div>

      <div className="max-w-sm rounded-[10px] bg-surface-1 p-4">
        <p className="mb-3 text-sm text-text-secondary">
          {isChapterBased ? "Chapter progress" : "Episode progress"}
        </p>
        <ProgressStepper
          entryId={entry.id}
          current={(isChapterBased ? entry.currentChapter : entry.currentEpisode) ?? 0}
          total={isChapterBased ? media.totalChapters : media.totalEpisodes}
          field={isChapterBased ? "currentChapter" : "currentEpisode"}
          unitLabel={isChapterBased ? "ch" : "ep"}
        />
      </div>
    </div>
  );
}
