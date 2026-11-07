import Image from "next/image";
import { optimisedUrl } from "@/lib/utils";

type Item = { id: string; name: string; logoUrl: string | null };

/** Endless horizontal strip of partner brands; pauses on hover, stops for reduced motion. */
export function PartnerMarquee({ items, label = "Technology brands we work with" }: { items: Item[]; label?: string }) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-14 pr-14" aria-hidden={hidden || undefined}>
      {items.map((p) => (
        <li key={`${hidden ? "b" : "a"}-${p.id}`} className="shrink-0">
          {p.logoUrl ? (
            <Image src={optimisedUrl(p.logoUrl, 280)} alt={hidden ? "" : `${p.name} logo`} width={140} height={40} className="h-8 w-auto object-contain opacity-70 brightness-0 invert transition-opacity hover:opacity-100" />
          ) : (
            <span className="whitespace-nowrap text-xl font-semibold tracking-[-0.02em] text-[#8C8C8C] transition-colors hover:text-white">{p.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className="border-b border-charcoal bg-ink py-10">
      <p className="eyebrow container mb-6 text-[#737373]">{label}</p>
      <div className="marquee group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
