/**
 * 301 redirects from the OLD faventmagna.com (WordPress) URLs to the new structure.
 *
 * Old site pages (Nov 2026): /, /about/, /solutions/, /partnerships/, /contact/
 *  • /about/ and /contact/ keep the same path (Next.js strips the trailing slash with a permanent redirect).
 *  • /solutions/ keeps its path — it now hosts Business Solutions, which links to every service.
 *  • /partnerships/ → /partners (below).
 *
 * Before switching DNS, check Google Search Console → Pages for any other
 * indexed URLs (e.g. old blog posts) and add them here.
 */
export const legacyRedirects: { from: string; to: string }[] = [
  { from: "/partnerships", to: "/partners" },
  { from: "/partnerships/:path*", to: "/partners" },
  { from: "/index.php", to: "/" },
  { from: "/home", to: "/" },
  { from: "/about-us", to: "/about" },
  { from: "/contact-us", to: "/contact" },
  { from: "/our-services", to: "/services" },
];
