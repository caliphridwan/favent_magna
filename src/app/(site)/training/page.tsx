import { Clock, MonitorSmartphone, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPage } from "@/lib/site";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { FaqList } from "@/components/site/cards";
import { JsonLd } from "@/components/site/JsonLd";

export const revalidate = 600;
export const generateMetadata = () => pageMetadata("/training", "Professional Technology Training");

export default async function TrainingPage() {
  const [page, programmes, faqs] = await Promise.all([
    getPage("/training"),
    prisma.trainingProgramme.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.faq.findMany({ where: { published: true, category: { equals: "training", mode: "insensitive" } }, orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      <PageHero eyebrow="Training" title={page?.heading || "Professional Technology Training"} intro={page?.intro} crumbs={[{ name: "Training" }]} />

      <section className="bg-white">
        <div className="container space-y-6 py-24">
          {programmes.length ? (
            programmes.map((t, i) => (
              <Reveal key={t.id} delay={0.04 * i}>
                <article id={t.slug} className="grid scroll-mt-28 gap-8 rounded-[24px] border border-line bg-mist p-8 md:p-10 lg:grid-cols-[1.3fr_1fr]">
                  <div className="space-y-4">
                    <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">{t.title}</h2>
                    <p className="text-[16px] leading-relaxed text-muted">{t.summary}</p>
                    {t.description ? <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#33372F]">{t.description}</p> : null}
                    <div className="flex flex-wrap gap-3 pt-2 text-sm">
                      {t.duration ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                          <Clock className="h-4 w-4 text-lime-dark" aria-hidden /> {t.duration}
                        </span>
                      ) : null}
                      {t.deliveryMode ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                          <MonitorSmartphone className="h-4 w-4 text-lime-dark" aria-hidden /> {t.deliveryMode}
                        </span>
                      ) : null}
                      {t.audience ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                          <Users className="h-4 w-4 text-lime-dark" aria-hidden /> {t.audience}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {t.outline.length ? (
                    <div className="rounded-[18px] bg-white p-7">
                      <p className="eyebrow mb-4 text-[11px] text-muted">Programme outline</p>
                      <ol className="space-y-3">
                        {t.outline.map((o, j) => (
                          <li key={o} className="flex gap-3 text-[15px]">
                            <span className="font-mono text-xs text-lime-dark">{String(j + 1).padStart(2, "0")}</span> {o}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                </article>
              </Reveal>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-line p-12 text-center">
              <h2 className="text-2xl font-semibold">Programmes are being updated</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted">Tell us what your team needs to learn and we&apos;ll get back to you with available training.</p>
            </div>
          )}
        </div>
      </section>

      {faqs.length ? (
        <section className="bg-mist">
          <div className="container grid gap-12 py-24 lg:grid-cols-[1fr_2fr]">
            <h2 className="h-section">Training FAQs</h2>
            <FaqList faqs={faqs} />
          </div>
        </section>
      ) : null}

      <section id="enquire" className="bg-white">
        <div className="container py-24">
          <EnquiryForm dark defaultType="TRAINING" trainings={programmes.map((p) => ({ id: p.id, title: p.title }))} title="Enquire about training" />
        </div>
      </section>
    </>
  );
}
