"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "For you" },
  { href: "/anime", label: "Anime" },
  { href: "/manga", label: "Manga" },
  { href: "/manhwa", label: "Manhwa" },
  { href: "/manhua", label: "Manhua" },
  { href: "/movies", label: "Movies" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 shrink-0 items-center gap-6 border-b border-border bg-surface-1 px-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-[7px] bg-brand text-on-brand">
          <Library size={15} />
        </span>
        <span className="text-[15px] font-medium text-text-primary">Kaeru</span>
      </Link>

      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded px-3 py-1.5 text-[13px] transition-colors ${
              pathname === href ? "bg-accent-bg text-accent-text" : "text-text-secondary hover:bg-surface-2"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <Link
        href="/me"
        className={`ml-auto rounded px-3 py-1.5 text-[13px] transition-colors ${
          pathname === "/me" ? "bg-accent-bg text-accent-text" : "text-text-secondary hover:bg-surface-2"
        }`}
      >
        Me
      </Link>
    </header>
  );
}
