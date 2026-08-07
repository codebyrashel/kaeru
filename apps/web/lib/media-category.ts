import type { MediaType } from "database";
import type { AniListCountry, AniListType } from "./api/anilist";

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


export function anilistToMediaType(
  type: AniListType,
  countryOfOrigin: string | null,
): Exclude<MediaType, "MOVIE"> {
  if (type === "ANIME") return "ANIME";
  if (countryOfOrigin === "KR") return "MANHWA";
  if (countryOfOrigin === "CN") return "MANHUA";
  return "MANGA";
}