import Link from "next/link";
import { CATEGORY_SLUGS, SLUG_LABELS, type CategorySlug } from "@/lib/category-routes";

export function CategoryTabs({ current }: { current: CategorySlug }) {
  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-auto">
      {CATEGORY_SLUGS.map((slug) => (
        <Link
          key={slug}
          href={`/${slug}`}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
            slug === current
              ? "bg-brand text-on-brand"
              : "text-text-secondary hover:bg-surface-2"
          }`}
        >
          {SLUG_LABELS[slug]}
        </Link>
      ))}
    </div>
  );
}
