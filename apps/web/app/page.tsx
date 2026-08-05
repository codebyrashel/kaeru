import { getUserLibrary } from "@/lib/library";
import { DashboardLibrary } from "@/components/dashboard-library";
import Link from "next/link";

export default async function Home() {
  const entries = await getUserLibrary();

  if (entries.length === 0) {
    return (
      <div className="px-6 py-5">
        <p className="mb-2.5 text-sm text-text-secondary">Your library</p>
        <p className="text-sm text-text-muted">
          Nothing here yet.{" "}
          <Link href="/anime" className="text-accent-text underline">
            Browse anime
          </Link>{" "}
          to add something.
        </p>
      </div>
    );
  }

  return <DashboardLibrary entries={entries} />;
}