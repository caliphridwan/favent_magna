import "server-only";
import { cache } from "react";
import type { SiteSetting } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const fallbackSettings: SiteSetting = {
  id: 1,
  companyName: "Favent Magna Nigeria Limited",
  tagline: "Technology infrastructure, security and connectivity.",
  logoUrl: null,
  logoDarkUrl: null,
  heroEyebrow: "Enterprise Technology · Nigeria",
  heroHeadline: "Technology Infrastructure. Security. Connectivity. Delivered.",
  heroSubtext:
    "Empowering organisations with integrated technology solutions, secure infrastructure and dependable digital connectivity.",
  heroPrimaryCta: "Explore Our Services",
  heroSecondaryCta: "Speak With Our Team",
  heroImageUrl: null,
  introHeading: null,
  introBody: null,
  aboutBody: null,
  mission: null,
  vision: null,
  whyItems: [],
  approachSteps: [],
  ctaHeading: null,
  ctaBody: null,
  address: null,
  phone: null,
  phoneAlt: null,
  whatsapp: null,
  email: null,
  businessHours: null,
  mapEmbedUrl: null,
  profilePdfUrl: null,
  facebookUrl: null,
  linkedinUrl: null,
  xUrl: null,
  instagramUrl: null,
  defaultMetaTitle: "Favent Magna Nigeria Limited",
  defaultMetaDesc: null,
  ogImageUrl: null,
  updatedAt: new Date(0),
};

export type Settings = SiteSetting;

export const getSettings = cache(async (): Promise<Settings> => {
  const s = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return s ?? fallbackSettings;
});

export const getPage = cache(async (path: string) => prisma.page.findUnique({ where: { path } }));

export const getNavServices = cache(async () =>
  prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: { title: true, slug: true, icon: true, shortDescription: true },
  })
);
