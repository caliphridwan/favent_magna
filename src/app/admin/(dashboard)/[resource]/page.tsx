import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ExternalLink, Plus, Search } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { getResource } from "@/lib/admin/resources";
import { delegate } from "@/lib/admin/server";
import { formatDate, partnerCategoryLabels } from "@/lib/utils";
import { ButtonLink, Card, Flash, PageHeader, Pagination, adminInput } from "@/components/admin/ui";
import { PublishToggle } from "./PublishToggle";

type Props = { params: Promise<{ resource: string }>; searchParams: Promise<Record<string, string | undefined>> };
const PER_PAGE = 25;

export async function generateMetadata({ params }: Props) {
  const { resource } = await params;
  return { title: getResource(resource)?.label ?? "Content" };
}

export default async function ResourceList({ params, searchParams }: Props) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  await requirePage("content:manage");

  const sp = await searchParams;
  const q = sp.q?.trim();
  const page = Math.max(1, Number(sp.page) || 1);
  const where = q ? { OR: resource.searchFields.map((f) => ({ [f]: { contains: q, mode: "insensitive" } })) } : undefined;
  const d = delegate(resource.model);
  const [rows, total] = await Promise.all([
    d.findMany({ where, orderBy: resource.orderBy, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    d.count({ where }),
  ]);
  const hasPublished = resource.fields.some((f) => f.name === "published");

  return (
    <>
      <PageHeader
        title={resource.label}
        description={resource.description}
        actions={
          resource.allowCreate === false ? null : (
            <ButtonLink href={`/admin/${key}/new`} variant="lime">
              <Plus className="h-4 w-4" aria-hidden /> New {resource.singular.toLowerCase()}
            </ButtonLink>
          )
        }
      />
      <Flash searchParams={sp} />

      <form className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <input id="q" name="q" defaultValue={q} placeholder={`Search ${resource.label.toLowerCase()}…`} className={`${adminInput} pl-10`} />
      </form>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {resource.columns.map((c) => (
                <th key={c.field} className="px-5 py-3.5 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="px-5 py-3.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2EE]">
            {rows.map((r) => {
              const href = `/admin/${key}/${r.id}`;
              const pub = resource.publicPath?.(r);
              return (
                <tr key={r.id} className="hover:bg-mist/60">
                  {resource.columns.map((c, i) => {
                    const v = r[c.field];
                    let cell: React.ReactNode = v == null || v === "" ? <span className="text-muted">—</span> : String(v);
                    if (c.kind === "boolean")
                      cell =
                        c.field === "published" && hasPublished ? (
                          <PublishToggle resourceKey={key} id={r.id} published={Boolean(v)} />
                        ) : v ? (
                          <Check className="h-4 w-4 text-lime-dark" aria-label="Yes" />
                        ) : (
                          <span className="text-muted">No</span>
                        );
                    if (c.kind === "date" && v) cell = formatDate(v);
                    if (c.kind === "badge" && v) cell = <span className="rounded-full bg-mist px-2.5 py-1 text-xs">{partnerCategoryLabels[v] ?? v}</span>;
                    if (c.kind === "image")
                      cell = v ? (
                        <span className="relative block h-10 w-16 overflow-hidden rounded-md bg-mist">
                          <Image src={v} alt="" fill sizes="64px" className="object-contain" unoptimized={!String(v).includes("res.cloudinary.com")} />
                        </span>
                      ) : (
                        <span className="block h-10 w-16 rounded-md bg-mist" />
                      );
                    return (
                      <td key={c.field} className="px-5 py-3.5">
                        {i === 0 || (i === 1 && resource.columns[0].kind === "image") ? (
                          <Link href={href} className="font-medium hover:underline">
                            {cell}
                          </Link>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center gap-3">
                      {pub ? (
                        <a href={pub} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink" aria-label="View on website">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                      <Link href={href} className="font-semibold">
                        Edit
                      </Link>
                    </span>
                  </td>
                </tr>
              );
            })}
            {!rows.length ? (
              <tr>
                <td colSpan={resource.columns.length + 1} className="px-5 py-12 text-center text-muted">
                  {q ? "No matches." : `No ${resource.label.toLowerCase()} yet.`}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
      <Pagination page={page} pages={Math.ceil(total / PER_PAGE)} makeHref={(p) => `/admin/${key}?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`} />
    </>
  );
}
