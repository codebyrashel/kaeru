"use server";

import { prisma } from "database";
import type { MediaType } from "database";
import { fetchAniListMedia, type NormalizedMedia, type AniListSort } from "@/lib/anilist";
import { CATEGORY_TO_ANILIST } from "@/lib/media-category";
import { DEMO_USER_ID } from "@/lib/demo-user";

export async function searchMedia(
  query: string,
  category: Exclude<MediaType, "MOVIE">,
): Promise<NormalizedMedia[]> {
  if (!query.trim()) return [];
  const { type, country } = CATEGORY_TO_ANILIST[category];
  return fetchAniListMedia({ search: query, type, countryOfOrigin: country });
}

export async function getDiscoveryMedia(
  category: Exclude<MediaType, "MOVIE">,
  sort: AniListSort,
): Promise<NormalizedMedia[]> {
  const { type, country } = CATEGORY_TO_ANILIST[category];
  return fetchAniListMedia({ type, countryOfOrigin: country, sort });
}

export async function addToLibrary(category: MediaType, result: NormalizedMedia) {
  const media = await prisma.media.upsert({
    where: {
      externalSource_externalId: {
        externalSource: "ANILIST",
        externalId: result.externalId,
      },
    },
    update: {},
    create: {
      type: category,
      externalSource: "ANILIST",
      externalId: result.externalId,
      title: result.title,
      coverImageUrl: result.coverImageUrl,
      synopsis: result.synopsis,
      releaseYear: result.releaseYear,
      totalEpisodes: result.totalEpisodes,
      totalChapters: result.totalChapters,
      genres: result.genres,
    },
  });

  await prisma.libraryEntry.upsert({
    where: { userId_mediaId: { userId: DEMO_USER_ID, mediaId: media.id } },
    update: {},
    create: { userId: DEMO_USER_ID, mediaId: media.id },
  });

  return media;
}
