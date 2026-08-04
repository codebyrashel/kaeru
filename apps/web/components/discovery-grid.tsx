"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { CategoryTabs } from "@/components/category-tabs";
import { DiscoveryCard } from "@/components/discovery-card";
import { getDiscoveryMedia, searchMedia, addToLibrary } from "@/app/actions/media";
import { getMovieDiscovery, searchMovies } from "@/app/actions/movies";
import type { NormalizedMedia } from "@/lib/media-types";
import type { AniListSort } from "@/lib/anilist";
import type { TmdbSort } from "@/lib/tmdb";
import type { MediaType } from "database";
import type { CategorySlug } from "@/lib/category-routes";

export interface SortOption {
  value: string;
  label: string;
}

export function DiscoveryGrid({
  category,
  slug,
  source,
  sortOptions,
  initialResults,
  initialAddedIds,
}: {
  category: MediaType;
  slug: CategorySlug;
  source: "anilist" | "tmdb";
  sortOptions: SortOption[];
  initialResults: NormalizedMedia[];
  initialAddedIds: string[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(sortOptions[0]?.value ?? "");
  const [results, setResults] = useState<NormalizedMedia[]>(initialResults);
  const [addedIds, setAddedIds] = useState(new Set(initialAddedIds));
  const [isPending, startTransition] = useTransition();
  const isFirstRun = useRef(true);

  async function fetchResults(): Promise<NormalizedMedia[]> {
    if (source === "anilist") {
      const anilistCategory = category as Exclude<MediaType, "MOVIE">;
      return query.trim()
        ? searchMedia(query, anilistCategory)
        : getDiscoveryMedia(anilistCategory, sort as AniListSort);
    }
    return query.trim() ? searchMovies(query) : getMovieDiscovery(sort as TmdbSort);
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    startTransition(async () => {
      setResults(await fetchResults());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setResults(await fetchResults());
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
            placeholder={`Search ${category.toLowerCase()}`}
            className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        {!query.trim() && (
          <div className="flex gap-1">
            {sortOptions.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSort(s.value)}
                className={`whitespace-nowrap rounded px-3 py-2 text-xs ${
                  sort === s.value
                    ? "bg-surface-2 text-text-primary"
                    : "text-text-secondary hover:bg-surface-1"
                }`}
              >
                {s.label}
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