import { notFound } from "next/navigation";
import { STATUS_SLUGS, SLUG_TO_STATUS, STATUS_SLUG_LABELS, type StatusSlug } from "@/lib/status-routes";
import { getLibraryByStatus } from "@/lib/library";
import { LibraryCard } from "@/components/library-card";

export function generateStaticParams() {
  return STATUS_SLUGS.map((status) => ({ status }));
}

export default async function StatusListPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = await params;

  if (!STATUS_SLUGS.includes(status as StatusSlug)) {
    notFound();
  }

  const slug = status as StatusSlug;
  const entries = await getLibraryByStatus(SLUG_TO_STATUS[slug]);

  return (
    <div className="px-6 py-5">
      <p className="mb-3 text-sm text-text-secondary">{STATUS_SLUG_LABELS[slug]}</p>

      {entries.length === 0 ? (
        <p className="text-sm text-text-muted">Nothing here yet.</p>
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
