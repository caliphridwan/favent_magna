import Link from "next/link";
import { Download, Search } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePage } from "@/lib/auth";
import { cn, formatDateTime } from "@/lib/utils";
import { Card, Flash, PageHeader, Pagination, StatusBadge, adminInput } from "@/components/admin/ui";

export const metadata = { title: "Enquiries" };
type Props = { searchParams: Promise<Record<string, string | undefined>> };
const PER_PAGE = 25;
const statuses = ["NEW", "IN_PROGRESS", "CLOSED", "SPAM"] as const;
const types = ["CONTACT", "CONSULTATION", "SERVICE", "TRAINING"] as const;

export default async function EnquiriesPage({ searchParams }: Props) {
  await requirePage("enquiries:view");
  const sp = await searchParams;
  const q = sp.q?.trim();
  const status = statuses.find((s) => s === sp.status);
  const type = types.find((t) => t === sp.type);
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.EnquiryWhereInput = {
    ...(status ? { status } : { status: { not: "SPAM" } }),
    ...(type ? { type } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { organisation: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, total, counts] = await Promise.all([
    prisma.enquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE, include: { service: { select: { title: true } }, training: { select: { title: true } } } }),
    prisma.enquiry.count({ where }),
    prisma.enquiry.groupBy({ by: ["status"], _count: true }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, status, type, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return `/admin/enquiries${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Contact, consultation, service and training enquiries submitted on the website."
        actions={
          <a href="/api/admin/export?type=enquiries" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-ink">
            <Download className="h-4 w-4" aria-hidden /> Export CSV
          </a>
        }
      />
      <Flash searchParams={sp} />

      <div className="flex flex-wrap items-center gap-2">
        <Link href={qs({ status: undefined, page: undefined })} className={cn("rounded-full px-4 py-2 text-sm", !status ? "bg-ink text-white" : "border border-line bg-white")}>
          All open
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={qs({ status: s, page: undefined })} className={cn("rounded-full px-4 py-2 text-sm", status === s ? "bg-ink text-white" : "border border-line bg-white")}>
            {s.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} <span className="opacity-60">({countOf(s)})</span>
          </Link>
        ))}
      </div>

      <form className="flex flex-wrap gap-3">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <label htmlFor="q" className="sr-only">
            Search enquiries
          </label>
          <input id="q" name="q" defaultValue={q} placeholder="Search name, email, organisation or message" className={`${adminInput} pl-10`} />
        </div>
        <label htmlFor="type" className="sr-only">
          Type
        </label>
        <select id="type" name="type" defaultValue={type ?? ""} className={`${adminInput} w-auto`}>
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.toLowerCase()}
            </option>
          ))}
        </select>
        <button type="submit" className="h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white">
          Filter
        </button>
      </form>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              <th className="px-5 py-3.5 font-medium">Contact</th>
              <th className="px-5 py-3.5 font-medium">Type</th>
              <th className="px-5 py-3.5 font-medium">Interest</th>
              <th className="px-5 py-3.5 font-medium">Received</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2EE]">
            {rows.map((e) => (
              <tr key={e.id} className={cn("hover:bg-mist/60", e.status === "NEW" && "font-medium")}>
                <td className="px-5 py-4">
                  <Link href={`/admin/enquiries/${e.id}`} className="block hover:underline">
                    {e.name}
                  </Link>
                  <span className="text-[13px] font-normal text-muted">{[e.organisation, e.email].filter(Boolean).join(" · ")}</span>
                </td>
                <td className="px-5 py-4 capitalize">{e.type.toLowerCase()}</td>
                <td className="px-5 py-4">{e.service?.title || e.training?.title || <span className="text-muted">—</span>}</td>
                <td className="px-5 py-4 text-muted">{formatDateTime(e.createdAt)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/enquiries/${e.id}`} className="font-semibold">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted">
                  No enquiries found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
      <Pagination page={page} pages={Math.ceil(total / PER_PAGE)} makeHref={(p) => qs({ page: String(p) })} />
    </>
  );
}
