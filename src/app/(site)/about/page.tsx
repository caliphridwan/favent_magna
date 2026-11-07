import { getPage, getSettings, getNavServices } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { ServiceCard, parsePairs } from "@/components/site/cards";
import { CtaBand } from "@/components/site/CtaBand";
import { pad2 } from "@/lib/utils";

export const revalidate = 600;
export const generateMetadata = () => pageMetadata("/about", "About Us");

export default async function AboutPage() {
  const [page, s, services] = await Promise.all([getPage("/about"), getSettings(), getNavServices()]);
  const body = page?.body || s.aboutBody || s.introBody || "";
  const why = parsePairs(s.whyItems, []);

  return (
    <>
      <PageHero eyebrow="About us" title={page?.heading || "About Favent Magna"} intro={page?.intro} crumbs={[{ name: "About" }]} />

      <section className="bg-white">
        <div className="container grid gap-14 py-24 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-4">
            <p className="eyebrow text-muted">Who we are</p>
            <h2 className="h-section">{s.companyName}</h2>
          </Reveal>
          <Reveal delay={0.08} className="prose-fm">
            {body.split(/\n{2,}/).filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {s.mission || s.vision ? (
        <section className="bg-ink text-white">
          <div className="container grid gap-6 py-24 md:grid-cols-2">
            {[
              ["Our mission", s.mission],
              ["Our vision", s.vision],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <Reveal key={k} className="space-y-5 rounded-[24px] border border-charcoal bg-[#0D0D0D] p-10">
                  <p className="eyebrow text-lime">{k}</p>
                  <p className="text-2xl font-medium leading-snug tracking-[-0.01em]">{v}</p>
                </Reveal>
              ))}
          </div>
        </section>
      ) : null}

      {why.length ? (
        <section className="bg-mist">
          <div className="container grid gap-8 py-24 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.06} className="space-y-3">
                <span className="block text-4xl font-light text-lime-dark">{pad2(i + 1)}</span>
                <h3 className="text-xl font-semibold">{w.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{w.description}</p>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-white">
        <div className="container space-y-10 py-24">
          <h2 className="h-section">What we deliver</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((sv, i) => (
              <ServiceCard key={sv.slug} s={sv} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand heading={s.ctaHeading} body={s.ctaBody} whatsapp={s.whatsapp} />
    </>
  );
}
