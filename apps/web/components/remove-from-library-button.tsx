"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { removeFromLibrary } from "@/app/actions/library";

export function RemoveFromLibraryButton({ entryId }: { entryId: number }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
      className={`absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
        confirming ? "bg-danger text-on-brand" : "bg-black/40 text-white hover:bg-black/60"
      }`}
      aria-label={confirming ? "Confirm remove" : "Remove from library"}
      title={confirming ? "Click again to confirm" : "Remove from library"}
    >
      <Trash2 size={12} />
    </button>
  );
}
