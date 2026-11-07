import "server-only";
import type { Metadata } from "next";
import { getPage, getSettings } from "@/lib/site";
import { absoluteUrl, siteUrl } from "@/lib/utils";

type MetaInput = {
  path: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  noIndex?: boolean;
};

/** Builds metadata with canonical URL, Open Graph and Twitter tags. */
export async function buildMetadata({ path, title, description, image, noIndex }: MetaInput): Promise<Metadata> {
  const settings = await getSettings();
  const desc = description || settings.defaultMetaDesc || undefined;
  const ogImage = image || settings.ogImageUrl || undefined;
  return {
    title: title || undefined,
    description: desc,
    alternates: { canonical: absoluteUrl(path) },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: settings.companyName,
      title: title || settings.defaultMetaTitle || settings.companyName,
      description: desc,
      locale: "en_NG",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: { card: ogImage ? "summary_large_image" : "summary", title: title || undefined, description: desc },
  };
}

/** Metadata for one of the fixed pages, editable in Admin → Pages & SEO. */
export async function pageMetadata(path: string, fallbackTitle: string): Promise<Metadata> {
  const page = await getPage(path);
  return buildMetadata({
    path,
    title: page?.metaTitle || fallbackTitle,
    description: page?.metaDescription || page?.intro,
    image: page?.ogImageUrl,
    noIndex: page?.noIndex,
  });
}

export async function organizationJsonLd() {
  const s = await getSettings();
  const sameAs = [s.facebookUrl, s.linkedinUrl, s.xUrl, s.instagramUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: s.companyName,
    url: siteUrl,
    logo: s.logoUrl || undefined,
    description: s.defaultMetaDesc || undefined,
    email: s.email || undefined,
    telephone: s.phone || undefined,
    address: s.address
      ? { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "NG" }
      : { "@type": "PostalAddress", addressCountry: "NG" },
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function serviceJsonLd(service: { title: string; slug: string; shortDescription: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "Nigeria" },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}
