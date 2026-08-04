import { getUserLibrary } from "@/lib/library";
import { LibraryCard } from "@/components/library-card";
import Link from "next/link";

export default async function Home() {
  const entries = await getUserLibrary();

  return (
    <div className="px-6 py-5">
      <p className="mb-2.5 text-sm text-text-secondary">Your library</p>

      {entries.length === 0 ? (
        <p className="text-sm text-text-muted">
          Nothing here yet.{" "}
          <Link href="/dev-search" className="text-accent-text underline">
            Search AniList
          </Link>{" "}
          to add something.
        </p>
      ) : (
        <div className="grid grid-cols-5 gap-2.5">
          {entries.map((entry) => (
            <LibraryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}