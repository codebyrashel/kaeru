const ANILIST_ENDPOINT = "https://graphql.anilist.co";

const MEDIA_QUERY = `
  query ($search: String, $type: MediaType, $countryOfOrigin: CountryCode, $sort: [MediaSort]) {
    Page(page: 1, perPage: 15) {
      media(
        search: $search
        type: $type
        countryOfOrigin: $countryOfOrigin
        sort: $sort
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        description(asHtml: false)
        startDate {
          year
        }
        episodes
        chapters
        genres
        averageScore
      }
    }
  }
`;

export type AniListType = "ANIME" | "MANGA";
export type AniListCountry = "JP" | "KR" | "CN";
export type AniListSort = "TRENDING_DESC" | "POPULARITY_DESC" | "SCORE_DESC" | "SEARCH_MATCH";

export interface NormalizedMedia {
  externalId: string;
  title: string;
  coverImageUrl: string | null;
  synopsis: string | null;
  releaseYear: number | null;
  totalEpisodes: number | null;
  totalChapters: number | null;
  genres: string[];
  averageScore: number | null;
}

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
}

interface AniListResponse {
  data?: { Page: { media: AniListApiMedia[] } };
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
  };
}

export async function fetchAniListMedia(params: {
  search?: string;
  type: AniListType;
  countryOfOrigin?: AniListCountry;
  sort?: AniListSort;
}): Promise<NormalizedMedia[]> {
  const { search, type, countryOfOrigin } = params;
  const sort = params.sort ?? (search ? "SEARCH_MATCH" : "TRENDING_DESC");

  const response = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      query: MEDIA_QUERY,
      variables: { search: search || undefined, type, countryOfOrigin, sort: [sort] },
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const json = (await response.json()) as AniListResponse;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return (json.data?.Page.media ?? []).map(normalize);
}
