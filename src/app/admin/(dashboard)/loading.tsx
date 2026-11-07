export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-line" />
      <div className="h-64 animate-pulse rounded-2xl bg-white" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
