import { prisma } from "@/lib/prisma";
import { getPage, getSettings } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { getIcon } from "@/lib/icons";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";

export const revalidate = 600;
export const generateMetadata = () => pageMetadata("/industries", "Industries We Serve");

export default async function IndustriesPage() {
  const [page, s, industries] = await Promise.all([
    getPage("/industries"),
    getSettings(),
    prisma.industry.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <PageHero eyebrow="Industries" title={page?.heading || "Industries We Serve"} intro={page?.intro} crumbs={[{ name: "Industries" }]} />
      <section className="bg-charcoal text-white">
        <div className="container py-24">
          {industries.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind, i) => {
                const Icon = getIcon(ind.icon);
                return (
                  <Reveal key={ind.id} delay={(i % 3) * 0.06} className="flex flex-col gap-5 rounded-[20px] border border-line-dark bg-ink p-8">
                    <Icon className="h-7 w-7 text-lime" aria-hidden />
                    <h2 className="text-2xl font-semibold tracking-[-0.015em]">{ind.name}</h2>
                    {ind.summary ? <p className="text-[15px] leading-relaxed text-muted-dark">{ind.summary}</p> : null}
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-dark">Industry information is being updated. Please contact us to discuss your sector.</p>
          )}
        </div>
      </section>
      <CtaBand heading={s.ctaHeading} body={s.ctaBody} whatsapp={s.whatsapp} />
    </>
  );
}
