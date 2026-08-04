import type { MediaType } from "database";
import type { AniListCountry, AniListType } from "./anilist";

type CategoryMapping = {
  type: AniListType;
  country?: AniListCountry;
};

export const CATEGORY_TO_ANILIST: Record<Exclude<MediaType, "MOVIE">, CategoryMapping> = {
  ANIME: { type: "ANIME" },
  MANGA: { type: "MANGA", country: "JP" },
  MANHWA: { type: "MANGA", country: "KR" },
  MANHUA: { type: "MANGA", country: "CN" },
};