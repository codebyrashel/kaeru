import type { NormalizedMedia, MediaPage } from "../media-types";

export type { NormalizedMedia, MediaPage } from "../media-types";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

const MEDIA_QUERY = `
  query ($search: String, $type: MediaType, $countryOfOrigin: CountryCode, $sort: [MediaSort], $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
      }
      media(
        search: $search
        type: $type
        countryOfOrigin: $countryOfOrigin
        sort: $sort
      ) {
        id
        title { romaji english }
        coverImage { large }
        description(asHtml: false)
        startDate { year }
        episodes
        chapters
        genres
        averageScore
        status
      }
    }
  }
`;

const MEDIA_BY_ID_QUERY = `
  query ($id: Int) {
    Media(id: $id) {
      id
      type
      countryOfOrigin
      title { romaji english }
      coverImage { large }
      description(asHtml: false)
      startDate { year }
      episodes
      chapters
      genres
      averageScore
      status
    }
  }
`;

export type AniListType = "ANIME" | "MANGA";
export type AniListCountry = "JP" | "KR" | "CN";
export type AniListSort = "TRENDING_DESC" | "POPULARITY_DESC" | "SCORE_DESC" | "SEARCH_MATCH";

interface AniListApiMedia {
  id: number;
  title: { romaji: string | null; english: string | null };
  coverImage: { large: string | null };
  description: string | null;
  startDate: { year: number | null };
  episodes: number | null;
  chapters: number | null;
  genres: string[];
  averageScore: number | null;
  status: string | null;
}

interface AniListResponse {
  data?: { Page: { pageInfo: { hasNextPage: boolean }; media: AniListApiMedia[] } };
  errors?: Array<{ message: string }>;
}

function normalize(m: AniListApiMedia): NormalizedMedia {
  return {
    externalId: String(m.id),
    title: m.title.english ?? m.title.romaji ?? "Untitled",
    coverImageUrl: m.coverImage.large,
    synopsis: m.description,
    releaseYear: m.startDate.year,
    totalEpisodes: m.episodes,
    totalChapters: m.chapters,
    genres: m.genres ?? [],
    averageScore: m.averageScore,
    releaseStatus: m.status,
  };
}

function checkErrors(json: { errors?: Array<{ message: string }> }) {
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(", "));
}

export async function fetchAniListMedia(params: {
  search?: string;
  type: AniListType;
  countryOfOrigin?: AniListCountry;
  sort?: AniListSort;
  page?: number;
  perPage?: number;
}): Promise<MediaPage> {
  const { search, type, countryOfOrigin, page = 1, perPage = 24 } = params;
  const sort = params.sort ?? (search ? "SEARCH_MATCH" : "TRENDING_DESC");

  const response = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      query: MEDIA_QUERY,
      variables: { search: search || undefined, type, countryOfOrigin, sort: [sort], page, perPage },
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error("AniList rate limit reached — please wait a moment and try again.");
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const json = (await response.json()) as AniListResponse;
  checkErrors(json);

  return {
    results: (json.data?.Page.media ?? []).map(normalize),
    hasNextPage: json.data?.Page.pageInfo.hasNextPage ?? false,
  };
}

export interface AniListMediaDetail extends NormalizedMedia {
  anilistType: AniListType;
  countryOfOrigin: string | null;
}

export async function fetchAniListMediaById(id: string): Promise<AniListMediaDetail | null> {
  const response = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: MEDIA_BY_ID_QUERY, variables: { id: Number(id) } }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error("AniList rate limit reached — please wait a moment and try again.");
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: { Media: (AniListApiMedia & { type: AniListType; countryOfOrigin: string | null }) | null };
    errors?: Array<{ message: string }>;
  };
  checkErrors(json);

  const media = json.data?.Media;
  if (!media) return null;

  return { ...normalize(media), anilistType: media.type, countryOfOrigin: media.countryOfOrigin };
}
