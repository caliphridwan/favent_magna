import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { cn, optimisedUrl, pad2, partnerCategoryLabels } from "@/lib/utils";

export function ServiceCard({ s, index }: { s: { slug: string; title: string; icon: string; shortDescription: string }; index: number }) {
  const Icon = getIcon(s.icon);
  return (
    <Link href={`/services/${s.slug}`} className="card-lift group flex min-h-[270px] flex-col gap-5 rounded-[20px] border border-line bg-mist p-8">
      <div className="flex items-center justify-between">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-ink text-lime transition-colors group-hover:bg-lime group-hover:text-ink">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span className="font-mono text-xs text-muted">{pad2(index + 1)}</span>
      </div>
      <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.015em]">{s.title}</h3>
      <p className="text-[15px] leading-relaxed text-muted">{s.shortDescription}</p>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold">
        Explore service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}

type ProjectCardData = { slug: string; title: string; sector: string | null; year: number | null; summary: string; coverImageUrl: string | null; client: string | null };

export function ProjectCard({ p }: { p: ProjectCardData }) {
  return (
    <Link href={`/projects/${p.slug}`} className="card-lift group flex flex-col overflow-hidden rounded-[22px] border border-line bg-white">
      <div className="relative aspect-[4/3] bg-charcoal">
        {p.coverImageUrl ? (
          <Image src={optimisedUrl(p.coverImageUrl, 900)} alt={p.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="bg-grid-dark absolute inset-0" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{[p.sector, p.year].filter(Boolean).join(" · ") || "Case study"}</p>
        <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.015em]">{p.title}</h3>
        <p className="line-clamp-3 text-[15px] leading-relaxed text-muted">{p.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold">
          View case study <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

type PartnerData = { id: string; name: string; slug: string; category: string; logoUrl: string | null; websiteUrl: string | null; description?: string | null; statusNote?: string | null };

export function PartnerGroups({ partners, detailed }: { partners: PartnerData[]; detailed?: boolean }) {
  const groups = Object.entries(
    partners.reduce<Record<string, PartnerData[]>>((acc, p) => {
      (acc[p.category] ??= []).push(p);
      return acc;
    }, {})
  ).sort(([a], [b]) => Object.keys(partnerCategoryLabels).indexOf(a) - Object.keys(partnerCategoryLabels).indexOf(b));

  return (
    <div className={cn("grid gap-5", detailed ? "lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {groups.map(([cat, list]) => (
        <div key={cat} className="flex flex-col gap-5 rounded-[20px] border border-line bg-white p-7">
          <p className="eyebrow text-[11px] text-muted">{partnerCategoryLabels[cat] ?? cat}</p>
          <ul className={cn("flex flex-col", detailed ? "gap-6" : "gap-4")}>
            {list.map((p) => (
              <li key={p.id} className="flex flex-col gap-2">
                {p.logoUrl ? (
                  <Image src={optimisedUrl(p.logoUrl, 320)} alt={`${p.name} logo`} width={160} height={48} className="h-10 w-auto object-contain object-left" />
                ) : (
                  <span className="text-[22px] font-semibold tracking-[-0.02em]">{p.name}</span>
                )}
                {detailed && p.description ? <p className="text-[15px] leading-relaxed text-muted">{p.description}</p> : null}
                {detailed && p.statusNote ? <p className="text-xs font-medium text-lime-ink">{p.statusNote}</p> : null}
                {detailed && p.websiteUrl ? (
                  <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-ink underline decoration-lime underline-offset-4">
                    Visit {p.name}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function FaqList({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.id} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {f.question}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-xl transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

/** "Title | Description" lines → objects. */
export function parsePairs(lines: string[] | null | undefined, fallback: string[]) {
  return (lines?.length ? lines : fallback).map((l) => {
    const [title, ...rest] = l.split("|");
    return { title: title.trim(), description: rest.join("|").trim() };
  });
}
