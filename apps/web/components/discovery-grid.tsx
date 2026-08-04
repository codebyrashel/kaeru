"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { CategoryTabs } from "@/components/category-tabs";
import { DiscoveryCard } from "@/components/discovery-card";
import { getDiscoveryMedia, searchMedia, addToLibrary } from "@/app/actions/media";
import type { NormalizedMedia, AniListSort } from "@/lib/anilist";
import type { MediaType } from "database";
import type { CategorySlug } from "@/lib/category-routes";

type SortOption = Extract<AniListSort, "TRENDING_DESC" | "POPULARITY_DESC" | "SCORE_DESC">;

const SORT_LABELS: Record<SortOption, string> = {
  TRENDING_DESC: "Trending",
  POPULARITY_DESC: "Popular",
  SCORE_DESC: "Top rated",
};

export function DiscoveryGrid({
  category,
  slug,
  initialResults,
  initialAddedIds,
}: {
  category: Exclude<MediaType, "MOVIE">;
  slug: CategorySlug;
  initialResults: NormalizedMedia[];
  initialAddedIds: string[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("TRENDING_DESC");
  const [results, setResults] = useState<NormalizedMedia[]>(initialResults);
  const [addedIds, setAddedIds] = useState(new Set(initialAddedIds));
  const [isPending, startTransition] = useTransition();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    startTransition(async () => {
      const data = query.trim()
        ? await searchMedia(query, category)
        : await getDiscoveryMedia(category, sort);
      setResults(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const data = query.trim()
        ? await searchMedia(query, category)
        : await getDiscoveryMedia(category, sort);
      setResults(data);
    });
  }

  async function handleAdd(result: NormalizedMedia) {
    await addToLibrary(category, result);
    setAddedIds((prev) => new Set(prev).add(result.externalId));
  }

  return (
    <div className="px-6 py-5">
      <CategoryTabs current={slug} />

      <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2">
        <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-surface-1 px-3">
          <Search size={14} className="text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${SORT_LABELS[sort].toLowerCase() === sort ? "" : ""}${category.toLowerCase()}`}
            className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        {!query.trim() && (
          <div className="flex gap-1">
            {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={`whitespace-nowrap rounded px-3 py-2 text-xs ${
                  sort === s
                    ? "bg-surface-2 text-text-primary"
                    : "text-text-secondary hover:bg-surface-1"
                }`}
              >
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </form>

      {isPending && results.length === 0 ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : (
        <div className="grid grid-cols-5 gap-2.5">
          {results.map((result) => (
            <DiscoveryCard
              key={result.externalId}
              result={result}
              category={category}
              alreadyAdded={addedIds.has(result.externalId)}
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
