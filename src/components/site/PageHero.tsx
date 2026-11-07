import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

type Crumb = { name: string; href?: string };

export function PageHero({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string; title: string; intro?: string | null; crumbs?: Crumb[]; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-charcoal bg-ink text-white">
      <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="container relative space-y-8 pb-20 pt-14 md:pb-24">
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-muted-dark">
              <li>
                <Link href="/" className="hover:text-lime">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" aria-hidden />
                  {c.href ? (
                    <Link href={c.href} className="hover:text-lime">
                      {c.name}
                    </Link>
                  ) : (
                    <span className="text-lime" aria-current="page">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <Reveal className="max-w-4xl space-y-6">
          {eyebrow ? <p className="eyebrow text-lime">{eyebrow}</p> : null}
          <h1 className="text-[clamp(2.5rem,5.4vw,4.75rem)] font-semibold leading-[1] tracking-tightest">{title}</h1>
          {intro ? <p className="max-w-2xl text-lg font-light leading-relaxed text-[#B5B5B5] md:text-xl">{intro}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
