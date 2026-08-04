"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Tv,
  BookOpen,
  Book,
  Library,
  Film,
  Clock,
  CheckCheck,
  Pause,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "For you", icon: Home },
  { href: "/anime", label: "Anime", icon: Tv },
  { href: "/manga", label: "Manga", icon: BookOpen },
  { href: "/manhwa", label: "Manhwa", icon: Book },
  { href: "/manhua", label: "Manhua", icon: Library },
  { href: "/movies", label: "Movies", icon: Film },
];

const LIST_ITEMS = [
  { href: "/lists/plan-to-watch", label: "Plan to watch", icon: Clock },
  { href: "/lists/completed", label: "Completed", icon: CheckCheck },
  { href: "/lists/on-hold", label: "On hold", icon: Pause },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-50 shrink-0 border-r border-border bg-surface-1 p-3.5">
      <Link href="/" className="mb-6 flex items-center gap-2 px-2 py-1">
        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-[7px] bg-brand text-on-brand">
          <Library size={15} />
        </span>
        <span className="text-[15px] font-medium text-text-primary">Kaeru</span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] transition-colors ${
                active
                  ? "bg-accent-bg text-accent-text"
                  : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-border pt-3.5">
        <p className="mb-2 px-2.5 text-[11px] text-text-muted">Lists</p>
        <nav className="flex flex-col gap-0.5">
          {LIST_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] transition-colors ${
                  active
                    ? "bg-accent-bg text-accent-text"
                    : "text-text-secondary hover:bg-surface-2"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
