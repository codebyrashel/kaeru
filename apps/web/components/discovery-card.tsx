"use client";

import { useState } from "react";
import { Plus, Check, Star } from "lucide-react";
import { CATEGORY_STYLES } from "@/lib/media-style";
import type { MediaType } from "database";
import type { NormalizedMedia } from "@/lib/anilist";

export function DiscoveryCard({
  result,
  category,
  alreadyAdded,
  onAdd,
}: {
  result: NormalizedMedia;
  category: MediaType;
  alreadyAdded: boolean;
  onAdd: (result: NormalizedMedia) => Promise<void>;
}) {
  const [added, setAdded] = useState(alreadyAdded);
  const [pending, setPending] = useState(false);
  const style = CATEGORY_STYLES[category];

  async function handleAdd() {
    if (added || pending) return;
    setPending(true);
    await onAdd(result);
    setAdded(true);
    setPending(false);
  }

  return (
    <div className="overflow-hidden rounded-[10px] bg-surface-1">
      <div className={`relative h-40 ${style.bg}`}>
        {result.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.coverImageUrl}
            alt={result.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`flex h-full items-center justify-center text-xs ${style.text}`}>
            {style.label}
          </div>
        )}
        {result.averageScore !== null && (
          <span className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
            <Star size={9} fill="currentColor" />
            {(result.averageScore / 10).toFixed(1)}
          </span>
        )}
        <button
          onClick={handleAdd}
          disabled={added || pending}
          className={`absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
            added ? "bg-success text-on-brand" : "bg-white/90 text-surface-0 hover:bg-white"
          }`}
          aria-label={added ? "Already in library" : "Add to library"}
        >
          {added ? <Check size={14} /> : <Plus size={14} />}
        </button>
      </div>
      <div className="p-2">
        <p className="truncate text-[11px] font-medium text-text-primary">{result.title}</p>
        <p className="mt-0.5 text-[10px] text-text-muted">
          {result.releaseYear ?? "—"}
          {result.totalEpisodes ? ` · ${result.totalEpisodes} ep` : ""}
          {result.totalChapters ? ` · ${result.totalChapters} ch` : ""}
        </p>
      </div>
    </div>
  );
}
