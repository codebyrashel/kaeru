import { notFound } from "next/navigation";
import { CATEGORY_SLUGS, SLUG_TO_MEDIA_TYPE, type CategorySlug } from "@/lib/category-routes";
import { DiscoveryGrid, type SortOption } from "@/components/discovery-grid";
import { getLibraryExternalIds } from "@/lib/library";
import { fetchAniListMedia } from "@/lib/anilist";
import { fetchTmdbDiscovery } from "@/lib/tmdb";
import { CATEGORY_TO_ANILIST } from "@/lib/media-category";
import type { MediaType } from "database";
import type { NormalizedMedia } from "@/lib/media-types";

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

const ANILIST_SORTS: SortOption[] = [
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "POPULARITY_DESC", label: "Popular" },
  { value: "SCORE_DESC", label: "Top rated" },
];

const TMDB_SORTS: SortOption[] = [
  { value: "trending", label: "Trending" },
  { value: "popular", label: "Popular" },
  { value: "top_rated", label: "Top rated" },
];

export default async function DiscoveryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!CATEGORY_SLUGS.includes(category as CategorySlug)) {
    notFound();
  }

  const slug = category as CategorySlug;
  const mediaType: MediaType = SLUG_TO_MEDIA_TYPE[slug];

  if (mediaType === "MOVIE") {
    let movieData: { initialResults: NormalizedMedia[]; addedIds: Set<string> } | null = null;
  
    try {
      const [initialResults, addedIds] = await Promise.all([
        fetchTmdbDiscovery("trending"),
        getLibraryExternalIds("MOVIE"),
      ]);
      movieData = { initialResults, addedIds };
    } catch {
      movieData = null;
    }
  
    if (!movieData) {
      return (
        <div className="px-6 py-5">
          <p className="text-sm text-text-secondary">
            Movies isn&apos;t connected yet — TMDB API access is pending approval.
          </p>
        </div>
      );
    }
  
    return (
      <DiscoveryGrid
        category="MOVIE"
        slug={slug}
        source="tmdb"
        sortOptions={TMDB_SORTS}
        initialResults={movieData.initialResults}
        initialAddedIds={[...movieData.addedIds]}
      />
    );
  }

  const { type, country } = CATEGORY_TO_ANILIST[mediaType];
  const [initialResults, addedIds] = await Promise.all([
    fetchAniListMedia({ type, countryOfOrigin: country, sort: "TRENDING_DESC" }),
    getLibraryExternalIds(mediaType),
  ]);

  return (
    <DiscoveryGrid
      category={mediaType}
      slug={slug}
      source="anilist"
      sortOptions={ANILIST_SORTS}
      initialResults={initialResults}
      initialAddedIds={[...addedIds]}
    />
  );
}
