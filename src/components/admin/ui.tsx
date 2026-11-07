import Link from "next/link";
import { cn } from "@/lib/utils";

export const adminInput =
  "block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[15px] focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/30";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em]">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-white", className)}>{children}</div>;
}

export function Flash({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const msg = searchParams.saved ? "Saved successfully." : searchParams.deleted ? "Deleted." : searchParams.denied ? "You don't have permission to open that page." : null;
  if (!msg) return null;
  return (
    <p role="status" className={cn("rounded-xl px-4 py-3 text-sm", searchParams.denied ? "bg-red-50 text-red-700" : "bg-lime-soft text-lime-ink")}>
      {msg}
    </p>
  );
}

const statusStyles: Record<string, string> = {
  NEW: "bg-lime-soft text-lime-ink",
  IN_PROGRESS: "bg-amber-100 text-amber-900",
  CLOSED: "bg-[#ECEDEB] text-[#33372F]",
  SPAM: "bg-red-100 text-red-800",
  ACTIVE: "bg-lime-soft text-lime-ink",
  UNSUBSCRIBED: "bg-[#ECEDEB] text-[#33372F]",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", statusStyles[status] ?? "bg-mist")}>{status.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</span>;
}

export function ButtonLink({ href, children, variant = "ink" }: { href: string; children: React.ReactNode; variant?: "ink" | "lime" | "ghost" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold",
        variant === "ink" && "bg-ink text-white hover:bg-charcoal",
        variant === "lime" && "bg-lime text-ink hover:bg-lime-light",
        variant === "ghost" && "border border-line bg-white hover:border-ink"
      )}
    >
      {children}
    </Link>
  );
}

export function Pagination({ page, pages, makeHref }: { page: number; pages: number; makeHref: (p: number) => string }) {
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 text-sm">
      {page > 1 ? <Link href={makeHref(page - 1)} className="rounded-lg border border-line bg-white px-4 py-2 hover:border-ink">← Previous</Link> : <span />}
      <span className="text-muted">
        Page {page} of {pages}
      </span>
      {page < pages ? <Link href={makeHref(page + 1)} className="rounded-lg border border-line bg-white px-4 py-2 hover:border-ink">Next →</Link> : <span />}
    </nav>
  );
}
