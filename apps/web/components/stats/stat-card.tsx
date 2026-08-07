export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-surface-1 p-3">
      <p className="mb-1 text-[11px] text-text-secondary">{label}</p>
      <p className="text-xl font-medium text-text-primary">{value}</p>
    </div>
  );
}
