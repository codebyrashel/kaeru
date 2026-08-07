"use client";

import { useState, useTransition } from "react";
import { Minus, Plus } from "lucide-react";
import { updateProgress } from "@/app/actions/progress";

export function ProgressStepper({
  entryId,
  current,
  total,
  field,
  unitLabel,
  ongoing = false,
}: {
  entryId: number;
  current: number;
  total: number | null;
  field: "currentEpisode" | "currentChapter";
  unitLabel: string;
  ongoing?: boolean;
}) {
  const [value, setValue] = useState(current);
  const [isPending, startTransition] = useTransition();

  function commit(next: number) {
    const safe = Math.max(0, total ? Math.min(next, total) : next);
    setValue(safe);
    startTransition(async () => {
      await updateProgress(entryId, safe, field);
    });
  }

  const percent = total ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <button
          onClick={() => commit(value - 1)}
          disabled={isPending || value <= 0}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-text-primary disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <input
          type="number"
          value={value}
          min={0}
          max={total ?? undefined}
          onChange={(e) => setValue(Number(e.target.value))}
          onBlur={() => commit(value)}
          className="w-16 rounded bg-surface-2 px-2 py-1.5 text-center text-sm text-text-primary [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-sm text-text-muted">
          / {total ?? (ongoing ? "Ongoing" : "?")} {total ? unitLabel : ""}
        </span>
        <button
          onClick={() => commit(value + 1)}
          disabled={isPending || (total !== null && value >= total)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-text-primary disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>
      {total !== null && (
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-accent transition-all" style={{ width: `${percent}%` }} />
        </div>
      )}
    </div>
  );
}
