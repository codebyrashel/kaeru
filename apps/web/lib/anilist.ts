const ANILIST_ENDPOINT = "https://graphql.anilist.co";

const SEARCH_QUERY = `
  query ($search: String, $type: MediaType, $countryOfOrigin: CountryCode) {
    Page(page: 1, perPage: 12) {
      media(
        search: $search
        type: $type
        countryOfOrigin: $countryOfOrigin
        sort: SEARCH_MATCH
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
      }
    }
  }
`;

export type AniListType = "ANIME" | "MANGA";
export type AniListCountry = "JP" | "KR" | "CN";

export interface NormalizedMedia {
  externalId: string;
  title: string;
  coverImageUrl: string | null;
  synopsis: string | null;
  releaseYear: number | null;
  totalEpisodes: number | null;
  totalChapters: number | null;
  genres: string[];
}

interface AniListResponse {
  data?: {
    Page: {
      media: Array<{
        id: number;
        title: { romaji: string | null; english: string | null };
        coverImage: { large: string | null };
        description: string | null;
        startDate: { year: number | null };
        episodes: number | null;
        chapters: number | null;
        genres: string[];
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export async function searchAniList(
  query: string,
  type: AniListType,
  countryOfOrigin?: AniListCountry,
): Promise<NormalizedMedia[]> {
  const response = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: { search: query, type, countryOfOrigin },
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

  return (json.data?.Page.media ?? []).map((m) => ({
    externalId: String(m.id),
    title: m.title.english ?? m.title.romaji ?? "Untitled",
    coverImageUrl: m.coverImage.large,
    synopsis: m.description,
    releaseYear: m.startDate.year,
    totalEpisodes: m.episodes,
    totalChapters: m.chapters,
    genres: m.genres ?? [],
  }));
}