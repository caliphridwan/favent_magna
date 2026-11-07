import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPage, getSettings } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { ProjectCard } from "@/components/site/cards";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { cn } from "@/lib/utils";

export const revalidate = 600;
export const generateMetadata = () => pageMetadata("/projects", "Projects & Case Studies");

type Props = { searchParams: Promise<{ service?: string }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const { service } = await searchParams;
  const [page, s, services, projects] = await Promise.all([
    getPage("/projects"),
    getSettings(),
    prisma.service.findMany({ where: { published: true, projects: { some: { published: true, verified: true } } }, orderBy: { order: "asc" }, select: { slug: true, title: true } }),
    prisma.project.findMany({
      where: { published: true, verified: true, ...(service ? { services: { some: { slug: service } } } : {}) },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { year: "desc" }],
    }),
  ]);

  return (
    <>
      <PageHero eyebrow="Our work" title={page?.heading || "Projects & Case Studies"} intro={page?.intro} crumbs={[{ name: "Projects" }]} />
      <section className="bg-white">
        <div className="container space-y-10 py-24">
          {services.length > 1 ? (
            <nav aria-label="Filter projects by service" className="flex flex-wrap gap-2">
              <Link href="/projects" className={cn("rounded-full px-4 py-2 text-sm", !service ? "bg-ink text-white" : "border border-line hover:border-ink")}>
                All
              </Link>
              {services.map((sv) => (
                <Link key={sv.slug} href={`/projects?service=${sv.slug}`} className={cn("rounded-full px-4 py-2 text-sm", service === sv.slug ? "bg-ink text-white" : "border border-line hover:border-ink")}>
                  {sv.title}
                </Link>
              ))}
            </nav>
          ) : null}
          {projects.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06}>
                  <ProjectCard p={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-line p-12 text-center">
              <h2 className="text-2xl font-semibold">Case studies coming soon</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted">We&apos;re preparing detailed write-ups of recent projects. In the meantime, speak to our team about work relevant to your organisation.</p>
              <Link href="/contact" className="btn btn-ink mt-6">
                Contact us
              </Link>
            </div>
          )}
        </div>
      </section>
      <CtaBand heading={s.ctaHeading} body={s.ctaBody} whatsapp={s.whatsapp} />
    </>
  );
}
