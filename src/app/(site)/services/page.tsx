import { prisma } from "@/lib/prisma";
import { getPage } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { ServiceCard } from "@/components/site/cards";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { getSettings } from "@/lib/site";

export const revalidate = 600;
export const generateMetadata = () => pageMetadata("/services", "Our Services");

export default async function ServicesPage() {
  const [page, s, categories, uncategorised] = await Promise.all([
    getPage("/services"),
    getSettings(),
    prisma.serviceCategory.findMany({
      orderBy: { order: "asc" },
      include: { services: { where: { published: true }, orderBy: { order: "asc" } } },
    }),
    prisma.service.findMany({ where: { published: true, categoryId: null }, orderBy: { order: "asc" } }),
  ]);
  const groups = [...categories.filter((c) => c.services.length), ...(uncategorised.length ? [{ id: "other", name: "More services", services: uncategorised }] : [])];
  let n = 0;

  return (
    <>
      <PageHero eyebrow="What we do" title={page?.heading || "Our Services"} intro={page?.intro} crumbs={[{ name: "Services" }]} />
      <section className="bg-white">
        <div className="container space-y-20 py-24">
          {groups.map((g) => (
            <div key={g.id} className="space-y-8">
              <Reveal>
                <h2 className="eyebrow text-muted">{g.name}</h2>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {g.services.map((sv) => {
                  const idx = n++;
                  return (
                    <Reveal key={sv.id} delay={(idx % 3) * 0.06}>
                      <ServiceCard s={sv} index={idx} />
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
          {!groups.length ? <p className="text-muted">Services will appear here once published in the dashboard.</p> : null}
        </div>
      </section>
      <CtaBand heading={s.ctaHeading} body={s.ctaBody} whatsapp={s.whatsapp} />
    </>
  );
}
