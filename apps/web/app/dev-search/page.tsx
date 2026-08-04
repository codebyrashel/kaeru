"use client";

import { useState, useTransition } from "react";
import { searchMedia, addToLibrary } from "@/app/actions/media";
import type { NormalizedMedia } from "@/lib/anilist";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NormalizedMedia[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const data = await searchMedia(query, "ANIME");
      setResults(data);
    });
  }

  return (
    <main style={{ padding: "2rem" }}>
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anime"
        />
        <button type="submit" disabled={isPending}>
          Search
        </button>
      </form>
      <ul>
        {results.map((r) => (
          <li key={r.externalId}>
            {r.title} ({r.releaseYear})
            <button onClick={() => addToLibrary("ANIME", r)}>Add</button>
          </li>
        ))}
      </ul>
    </main>
  );
}