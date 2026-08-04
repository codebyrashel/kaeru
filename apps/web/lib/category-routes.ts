import type { MediaType } from "database";

export const CATEGORY_SLUGS = ["anime", "manga", "manhwa", "manhua", "movies"] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const SLUG_TO_MEDIA_TYPE: Record<CategorySlug, MediaType> = {
  anime: "ANIME",
  manga: "MANGA",
  manhwa: "MANHWA",
  manhua: "MANHUA",
  movies: "MOVIE",
};

export const SLUG_LABELS: Record<CategorySlug, string> = {
  anime: "Anime",
  manga: "Manga",
  manhwa: "Manhwa",
  manhua: "Manhua",
  movies: "Movies",
};