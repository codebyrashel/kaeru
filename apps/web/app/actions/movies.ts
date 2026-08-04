"use server";

import { fetchTmdbDiscovery, searchTmdbMovies, type TmdbSort } from "@/lib/tmdb";
import type { NormalizedMedia } from "@/lib/media-types";

export async function searchMovies(query: string): Promise<NormalizedMedia[]> {
  if (!query.trim()) return [];
  return searchTmdbMovies(query);
}

export async function getMovieDiscovery(sort: TmdbSort): Promise<NormalizedMedia[]> {
  return fetchTmdbDiscovery(sort);
}
