import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/site";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { optimisedUrl } from "@/lib/utils";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/site/JsonLd";

export const revalidate = 600;
type Props = { params: Promise<{ slug: string }> };

const getProject = (slug: string) =>
  prisma.project.findFirst({
    where: { slug, published: true, verified: true },
    include: { images: { orderBy: { order: "asc" } }, services: { where: { published: true }, select: { title: true, slug: true } } },
  });

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  return buildMetadata({ path: `/projects/${p.slug}`, title: p.metaTitle || p.title, description: p.metaDescription || p.summary, image: p.coverImageUrl });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [p, s] = await Promise.all([getProject(slug), getSettings()]);
  if (!p) notFound();

  const facts = [
    ["Client", p.client],
    ["Sector", p.sector],
    ["Location", p.location],
    ["Year", p.year?.toString()],
  ].filter(([, v]) => v) as [string, string][];

  const sections = [
    ["The challenge", p.challenge],
    ["Our solution", p.solution],
    ["The outcome", p.outcome],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }, { name: p.title, path: `/projects/${p.slug}` }])} />
      <PageHero eyebrow="Case study" title={p.title} intro={p.summary} crumbs={[{ name: "Projects", href: "/projects" }, { name: p.title }]}>
        {facts.length ? (
          <dl className="grid max-w-3xl grid-cols-2 gap-6 border-t border-charcoal pt-8 sm:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-dark">{k}</dt>
                <dd className="mt-1 text-[15px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </PageHero>

      {p.coverImageUrl ? (
        <div className="container pt-12">
          <div className="relative aspect-[21/9] overflow-hidden rounded-[28px] bg-charcoal">
            <Image src={optimisedUrl(p.coverImageUrl, 1800)} alt={p.title} fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>
      ) : null}

      <section className="bg-white">
        <div className="container grid gap-16 py-24 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-14">
            {sections.map(([k, v]) => (
              <Reveal key={k} className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-[-0.02em]">{k}</h2>
                <div className="prose-fm">
                  {v.split(/\n{2,}/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          {p.services.length ? (
            <aside className="h-fit space-y-4 rounded-[20px] bg-mist p-8">
              <p className="eyebrow text-[11px] text-muted">Services delivered</p>
              <ul className="space-y-2">
                {p.services.map((sv) => (
                  <li key={sv.slug}>
                    <Link href={`/services/${sv.slug}`} className="font-medium underline decoration-lime underline-offset-4">
                      {sv.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </section>

      {p.images.length ? (
        <section className="bg-mist">
          <div className="container grid gap-4 py-20 sm:grid-cols-2 lg:grid-cols-3">
            {p.images.map((img) => (
              <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-charcoal">
                <Image src={optimisedUrl(img.url, 900)} alt={img.alt || p.title} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <CtaBand heading={s.ctaHeading} body={s.ctaBody} whatsapp={s.whatsapp} />
    </>
  );
}
