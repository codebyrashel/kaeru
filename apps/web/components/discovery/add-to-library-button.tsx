"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToLibrary } from "@/app/actions/media";
import type { NormalizedMedia } from "@/lib/media-types";
import type { MediaType } from "database";

export function AddToLibraryButton({
  category,
  result,
}: {
  category: MediaType;
  result: NormalizedMedia;
}) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      await addToLibrary(category, result);
      setAdded(true);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending || added}
      className="rounded-full bg-brand px-4 py-2 text-sm text-on-brand disabled:opacity-60"
    >
      {added ? "Added" : isPending ? "Adding…" : "Add to library"}
    </button>
  );
}
