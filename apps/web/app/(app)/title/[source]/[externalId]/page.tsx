import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getLibraryEntryByExternalId } from "@/lib/library";
import { fetchAniListMediaById } from "@/lib/api/anilist";
import { fetchTmdbMovieById } from "@/lib/api/tmdb";
import { anilistToMediaType } from "@/lib/media-category";
import { CATEGORY_STYLES } from "@/lib/media-style";
import { StatusSelector } from "@/components/library/status-selector";
import { ProgressStepper } from "@/components/library/progress-stepper";
import { CoverImage } from "@/components/shared/cover-image";
import { AddToLibraryButton } from "@/components/discovery/add-to-library-button";
import { RemoveLinkButton } from "@/components/library/remove-link-button";
import type { NormalizedMedia } from "@/lib/media-types";
import type { MediaType } from "database";

export default async function TitleDetailPage({
  params,
}: {
  params: Promise<{ source: string; externalId: string }>;
}) {
  const { source, externalId } = await params;
  if (source !== "anilist" && source !== "tmdb") notFound();

  const session = await auth();
  const userId = session!.user.id;

  const owned = await getLibraryEntryByExternalId(userId, source === "anilist" ? "ANILIST" : "TMDB", externalId);

  if (owned) {
    const { media } = owned;
    const category = CATEGORY_STYLES[media.type as MediaType];
    const isChapterBased = media.type !== "ANIME" && media.type !== "MOVIE";
    const total = isChapterBased ? media.totalChapters : media.totalEpisodes;
    const ongoing = !total && media.releaseStatus === "RELEASING";

    return (
      <div className="px-6 py-5">
        <div className="mb-5 flex gap-5">
          <div className={`relative aspect-2/3 w-40 shrink-0 overflow-hidden rounded-[10px] ${category.bg}`}>
            <div className={`absolute inset-0 flex items-center justify-center text-xs ${category.text}`}>
              {category.label}
            </div>
            {media.coverImageUrl && (
              <CoverImage
                src={media.coverImageUrl}
                alt={media.title}
                className="absolute inset-0 h-full w-full object-cover"
                sizes="160px"
              />
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
              {ongoing && " · Ongoing"}
            </p>
            {media.synopsis && (
              <p
                className="mb-4 max-w-2xl text-sm leading-relaxed text-text-secondary"
                dangerouslySetInnerHTML={{ __html: media.synopsis }}
              />
            )}
            <StatusSelector entryId={owned.id} current={owned.status} />
            <RemoveLinkButton entryId={owned.id} />
          </div>
        </div>

        {media.type !== "MOVIE" && (
          <div className="max-w-sm rounded-[10px] bg-surface-1 p-4">
            <p className="mb-3 text-sm text-text-secondary">
              {isChapterBased ? "Chapter progress" : "Episode progress"}
            </p>
            <ProgressStepper
              entryId={owned.id}
              current={(isChapterBased ? owned.currentChapter : owned.currentEpisode) ?? 0}
              total={total}
              field={isChapterBased ? "currentChapter" : "currentEpisode"}
              unitLabel={isChapterBased ? "ch" : "ep"}
              ongoing={ongoing}
            />
          </div>
        )}
      </div>
    );
  }

  let category: MediaType;
  let detail: NormalizedMedia | null;

  if (source === "anilist") {
    const result = await fetchAniListMediaById(externalId);
    if (!result) notFound();
    category = anilistToMediaType(result.anilistType, result.countryOfOrigin);
    detail = result;
  } else {
    const result = await fetchTmdbMovieById(externalId);
    if (!result) notFound();
    category = "MOVIE";
    detail = result;
  }

  const style = CATEGORY_STYLES[category];

  return (
    <div className="px-6 py-5">
      <div className="mb-5 flex gap-5">
        <div className={`relative aspect-2/3 w-40 shrink-0 overflow-hidden rounded-[10px] ${style.bg}`}>
          <div className={`absolute inset-0 flex items-center justify-center text-xs ${style.text}`}>
            {style.label}
          </div>
          {detail.coverImageUrl && (
            <CoverImage
              src={detail.coverImageUrl}
              alt={detail.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <span className={`mb-2 inline-block rounded px-2 py-0.5 text-[11px] ${style.bg} ${style.text}`}>
            {style.label}
          </span>
          <h1 className="mb-1 text-xl font-medium text-text-primary">{detail.title}</h1>
          <p className="mb-3 text-sm text-text-muted">
            {detail.releaseYear ?? "—"}
            {detail.genres.length > 0 && ` · ${detail.genres.join(", ")}`}
          </p>
          {detail.synopsis && (
            <p
              className="mb-4 max-w-2xl text-sm leading-relaxed text-text-secondary"
              dangerouslySetInnerHTML={{ __html: detail.synopsis }}
            />
          )}
          <AddToLibraryButton category={category} result={detail} />
        </div>
      </div>
      <p className="text-sm text-text-muted">Add this to your library to start tracking progress.</p>
    </div>
  );
}
