import type { MediaType, LibraryStatus } from "database";

type StyleTag = {
  bg: string;
  text: string;
  label: string;
};

export const CATEGORY_STYLES: Record<MediaType, StyleTag> = {
  ANIME: { bg: "bg-category-anime-bg", text: "text-category-anime-text", label: "anime" },
  MANGA: { bg: "bg-category-manga-bg", text: "text-category-manga-text", label: "manga" },
  MANHWA: { bg: "bg-category-manhwa-bg", text: "text-category-manhwa-text", label: "manhwa" },
  MANHUA: { bg: "bg-category-manhua-bg", text: "text-category-manhua-text", label: "manhua" },
  MOVIE: { bg: "bg-category-movie-bg", text: "text-category-movie-text", label: "movie" },
};

export const STATUS_STYLES: Record<LibraryStatus, StyleTag> = {
  PLAN_TO_WATCH: { bg: "bg-warning-bg", text: "text-warning-text", label: "plan to watch" },
  WATCHING: { bg: "bg-accent-bg", text: "text-accent-text", label: "watching" },
  READING: { bg: "bg-accent-bg", text: "text-accent-text", label: "reading" },
  COMPLETED: { bg: "bg-success-bg", text: "text-success-text", label: "completed" },
  ON_HOLD: { bg: "bg-surface-3", text: "text-text-secondary", label: "on hold" },
  DROPPED: { bg: "bg-danger-bg", text: "text-danger-text", label: "dropped" },
};