import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";
import { getIcon } from "@/lib/icons";
import { optimisedUrl, partnerCategoryLabels, whatsappHref } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { JsonLd } from "@/components/site/JsonLd";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

async function getService(slug: string) {
  return prisma.service.findFirst({
    where: { slug, published: true },
    include: {
      partners: { where: { published: true }, orderBy: { order: "asc" } },
      related: { where: { published: true }, orderBy: { order: "asc" }, select: { id: true, title: true, slug: true, icon: true } },
    },
  });
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return {};
  return buildMetadata({ path: `/services/${s.slug}`, title: s.metaTitle || s.title, description: s.metaDescription || s.shortDescription, image: s.heroImageUrl });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getService(slug), getSettings()]);
  if (!service) notFound();
  const Icon = getIcon(service.icon);
  const wa = whatsappHref(settings.whatsapp, `Hello Favent Magna, I'd like to enquire about ${service.title}.`);

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/services/${service.slug}` }])} />

      <PageHero title={service.title} intro={service.intro || service.shortDescription} crumbs={[{ name: "Services", href: "/services" }, { name: service.title }]}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime text-ink">
            <Icon className="h-7 w-7" aria-hidden />
          </span>
          <a href="#enquire" className="btn btn-lg btn-lime">
            Enquire about this service
          </a>
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-ghost-dark">
              <MessageCircle className="h-5 w-5" aria-hidden /> Chat on WhatsApp
            </a>
          ) : null}
        </div>
      </PageHero>

      {service.heroImageUrl ? (
        <div className="bg-ink">
          <div className="container -mt-px pb-0">
            <div className="relative aspect-[21/9] overflow-hidden rounded-t-[28px]">
              <Image src={optimisedUrl(service.heroImageUrl, 1600)} alt={service.title} fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
        </div>
      ) : null}

      {/* Overview + capabilities */}
      <section className="bg-white">
        <div className="container grid gap-16 py-24 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-5">
            <p className="eyebrow text-muted">Overview</p>
            <h2 className="text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em]">{service.shortDescription}</h2>
            {service.body ? (
              <div className="prose-fm">
                {service.body.split(/\n{2,}/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
          </Reveal>
          {service.capabilities.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {service.capabilities.map((c, i) => (
                <Reveal key={c} delay={(i % 2) * 0.06} className="space-y-3 rounded-[18px] bg-mist p-7">
                  <p className="font-mono text-xs text-muted">CAPABILITY</p>
                  <h3 className="text-[19px] font-semibold leading-snug">{c}</h3>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Platforms + applications */}
      {service.partners.length || service.applications.length ? (
        <section className="bg-ink text-white">
          <div className="container grid gap-6 py-24 lg:grid-cols-[1fr_2fr]">
            {service.partners.length ? (
              <Reveal className="space-y-6 rounded-[24px] border border-charcoal bg-[#0D0D0D] p-10">
                <p className="eyebrow text-lime">Technology platforms</p>
                <ul className="divide-y divide-charcoal">
                  {service.partners.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-4 py-4">
                      {p.logoUrl ? (
                        <Image src={optimisedUrl(p.logoUrl, 320)} alt={`${p.name} logo`} width={140} height={40} className="h-8 w-auto object-contain" />
                      ) : (
                        <span className="text-[26px] font-semibold tracking-[-0.02em]">{p.name}</span>
                      )}
                      <span className="text-right font-mono text-[11px] uppercase text-muted-dark">{partnerCategoryLabels[p.category]}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/partners" className="inline-flex items-center gap-2 text-sm font-medium text-lime">
                  All technology partners <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Reveal>
            ) : null}
            {service.applications.length ? (
              <Reveal delay={0.08} className="space-y-6 rounded-[24px] border border-charcoal bg-[#0D0D0D] p-10">
                <p className="eyebrow text-lime">Business applications</p>
                <ul className="grid gap-x-8 gap-y-5 text-[17px] text-[#D4D4D4] sm:grid-cols-2">
                  {service.applications.map((a) => (
                    <li key={a} className="flex gap-3">
                      <span className="text-lime">—</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Benefits */}
      {service.benefits.length ? (
        <section className="bg-mist">
          <div className="container space-y-12 py-24">
            <Reveal>
              <h2 className="h-section max-w-2xl">What your organisation gains</h2>
            </Reveal>
            <ul className="grid gap-8 border-t-2 border-ink pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {service.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-lg font-medium leading-snug">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-lime-dark" aria-hidden /> {b}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Related + enquiry */}
      <section id="enquire" className="scroll-mt-24 bg-white">
        <div className="container grid gap-14 py-24 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            {service.related.length ? (
              <>
                <p className="eyebrow text-muted">Related services</p>
                <ul className="space-y-3">
                  {service.related.map((r) => {
                    const RIcon = getIcon(r.icon);
                    return (
                      <li key={r.id}>
                        <Link href={`/services/${r.slug}`} className="card-lift flex items-center justify-between gap-4 rounded-2xl border border-line px-6 py-5 text-[17px] font-semibold">
                          <span className="flex items-center gap-3">
                            <RIcon className="h-5 w-5 text-lime-dark" aria-hidden /> {r.title}
                          </span>
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </div>
          <EnquiryForm dark defaultType="SERVICE" serviceId={service.id} title={`Enquire about ${service.title}`} />
        </div>
      </section>
    </>
  );
}
