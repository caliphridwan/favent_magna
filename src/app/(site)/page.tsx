import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { getIcon } from "@/lib/icons";
import { pad2 } from "@/lib/utils";
import { HeroNetwork } from "@/components/site/HeroNetwork";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard, ProjectCard, PartnerGroups, parsePairs } from "@/components/site/cards";
import { CtaBand } from "@/components/site/CtaBand";

export const revalidate = 600;

export async function generateMetadata() {
  return pageMetadata("/", "Favent Magna Nigeria Limited | Technology Infrastructure, Security & Connectivity");
}

const defaultWhy = [
  "One accountable partner | Network, security, cabling, storage and connectivity scoped and delivered by a single team.",
  "Vendor-diverse choice | A broad platform ecosystem means solutions fit your requirements and budget.",
  "Designed to be supported | Documented installs and clean handovers make every system easier to run.",
  "Skills that stay with you | Professional training builds your team's confidence on the technology we deploy.",
];
const defaultSteps = [
  "Assess | Site survey and requirements gathering.",
  "Design | Architecture, bill of materials and a costed proposal.",
  "Deploy | Installation, configuration and testing on site.",
  "Train & hand over | Documentation and hands-on training.",
  "Support | Ongoing maintenance, upgrades and expansion.",
];

export default async function HomePage() {
  const [s, services, partners, solutions, industries, projects, testimonials] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { published: true, featured: true }, orderBy: { order: "asc" } }),
    prisma.partner.findMany({ where: { published: true }, orderBy: [{ order: "asc" }] }),
    prisma.solution.findMany({ where: { published: true }, orderBy: { order: "asc" }, include: { services: { select: { title: true, slug: true } } }, take: 6 }),
    prisma.industry.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.project.findMany({ where: { published: true, verified: true }, orderBy: [{ featured: "desc" }, { order: "asc" }], take: 3 }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 3 }),
  ]);

  const why = parsePairs(s.whyItems, defaultWhy);
  const steps = parsePairs(s.approachSteps, defaultSteps);
  const [h1Lead, h1Last] = (() => {
    const words = s.heroHeadline.trim().split(" ");
    return words.length > 1 ? [words.slice(0, -1).join(" "), words.at(-1)] : ["", s.heroHeadline];
  })();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-charcoal bg-ink text-white">
        <div className="container grid items-center gap-14 pb-16 pt-20 md:pt-28 lg:grid-cols-[1.15fr_1fr]">
          <Reveal className="space-y-7">
            {s.heroEyebrow ? <p className="eyebrow text-lime">{s.heroEyebrow}</p> : null}
            <h1 className="h-display">
              {h1Lead} <span className="text-lime">{h1Last}</span>
            </h1>
            <p className="max-w-xl text-lg font-light leading-relaxed text-[#B5B5B5] md:text-[19px]">{s.heroSubtext}</p>
            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link href="/services" className="btn btn-lg btn-lime">
                {s.heroPrimaryCta} <ArrowRight className="h-[18px] w-[18px]" aria-hidden />
              </Link>
              <Link href="/contact" className="btn btn-lg btn-ghost-dark">
                {s.heroSecondaryCta}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <HeroNetwork />
          </Reveal>
        </div>
        <div className="container grid grid-cols-2 gap-x-6 pb-14 sm:grid-cols-4 lg:grid-cols-7">
          {services.map((sv, i) => (
            <Link key={sv.id} href={`/services/${sv.slug}`} className="group flex flex-col gap-1.5 border-t border-line-dark py-5 hover:border-lime">
              <span className="font-mono text-[11px] text-lime">{pad2(i + 1)}</span>
              <span className="text-sm text-[#D4D4D4] group-hover:text-white">{sv.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section id="about" className="bg-mist">
        <div className="container grid gap-14 py-24 md:py-32 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="space-y-4">
            <p className="eyebrow text-muted">Who we are</p>
            <h2 className="h-section">{s.introHeading || "One partner for the infrastructure your organisation runs on."}</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-lg leading-[1.7] text-[#33372F]">
            {(s.introBody || "").split(/\n{2,}/).filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <Link href="/about" className="link-underline">
              About Favent Magna <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white">
        <div className="container space-y-14 py-24 md:py-32">
          <SectionHeading eyebrow="Core services" title="Seven disciplines. One integrated delivery team." action={{ href: "/services", label: "All services" }} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((sv, i) => (
              <Reveal key={sv.id} delay={(i % 4) * 0.06}>
                <ServiceCard s={sv} index={i} />
              </Reveal>
            ))}
            <Reveal delay={0.18}>
              <Link href="/contact?type=consultation" className="card-lift flex h-full min-h-[270px] flex-col gap-5 rounded-[20px] border border-ink bg-ink p-8 text-white">
                <p className="eyebrow text-lime">Not sure where to start?</p>
                <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.02em]">Tell us the problem. We&apos;ll scope the right mix.</h3>
                <span className="btn btn-lime mt-auto">Book a consultation</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-ink text-white">
        <div className="container space-y-14 py-24 md:py-32">
          <SectionHeading dark eyebrow="Why Favent Magna" title="Built end to end, so nothing falls between vendors." />
          <div className="grid border-t border-line-dark sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.08} className="space-y-3.5 border-charcoal py-9 sm:pr-7 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0">
                <span className="block text-[44px] font-light tracking-[-0.04em] text-lime">{pad2(i + 1)}</span>
                <h3 className="text-xl font-semibold">{w.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-dark">{w.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      {partners.length ? (
        <section className="bg-mist">
          <div className="container space-y-12 py-24 md:py-32">
            <SectionHeading eyebrow="Technology ecosystem" title="The platforms we design, deploy and support." action={{ href: "/partners", label: "View technology partners" }} />
            <Reveal>
              <PartnerGroups partners={partners} />
            </Reveal>
            <p className="text-[13px] text-muted">Brand names and logos are trademarks of their respective owners.</p>
          </div>
        </section>
      ) : null}

      {/* SOLUTIONS */}
      {solutions.length ? (
        <section className="bg-white">
          <div className="container space-y-14 py-24 md:py-32">
            <SectionHeading eyebrow="Business solutions" title="Services combined around the outcome you need." action={{ href: "/solutions", label: "All solutions" }} />
            <div className="grid border-t border-line md:grid-cols-2">
              {solutions.map((so, i) => {
                const Icon = getIcon(so.icon);
                return (
                  <Reveal key={so.id} delay={(i % 2) * 0.08} className="flex gap-6 border-b border-line py-9 md:pr-10">
                    <Icon className="mt-1 h-6 w-6 shrink-0 text-lime-dark" aria-hidden />
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold tracking-[-0.02em]">{so.title}</h3>
                      <p className="text-[15px] leading-relaxed text-muted">{so.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {so.services.map((x) => (
                          <Link key={x.slug} href={`/services/${x.slug}`} className="rounded-full bg-mist px-3 py-1.5 text-xs hover:bg-lime-soft">
                            {x.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* INDUSTRIES */}
      {industries.length ? (
        <section className="bg-charcoal text-white">
          <div className="container space-y-12 py-24 md:py-32">
            <SectionHeading dark eyebrow="Industries" title="Infrastructure for organisations that can't afford downtime." action={{ href: "/industries", label: "Industries we serve" }} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((ind, i) => {
                const Icon = getIcon(ind.icon);
                return (
                  <Reveal key={ind.id} delay={(i % 4) * 0.05}>
                    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-line-dark bg-ink p-7 text-lg font-medium">
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-lime" aria-hidden /> {ind.name}
                      </span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* PROJECTS — verified & published only */}
      {projects.length ? (
        <section className="bg-white">
          <div className="container space-y-12 py-24 md:py-32">
            <SectionHeading eyebrow="Projects" title="Selected work." action={{ href: "/projects", label: "All case studies" }} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProjectCard p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* APPROACH */}
      <section className="bg-mist">
        <div className="container space-y-14 py-24 md:py-32">
          <SectionHeading eyebrow="How we deliver" title="A clear path from first survey to steady state." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((st, i) => (
              <Reveal key={st.title} delay={i * 0.07}>
                <div className={`flex h-full flex-col gap-3.5 rounded-[18px] border p-7 ${i === steps.length - 1 ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-sm font-semibold text-ink">{i + 1}</span>
                  <h3 className="text-[19px] font-semibold">{st.title}</h3>
                  <p className={`text-sm leading-relaxed ${i === steps.length - 1 ? "text-muted-dark" : "text-muted"}`}>{st.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (only when published) */}
      {testimonials.length ? (
        <section className="bg-white">
          <div className="container grid gap-6 py-24 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="flex flex-col gap-6 rounded-[20px] border border-line p-8">
                <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-auto text-sm">
                  <span className="block font-semibold">{t.author}</span>
                  <span className="text-muted">{[t.role, t.organisation].filter(Boolean).join(", ")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <CtaBand heading={s.ctaHeading} body={s.ctaBody} whatsapp={s.whatsapp} />
    </>
  );
}
