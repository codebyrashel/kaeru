"use server";

import { prisma } from "database";
import type { MediaType } from "database";
import { fetchAniListMedia, type AniListSort } from "@/lib/anilist";
import type { MediaPage, NormalizedMedia } from "@/lib/media-types";
import { CATEGORY_TO_ANILIST } from "@/lib/media-category";
import { DEMO_USER_ID } from "@/lib/demo-user";

export async function searchMedia(
  query: string,
  category: Exclude<MediaType, "MOVIE">,
  page = 1,
): Promise<MediaPage> {
  if (!query.trim()) return { results: [], hasNextPage: false };
  const { type, country } = CATEGORY_TO_ANILIST[category];
  return fetchAniListMedia({ search: query, type, countryOfOrigin: country, page });
}

export async function getDiscoveryMedia(
  category: Exclude<MediaType, "MOVIE">,
  sort: AniListSort,
  page = 1,
): Promise<MediaPage> {
  const { type, country } = CATEGORY_TO_ANILIST[category];
  return fetchAniListMedia({ type, countryOfOrigin: country, sort, page });
}

export async function addToLibrary(category: MediaType, result: NormalizedMedia) {
  const externalSource = category === "MOVIE" ? "TMDB" : "ANILIST";

  const media = await prisma.media.upsert({
    where: { externalSource_externalId: { externalSource, externalId: result.externalId } },
    update: {},
    create: {
      type: category,
      externalSource,
      externalId: result.externalId,
      title: result.title,
      coverImageUrl: result.coverImageUrl,
      synopsis: result.synopsis,
      releaseYear: result.releaseYear,
      totalEpisodes: result.totalEpisodes,
      totalChapters: result.totalChapters,
      genres: result.genres,
      releaseStatus: result.releaseStatus,
    },
  });

  await prisma.libraryEntry.upsert({
    where: { userId_mediaId: { userId: DEMO_USER_ID, mediaId: media.id } },
    update: {},
    create: { userId: DEMO_USER_ID, mediaId: media.id },
  });

  return media;
}
