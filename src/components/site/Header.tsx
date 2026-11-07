"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type NavService = { title: string; slug: string; icon: string; shortDescription: string };

const links = [
  { href: "/solutions", label: "Solutions" },
  { href: "/partners", label: "Partners" },
  { href: "/industries", label: "Industries" },
  { href: "/projects", label: "Projects" },
  { href: "/training", label: "Training" },
  { href: "/about", label: "About" },
];

export function Header({ services, logoUrl, companyName }: { services: NavService[]; logoUrl?: string | null; companyName: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-charcoal bg-ink/90 backdrop-blur-xl" : "border-transparent bg-ink"
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <nav aria-label="Main" className="container flex h-[76px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${companyName} — home`}>
          <Logo src={logoUrl} name={companyName} />
        </Link>

        <div className="hidden items-center gap-7 text-sm lg:flex">
          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button
              type="button"
              aria-expanded={mega}
              aria-controls="services-menu"
              onClick={() => setMega((v) => !v)}
              className={cn("flex items-center gap-1 py-6 transition-colors hover:text-lime", isActive("/services") ? "text-white" : "text-[#D4D4D4]")}
            >
              Services <ChevronDown className={cn("h-4 w-4 transition-transform", mega && "rotate-180")} aria-hidden />
            </button>
            <AnimatePresence>
              {mega && (
                <motion.div
                  id="services-menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full w-[760px] -translate-x-1/2 rounded-3xl border border-charcoal bg-[#0A0A0A] p-4 shadow-2xl"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {services.map((s) => {
                      const Icon = getIcon(s.icon);
                      return (
                        <Link key={s.slug} href={`/services/${s.slug}`} className="group flex gap-4 rounded-2xl p-4 transition-colors hover:bg-charcoal">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal text-lime group-hover:bg-lime group-hover:text-ink">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <span>
                            <span className="block font-medium text-white">{s.title}</span>
                            <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-muted-dark">{s.shortDescription}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <Link href="/services" className="mt-2 flex items-center justify-between rounded-2xl bg-charcoal px-5 py-4 text-sm font-medium text-white hover:text-lime">
                    View all services <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn("transition-colors hover:text-lime", isActive(l.href) ? "text-white" : "text-[#D4D4D4]")}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn btn-lime hidden h-11 px-5 text-sm sm:inline-flex">
            Speak With Our Team
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-dark text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 76px)" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-y-auto border-t border-charcoal bg-ink lg:hidden"
          >
            <div className="container space-y-8 py-8">
              <div>
                <p className="eyebrow mb-3 text-lime">Services</p>
                <ul className="space-y-1">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="block rounded-xl py-2.5 text-lg text-white">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="space-y-1 border-t border-charcoal pt-6">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block py-2.5 text-lg text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/contact" className="block py-2.5 text-lg text-white">
                    Contact
                  </Link>
                </li>
              </ul>
              <Link href="/contact" className="btn btn-lime w-full">
                Speak With Our Team
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
