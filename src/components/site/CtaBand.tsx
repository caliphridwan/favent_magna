import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function CtaBand({ heading, body, whatsapp }: { heading?: string | null; body?: string | null; whatsapp?: string | null }) {
  const wa = whatsappHref(whatsapp);
  return (
    <section className="bg-lime text-ink">
      <Reveal className="container flex flex-wrap items-center justify-between gap-10 py-20 md:py-24">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-[clamp(2.1rem,4.4vw,4rem)] font-semibold leading-none tracking-tightest">{heading || "Planning your next infrastructure project?"}</h2>
          <p className="text-lg leading-relaxed text-[#1D2A12]">
            {body || "Book a consultation and our engineers will review your requirements and recommend the right approach."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact?type=consultation" className="btn btn-lg btn-ink">
            Request a consultation
          </Link>
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-lg border-[1.5px] border-ink hover:bg-ink hover:text-white">
              <MessageCircle className="h-5 w-5" aria-hidden /> Chat on WhatsApp
            </a>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
