"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export function FilterSheet({
  label = "Filters",
  activeCount = 0,
  children,
}: {
  label?: string;
  activeCount?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-[8px] border border-border bg-surface-1 px-3 text-[13px] text-text-secondary sm:hidden"
      >
        <SlidersHorizontal size={14} />
        {label}
        {activeCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-on-brand">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface-1 p-4 transition-transform duration-200 sm:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <button onClick={() => setOpen(false)} aria-label="Close filters" className="text-text-secondary">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </>
  );
}