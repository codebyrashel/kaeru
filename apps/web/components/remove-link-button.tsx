"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeFromLibrary } from "@/app/actions/library";

export function RemoveLinkButton({ entryId }: { entryId: number }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await removeFromLibrary(entryId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      disabled={isPending}
      className={`mt-3 text-xs underline ${
        confirming ? "text-danger-text" : "text-text-muted hover:text-danger-text"
      }`}
    >
      {isPending ? "Removing…" : confirming ? "Click again to confirm" : "Remove from library"}
    </button>
  );
}
