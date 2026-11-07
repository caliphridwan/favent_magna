import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPage, getSettings } from "@/lib/site";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { telHref, whatsappHref } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { FaqList } from "@/components/site/cards";
import { JsonLd } from "@/components/site/JsonLd";

export const generateMetadata = () => pageMetadata("/contact", "Contact Us");

type Props = { searchParams: Promise<{ type?: string; service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [page, s, services, trainings, faqs] = await Promise.all([
    getPage("/contact"),
    getSettings(),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { id: true, title: true, slug: true } }),
    prisma.trainingProgramme.findMany({ where: { published: true }, orderBy: { order: "asc" }, select: { id: true, title: true } }),
    prisma.faq.findMany({ where: { published: true, OR: [{ category: null }, { category: { equals: "general", mode: "insensitive" } }] }, orderBy: { order: "asc" } }),
  ]);

  const defaultType = sp.type === "consultation" ? "CONSULTATION" : sp.type === "training" ? "TRAINING" : sp.service ? "SERVICE" : "CONTACT";
  const preselected = services.find((x) => x.slug === sp.service)?.id;
  const wa = whatsappHref(s.whatsapp);

  const channels = [
    s.phone && { Icon: Phone, label: "Call us", value: s.phone, href: telHref(s.phone) },
    s.phoneAlt && { Icon: Phone, label: "Alternative line", value: s.phoneAlt, href: telHref(s.phoneAlt) },
    wa && { Icon: MessageCircle, label: "WhatsApp", value: "Chat with our team", href: wa, external: true },
    s.email && { Icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    s.address && { Icon: MapPin, label: "Office", value: s.address },
    s.businessHours && { Icon: Clock, label: "Business hours", value: s.businessHours },
  ].filter(Boolean) as { Icon: typeof Phone; label: string; value: string; href?: string; external?: boolean }[];

  return (
    <>
      {faqs.length ? <JsonLd data={faqJsonLd(faqs)} /> : null}
      <PageHero eyebrow="Contact" title={page?.heading || "Speak With Our Team"} intro={page?.intro} crumbs={[{ name: "Contact" }]} />

      <section className="bg-mist">
        <div className="container grid gap-10 py-20 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-4">
            {channels.map(({ Icon, label, value, href, external }) => {
              const inner = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-lime">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{label}</span>
                    <span className="mt-1 block whitespace-pre-line text-[17px] font-medium">{value}</span>
                  </span>
                </>
              );
              return href ? (
                <a key={label} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="card-lift flex gap-4 rounded-[18px] border border-line bg-white p-6">
                  {inner}
                </a>
              ) : (
                <div key={label} className="flex gap-4 rounded-[18px] border border-line bg-white p-6">
                  {inner}
                </div>
              );
            })}
            {s.mapEmbedUrl ? (
              <iframe title="Office location map" src={s.mapEmbedUrl} className="h-72 w-full rounded-[18px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : null}
          </div>
          <EnquiryForm showTypeSelect defaultType={defaultType} services={services} trainings={trainings} serviceId={preselected} title="Send us a message" />
        </div>
      </section>

      {faqs.length ? (
        <section className="bg-white">
          <div className="container grid gap-12 py-24 lg:grid-cols-[1fr_2fr]">
            <h2 className="h-section">Frequently asked questions</h2>
            <FaqList faqs={faqs} />
          </div>
        </section>
      ) : null}
    </>
  );
}
