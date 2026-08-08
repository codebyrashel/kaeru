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
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded(stored === "true");
    }
    setHydrated(true);
  }, []);
  
  // Close the mobile drawer on route change — computed during render
  // (React's documented pattern for "reset state when a value changes"),
  // not in an effect, since a route change is available synchronously
  // from the pathname prop rather than an external system to subscribe to.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }

  const showLabel = mobileOpen || expanded;

  return (
    <>
      {/* Mobile top bar — replaces the rail below sm: */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface-1 px-4 sm:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-text-secondary"
        >
          <Menu size={20} />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-6.5 w-6.5 items-center justify-center rounded-[7px] bg-brand text-on-brand">
            <Library size={15} />
          </span>
          <span className="text-[15px] font-medium text-text-primary">Kaeru</span>
        </Link>
      </div>

      {/* Backdrop, mobile only, only when drawer is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface-1 transition-transform duration-200 sm:sticky sm:top-0 sm:z-auto sm:h-screen sm:w-auto sm:translate-x-0 sm:transition-[width] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${expanded ? "sm:w-56" : "sm:w-14"} ${hydrated ? "" : "invisible sm:visible"}`}
      >
        <div className="flex h-14 items-center gap-2 px-3.5">
          <Link href="/dashboard" className="flex flex-1 items-center gap-2 overflow-hidden">
            <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-[7px] bg-brand text-on-brand">
              <Library size={15} />
            </span>
            {showLabel && (
              <span className="whitespace-nowrap text-[15px] font-medium text-text-primary">
                Kaeru
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-text-secondary sm:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 px-2.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={showLabel ? undefined : label}
                className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] transition-colors ${
                  active ? "bg-accent-bg text-accent-text" : "text-text-secondary hover:bg-surface-2"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {showLabel && <span className="whitespace-nowrap">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-0.5 border-t border-border px-2.5 py-2.5">
          {showLabel && session?.user?.email && (
            <p className="truncate px-2.5 pb-1 text-[11px] text-text-muted">{session.user.email}</p>
          )}

          <Link
            href="/me"
            title={showLabel ? undefined : "Me"}
            className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] transition-colors ${
              pathname === "/me" ? "bg-accent-bg text-accent-text" : "text-text-secondary hover:bg-surface-2"
            }`}
          >
            <User size={16} className="shrink-0" />
            {showLabel && <span className="whitespace-nowrap">Me</span>}
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title={showLabel ? undefined : "Sign out"}
            className="flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-2"
          >
            <LogOut size={16} className="shrink-0" />
            {showLabel && <span className="whitespace-nowrap">Sign out</span>}
          </button>

          <button
            onClick={toggle}
            className="hidden items-center gap-2.5 rounded px-2.5 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-2 sm:flex"
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
    </>
  );
}
