"use server";

import { fetchTmdbDiscovery, searchTmdbMovies, type TmdbSort } from "@/lib/api/tmdb";
import type { MediaPage } from "@/lib/media-types";

export async function searchMovies(query: string, page = 1): Promise<MediaPage> {
  if (!query.trim()) return { results: [], hasNextPage: false };
  return searchTmdbMovies(query, page);
}

export async function getMovieDiscovery(sort: TmdbSort, page = 1): Promise<MediaPage> {
  return fetchTmdbDiscovery(sort, page);
}