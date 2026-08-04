"use client";

import { useTransition } from "react";
import { updateStatus } from "@/app/actions/progress";
import { STATUS_STYLES } from "@/lib/media-style";
import type { LibraryStatus } from "database";

const SELECTABLE: LibraryStatus[] = [
  "PLAN_TO_WATCH",
  "WATCHING",
  "READING",
  "COMPLETED",
  "ON_HOLD",
  "DROPPED",
];

export function StatusSelector({
  entryId,
  current,
}: {
  entryId: number;
  current: LibraryStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-1.5">
      {SELECTABLE.map((status) => {
        const style = STATUS_STYLES[status];
        const active = status === current;
        return (
          <button
            key={status}
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await updateStatus(entryId, status);
              })
            }
            className={`rounded-full px-3 py-1 text-xs transition-opacity ${style.bg} ${style.text} ${
              active ? "" : "opacity-40 hover:opacity-70"
            }`}
          >
            {style.label}
          </button>
        );
      })}
    </div>
  );
}
