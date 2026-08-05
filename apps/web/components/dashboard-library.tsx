"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LibraryCard } from "@/components/library-card";
import type { LibraryEntry, Media, LibraryStatus } from "database";

type EntryWithMedia = LibraryEntry & { media: Media };

const FILTERS: { value: LibraryStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "WATCHING", label: "Watching" },
  { value: "READING", label: "Reading" },
  { value: "PLAN_TO_WATCH", label: "Plan to watch" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On hold" },
  { value: "DROPPED", label: "Dropped" },
];

export function DashboardLibrary({ entries }: { entries: EntryWithMedia[] }) {
  const [filter, setFilter] = useState<LibraryStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesFilter = filter === "ALL" || e.status === filter;
      const matchesQuery = query.trim()
        ? e.media.title.toLowerCase().includes(query.trim().toLowerCase())
        : true;
      return matchesFilter && matchesQuery;
    });
  }, [entries, filter, query]);

  return (
    <div>
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-surface-0 px-6 pb-3 pt-5">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                filter === f.value ? "bg-brand text-on-brand" : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex h-9 w-64 shrink-0 items-center gap-2 rounded-lg border border-border bg-surface-1 px-3">
          <Search size={14} className="text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your library"
            className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      <div className="px-6 pb-5">
        {filtered.length === 0 ? (
          <p className="text-sm text-text-muted">No matches in your library.</p>
        ) : (
          <div className="grid grid-cols-5 gap-2.5">
            {filtered.map((entry) => (
              <LibraryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
