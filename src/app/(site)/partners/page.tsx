import { prisma } from "@/lib/prisma";
import { getPage, getSettings } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { PartnerGroups } from "@/components/site/cards";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";

export const revalidate = 600;
export const generateMetadata = () => pageMetadata("/partners", "Technology Partners");

export default async function PartnersPage() {
  const [page, s, partners] = await Promise.all([
    getPage("/partners"),
    getSettings(),
    prisma.partner.findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <>
      <PageHero eyebrow="Technology ecosystem" title={page?.heading || "Technology Partners"} intro={page?.intro} crumbs={[{ name: "Partners" }]} />
      <section className="bg-mist">
        <div className="container space-y-8 py-24">
          <Reveal>
            <PartnerGroups partners={partners} detailed />
          </Reveal>
          <p className="max-w-3xl text-[13px] leading-relaxed text-muted">
            Brand names and logos are trademarks of their respective owners and are shown to indicate the technology platforms we work with.
          </p>
        </div>
      </section>
      <CtaBand heading={s.ctaHeading} body={s.ctaBody} whatsapp={s.whatsapp} />
    </>
  );
}
