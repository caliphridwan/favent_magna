import Link from "next/link";
import { Download, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import type { Settings } from "@/lib/site";
import { telHref } from "@/lib/utils";

const company = [
  { href: "/about", label: "About Us" },
  { href: "/solutions", label: "Business Solutions" },
  { href: "/partners", label: "Technology Partners" },
  { href: "/industries", label: "Industries" },
  { href: "/projects", label: "Projects" },
  { href: "/training", label: "Training" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ settings, services }: { settings: Settings; services: { title: string; slug: string }[] }) {
  const s = settings;
  const socials = [
    { href: s.linkedinUrl, label: "LinkedIn" },
    { href: s.facebookUrl, label: "Facebook" },
    { href: s.instagramUrl, label: "Instagram" },
    { href: s.xUrl, label: "X" },
  ].filter((x) => x.href);

  return (
    <footer className="bg-ink text-white">
      <div className="container space-y-16 pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr_1.3fr]">
          <div className="space-y-5">
            <Logo src={s.logoDarkUrl || s.logoUrl} name={s.companyName} />
            <p className="max-w-xs text-sm leading-relaxed text-muted-dark">{s.tagline || "Technology infrastructure, security and connectivity."}</p>
            {s.profilePdfUrl ? (
              <a href={s.profilePdfUrl} className="inline-flex items-center gap-2 text-sm font-medium text-lime hover:text-lime-light" download>
                <Download className="h-4 w-4" aria-hidden /> Download corporate profile (PDF)
              </a>
            ) : null}
            {socials.length ? (
              <div className="flex flex-wrap gap-2">
                {socials.map(({ href, label }) => (
                  <a key={label} href={href!} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line-dark px-4 py-2 text-xs text-[#D4D4D4] hover:border-lime hover:text-lime">
                    {label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-3 text-sm">
            <p className="eyebrow text-[#737373]">Services</p>
            <ul className="space-y-3">
              {services.map((sv) => (
                <li key={sv.slug}>
                  <Link href={`/services/${sv.slug}`} className="text-[#D4D4D4] hover:text-lime">
                    {sv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <p className="eyebrow text-[#737373]">Company</p>
            <ul className="space-y-3">
              {company.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-[#D4D4D4] hover:text-lime">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-sm text-[#D4D4D4]">
            <p className="eyebrow text-[#737373]">Contact</p>
            <address className="space-y-3 not-italic">
              {s.address ? (
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lime" aria-hidden />
                  <span className="whitespace-pre-line">{s.address}</span>
                </p>
              ) : null}
              {s.phone ? (
                <a href={telHref(s.phone)} className="flex gap-3 hover:text-lime">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-lime" aria-hidden /> {s.phone}
                </a>
              ) : null}
              {s.phoneAlt ? (
                <a href={telHref(s.phoneAlt)} className="flex gap-3 hover:text-lime">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-lime" aria-hidden /> {s.phoneAlt}
                </a>
              ) : null}
              {s.email ? (
                <a href={`mailto:${s.email}`} className="flex gap-3 break-all hover:text-lime">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-lime" aria-hidden /> {s.email}
                </a>
              ) : null}
              {!s.address && !s.phone && !s.email ? (
                <Link href="/contact" className="hover:text-lime">
                  Send us a message →
                </Link>
              ) : null}
            </address>
          </div>

          <NewsletterForm />
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-charcoal pt-7 text-[13px] text-[#737373]">
          <p>
            © {new Date().getFullYear()} {s.companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="hover:text-lime">
              Privacy
            </Link>
            <span>faventmagna.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
