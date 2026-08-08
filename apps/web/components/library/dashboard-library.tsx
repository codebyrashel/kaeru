"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LibraryCard } from "@/components/library/library-card";
import { FilterSheet } from "@/components/shared/filter-sheet";
import type { LibraryEntry, Media, LibraryStatus, MediaType } from "database";

type EntryWithMedia = LibraryEntry & { media: Media };

const STATUS_FILTERS: { value: LibraryStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "WATCHING", label: "Watching" },
  { value: "READING", label: "Reading" },
  { value: "PLAN_TO_WATCH", label: "Plan to watch" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On hold" },
  { value: "DROPPED", label: "Dropped" },
];

const TYPE_FILTERS: { value: MediaType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All types" },
  { value: "ANIME", label: "Anime" },
  { value: "MANGA", label: "Manga" },
  { value: "MANHWA", label: "Manhwa" },
  { value: "MANHUA", label: "Manhua" },
  { value: "MOVIE", label: "Movies" },
];

export function DashboardLibrary({ entries }: { entries: EntryWithMedia[] }) {
  const [status, setStatus] = useState<LibraryStatus | "ALL">("ALL");
  const [type, setType] = useState<MediaType | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesStatus = status === "ALL" || e.status === status;
      const matchesType = type === "ALL" || e.media.type === type;
      const matchesQuery = query.trim()
        ? e.media.title.toLowerCase().includes(query.trim().toLowerCase())
        : true;
      return matchesStatus && matchesType && matchesQuery;
    });
  }, [entries, status, type, query]);

  const activeCount = (status !== "ALL" ? 1 : 0) + (type !== "ALL" ? 1 : 0);

  const statusPills = (onPick?: () => void) => (
    <div className="flex flex-wrap gap-1.5">
      {STATUS_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => {
            setStatus(f.value);
            onPick?.();
          }}
          className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
            status === f.value ? "bg-brand text-on-brand" : "text-text-secondary hover:bg-surface-2"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );

  const typePills = () => (
    <div className="flex flex-wrap gap-1.5">
      {TYPE_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => setType(f.value)}
          className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
            type === f.value ? "bg-surface-2 text-text-primary" : "text-text-muted hover:bg-surface-1"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="sticky top-0 z-10 flex flex-col gap-2 bg-surface-0 px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-surface-1 px-3">
            <Search size={14} className="text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your library"
              className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <FilterSheet label="Filters" activeCount={activeCount}>
            <div>
              <p className="mb-2 text-xs text-text-muted">Status</p>
              {statusPills()}
            </div>
            <div>
              <p className="mb-2 text-xs text-text-muted">Type</p>
              {typePills()}
            </div>
          </FilterSheet>
        </div>

        <div className="hidden flex-wrap items-center gap-3 sm:flex">
          {statusPills()}
          <div className="ml-auto">{typePills()}</div>
        </div>
      </div>

      <div className="px-4 pb-5 sm:px-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-text-muted">No matches in your library.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:gap-2.5">
            {filtered.map((entry) => (
              <LibraryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
