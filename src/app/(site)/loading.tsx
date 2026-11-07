export default function Loading() {
  return (
    <div className="bg-ink" aria-busy="true" aria-live="polite">
      <div className="container space-y-6 py-28">
        <div className="h-3 w-40 animate-pulse rounded-full bg-charcoal" />
        <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-charcoal" />
        <div className="h-5 w-1/2 animate-pulse rounded-full bg-charcoal" />
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
