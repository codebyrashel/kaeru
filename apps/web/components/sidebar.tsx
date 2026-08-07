"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Tv,
  BookOpen,
  Book,
  Library,
  Film,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "For you", icon: Home },
  { href: "/anime", label: "Anime", icon: Tv },
  { href: "/manga", label: "Manga", icon: BookOpen },
  { href: "/manhwa", label: "Manhwa", icon: Book },
  { href: "/manhua", label: "Manhua", icon: Library },
  { href: "/movies", label: "Movies", icon: Film },
];

const STORAGE_KEY = "kaeru-sidebar-expanded";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded(stored === "true");
    }
    setHydrated(true);
  }, []);

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-border bg-surface-1 transition-[width] duration-200 ${
        expanded ? "w-56" : "w-14"
      } ${hydrated ? "" : "invisible"}`}
    >
      <div className="flex h-14 items-center gap-2 px-3.5">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2 overflow-hidden">
          <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-[7px] bg-brand text-on-brand">
            <Library size={15} />
          </span>
          {expanded && <span className="whitespace-nowrap text-[15px] font-medium text-text-primary">Kaeru</span>}
        </Link>
      </div>

      <nav className="flex flex-col gap-0.5 px-2.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={expanded ? undefined : label}
              className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] transition-colors ${
                active ? "bg-accent-bg text-accent-text" : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              {expanded && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-border px-2.5 py-2.5">
        {expanded && session?.user?.email && (
          <p className="truncate px-2.5 pb-1 text-[11px] text-text-muted">{session.user.email}</p>
        )}

        <Link
          href="/me"
          title={expanded ? undefined : "Me"}
          className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] transition-colors ${
            pathname === "/me" ? "bg-accent-bg text-accent-text" : "text-text-secondary hover:bg-surface-2"
          }`}
        >
          <User size={16} className="shrink-0" />
          {expanded && <span className="whitespace-nowrap">Me</span>}
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title={expanded ? undefined : "Sign out"}
          className="flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-2"
        >
          <LogOut size={16} className="shrink-0" />
          {expanded && <span className="whitespace-nowrap">Sign out</span>}
        </button>

        <button
          onClick={toggle}
          className="flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-2"
        >
          {expanded ? (
            <PanelLeftClose size={16} className="shrink-0" />
          ) : (
            <PanelLeftOpen size={16} className="shrink-0" />
          )}
          {expanded && <span className="whitespace-nowrap">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
