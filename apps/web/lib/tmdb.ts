import type { NormalizedMedia, MediaPage } from "./media-types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

export type TmdbSort = "trending" | "popular" | "top_rated";

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string | null;
  release_date: string | null;
  vote_average: number;
  genre_ids: number[];
}

interface TmdbListResponse {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

function authHeaders(): HeadersInit {
  const token = process.env.TMDB_API_KEY;
  if (!token) {
    throw new Error(
      "TMDB_API_KEY is not set. Get a free Read Access Token from " +
        "https://www.themoviedb.org/settings/api and add it to apps/web/.env",
    );
  }
  return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}

let genreMapCache: Map<number, string> | null = null;

async function getGenreMap(): Promise<Map<number, string>> {
  if (genreMapCache) return genreMapCache;
  const response = await fetch(`${TMDB_BASE}/genre/movie/list?language=en`, {
    headers: authHeaders(),
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error(`TMDB genre list failed: ${response.status}`);
  const json = (await response.json()) as { genres: TmdbGenre[] };
  genreMapCache = new Map(json.genres.map((g) => [g.id, g.name]));
  return genreMapCache;
}

function normalize(m: TmdbMovie, genreMap: Map<number, string>): NormalizedMedia {
  return {
    externalId: String(m.id),
    title: m.title,
    coverImageUrl: m.poster_path ? `${POSTER_BASE}${m.poster_path}` : null,
    synopsis: m.overview,
    releaseYear: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    totalEpisodes: null,
    totalChapters: null,
    genres: m.genre_ids.map((id) => genreMap.get(id)).filter((g): g is string => Boolean(g)),
    averageScore: m.vote_average ? Math.round(m.vote_average * 10) : null,
    releaseStatus: null,
  };
}

const SORT_ENDPOINT: Record<TmdbSort, string> = {
  trending: "/trending/movie/week",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
};

async function handleResponse(response: Response): Promise<TmdbListResponse> {
  if (!response.ok) {
    if (response.status === 429) throw new Error("TMDB rate limit reached — please wait a moment and try again.");
    throw new Error(`TMDB request failed: ${response.status}`);
  }
  return (await response.json()) as TmdbListResponse;
}

export async function fetchTmdbDiscovery(sort: TmdbSort, page = 1): Promise<MediaPage> {
  const genreMap = await getGenreMap();
  const response = await fetch(`${TMDB_BASE}${SORT_ENDPOINT[sort]}?language=en-US&page=${page}`, {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });
  const json = await handleResponse(response);
  return {
    results: json.results.map((m) => normalize(m, genreMap)),
    hasNextPage: json.page < json.total_pages,
  };
}

export async function searchTmdbMovies(query: string, page = 1): Promise<MediaPage> {
  const genreMap = await getGenreMap();
  const response = await fetch(
    `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
    { headers: authHeaders(), next: { revalidate: 3600 } },
  );
  const json = await handleResponse(response);
  return {
    results: json.results.map((m) => normalize(m, genreMap)),
    hasNextPage: json.page < json.total_pages,
  };
}

export async function fetchTmdbMovieById(id: string): Promise<NormalizedMedia | null> {
  const response = await fetch(`${TMDB_BASE}/movie/${id}?language=en-US`, {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    if (response.status === 429) throw new Error("TMDB rate limit reached — please wait a moment and try again.");
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  const m = (await response.json()) as {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string | null;
    release_date: string | null;
    vote_average: number;
    genres: TmdbGenre[];
    status: string | null;
  };

  return {
    externalId: String(m.id),
    title: m.title,
    coverImageUrl: m.poster_path ? `${POSTER_BASE}${m.poster_path}` : null,
    synopsis: m.overview,
    releaseYear: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    totalEpisodes: null,
    totalChapters: null,
    genres: m.genres.map((g) => g.name),
    averageScore: m.vote_average ? Math.round(m.vote_average * 10) : null,
    releaseStatus: m.status,
  };
}
