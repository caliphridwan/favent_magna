import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

const fixed = ["/", "/about", "/services", "/solutions", "/partners", "/industries", "/projects", "/training", "/contact", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, services, projects] = await Promise.all([
    prisma.page.findMany({ select: { path: true, noIndex: true, updatedAt: true } }),
    prisma.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.project.findMany({ where: { published: true, verified: true }, select: { slug: true, updatedAt: true } }),
  ]);
  const pageInfo = new Map(pages.map((p) => [p.path, p]));

  return [
    ...fixed
      .filter((path) => !pageInfo.get(path)?.noIndex)
      .map((path) => ({
        url: absoluteUrl(path),
        lastModified: pageInfo.get(path)?.updatedAt ?? new Date(),
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1 : 0.8,
      })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/projects/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
