"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { DiscoveryCard } from "@/components/discovery/discovery-card";
import { getDiscoveryMedia, searchMedia, addToLibrary } from "@/app/actions/media";
import { getMovieDiscovery, searchMovies } from "@/app/actions/movies";
import type { NormalizedMedia } from "@/lib/media-types";
import type { AniListSort } from "@/lib/api/anilist";
import type { TmdbSort } from "@/lib/api/tmdb";
import type { MediaType } from "database";

export interface SortOption {
  value: string;
  label: string;
}

const DEBOUNCE_MS = 400;

export function DiscoveryGrid({
  category,
  source,
  sortOptions,
  initialResults,
  initialHasNextPage,
  initialAddedIds,
}: {
  category: MediaType;
  source: "anilist" | "tmdb";
  sortOptions: SortOption[];
  initialResults: NormalizedMedia[];
  initialHasNextPage: boolean;
  initialAddedIds: string[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(sortOptions[0]?.value ?? "");
  const [genre, setGenre] = useState<string | "ALL">("ALL");
  const [results, setResults] = useState<NormalizedMedia[]>(initialResults);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [page, setPage] = useState(1);
  const [addedIds, setAddedIds] = useState(new Set(initialAddedIds));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isFirstRun = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);

  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    results.forEach((r) => r.genres.forEach((g) => set.add(g)));
    return [...set].sort();
  }, [results]);

  const visibleResults = useMemo(
    () => (genre === "ALL" ? results : results.filter((r) => r.genres.includes(genre))),
    [results, genre],
  );

  const fetchPage = useCallback(
    async (targetPage: number, activeQuery: string, activeSort: string) => {
      if (source === "anilist") {
        const anilistCategory = category as Exclude<MediaType, "MOVIE">;
        return activeQuery.trim()
          ? searchMedia(activeQuery, anilistCategory, targetPage)
          : getDiscoveryMedia(anilistCategory, activeSort as AniListSort, targetPage);
      }
      return activeQuery.trim()
        ? searchMovies(activeQuery, targetPage)
        : getMovieDiscovery(activeSort as TmdbSort, targetPage);
    },
    [category, source],
  );

  const runSearch = useCallback(
    (activeQuery: string, activeSort: string) => {
      startTransition(async () => {
        setError(null);
        try {
          const data = await fetchPage(1, activeQuery, activeSort);
          setResults(data.results);
          setHasNextPage(data.hasNextPage);
          setPage(1);
          setGenre("ALL");
        } catch (e) {
          setError(e instanceof Error ? e.message : "Something went wrong.");
        }
      });
    },
    [fetchPage],
  );

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => runSearch(query, sort), DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (isFirstRun.current) return;
    if (query.trim()) return;
    runSearch(query, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    runSearch(query, sort);
  }

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loadingMoreRef.current && !isPending) {
          loadingMoreRef.current = true;
          setIsLoadingMore(true);
          const nextPage = page + 1;
          fetchPage(nextPage, query, sort)
            .then((data) => {
              setResults((prev) => {
                const seen = new Set(prev.map((r) => r.externalId));
                const deduped = data.results.filter((r) => !seen.has(r.externalId));
                return [...prev, ...deduped];
              });
              setHasNextPage(data.hasNextPage);
              setPage(nextPage);
            })
            .catch((e) => setError(e instanceof Error ? e.message : "Something went wrong."))
            .finally(() => {
              loadingMoreRef.current = false;
              setIsLoadingMore(false);
            });
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [page, hasNextPage, isPending, query, sort, fetchPage]);

  async function handleAdd(result: NormalizedMedia) {
    await addToLibrary(category, result);
    setAddedIds((prev) => new Set(prev).add(result.externalId));
  }

  return (
    <div>
      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-surface-0 px-6 pb-3 pt-5">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-surface-1 px-3">
            <Search size={14} className="text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${category.toLowerCase()}`}
              className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {isPending && <Loader2 size={13} className="animate-spin text-text-muted" />}
          </div>
          {!query.trim() && (
            <div className="flex gap-1">
              {sortOptions.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSort(s.value)}
                  className={`whitespace-nowrap rounded px-3 py-2 text-xs ${
                    sort === s.value ? "bg-surface-2 text-text-primary" : "text-text-secondary hover:bg-surface-1"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </form>

        {availableGenres.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setGenre("ALL")}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] transition-colors ${
                genre === "ALL" ? "bg-surface-2 text-text-primary" : "text-text-muted hover:bg-surface-1"
              }`}
            >
              All genres
            </button>
            {availableGenres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-[11px] transition-colors ${
                  genre === g ? "bg-surface-2 text-text-primary" : "text-text-muted hover:bg-surface-1"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 pb-5">
        {error && <p className="mb-3 text-sm text-danger-text">{error}</p>}

        {isPending && results.length === 0 ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : visibleResults.length === 0 ? (
          <p className="text-sm text-text-muted">No matches found.</p>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
              {visibleResults.map((result) => (
                <DiscoveryCard
                  key={result.externalId}
                  result={result}
                  category={category}
                  source={source}
                  alreadyAdded={addedIds.has(result.externalId)}
                  onAdd={handleAdd}
                />
              ))}
            </div>
            <div ref={sentinelRef} className="h-10" />
            {isLoadingMore && <p className="py-3 text-center text-xs text-text-muted">Loading more…</p>}
            {!hasNextPage && <p className="py-3 text-center text-xs text-text-muted">You&apos;ve reached the end.</p>}
          </>
        )}
      </div>
    </div>
  );
}