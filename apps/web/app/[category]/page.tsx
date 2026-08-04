import { notFound } from "next/navigation";
import { CATEGORY_SLUGS, SLUG_TO_MEDIA_TYPE, type CategorySlug } from "@/lib/category-routes";
import { CategoryTabs } from "@/components/category-tabs";
import { DiscoveryGrid } from "@/components/discovery-grid";
import { getLibraryExternalIds } from "@/lib/library";
import { fetchAniListMedia } from "@/lib/anilist";
import { CATEGORY_TO_ANILIST } from "@/lib/media-category";
import type { MediaType } from "database";

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

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
    return (
      <div className="px-6 py-5">
        <CategoryTabs current={slug} />
        <p className="text-sm text-text-secondary">
          Movies discovery is coming soon — TMDB integration isn&apos;t built yet.
        </p>
      </div>
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
      initialResults={initialResults}
      initialAddedIds={[...addedIds]}
    />
  );
}
