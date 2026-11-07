/**
 * 301 redirects from the OLD faventmagna.com URLs to the new structure.
 *
 * IMPORTANT: The old site could not be crawled while this project was built.
 * Before launch, export the old URL list (Google Search Console → Pages,
 * or the old sitemap.xml) and map every indexed URL that changes below.
 * URLs that stay the same need no entry.
 *
 * The entries below are COMMON patterns only — confirm each against the
 * real old URLs and delete any that don't apply.
 */
export const legacyRedirects: { from: string; to: string }[] = [
  { from: "/index.html", to: "/" },
  { from: "/index.php", to: "/" },
  { from: "/home", to: "/" },
  { from: "/about-us", to: "/about" },
  { from: "/about.html", to: "/about" },
  { from: "/contact-us", to: "/contact" },
  { from: "/contact.html", to: "/contact" },
  { from: "/our-services", to: "/services" },
  { from: "/services.html", to: "/services" },
  { from: "/our-partners", to: "/partners" },
  { from: "/oem-partners", to: "/partners" },
  // { from: "/cyber-security", to: "/services/cybersecurity-solutions" },
];
