import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPage, getSettings } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { getIcon } from "@/lib/icons";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";

export const revalidate = 600;
export const generateMetadata = () => pageMetadata("/solutions", "Business Solutions");

export default async function SolutionsPage() {
  const [page, s, solutions] = await Promise.all([
    getPage("/solutions"),
    getSettings(),
    prisma.solution.findMany({ where: { published: true }, orderBy: { order: "asc" }, include: { services: { where: { published: true }, select: { title: true, slug: true } } } }),
  ]);

  return (
    <>
      <PageHero eyebrow="Business solutions" title={page?.heading || "Business Solutions"} intro={page?.intro} crumbs={[{ name: "Solutions" }]} />
      <section className="bg-white">
        <div className="container grid gap-6 py-24 md:grid-cols-2">
          {solutions.map((so, i) => {
            const Icon = getIcon(so.icon);
            return (
              <Reveal key={so.id} delay={(i % 2) * 0.08} className="flex flex-col gap-6 rounded-[24px] border border-line bg-mist p-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-lime">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">{so.title}</h2>
                <p className="text-[16px] leading-relaxed text-muted">{so.summary}</p>
                {so.body ? <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#33372F]">{so.body}</p> : null}
                {so.services.length ? (
                  <div className="mt-auto space-y-3 border-t border-line pt-6">
                    <p className="eyebrow text-[11px] text-muted">Delivered through</p>
                    <div className="flex flex-wrap gap-2">
                      {so.services.map((x) => (
                        <Link key={x.slug} href={`/services/${x.slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-medium hover:bg-lime-soft">
                          {x.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Reveal>
            );
          })}
        </div>
      </section>
      <CtaBand heading={s.ctaHeading} body={s.ctaBody} whatsapp={s.whatsapp} />
    </>
  );
}
