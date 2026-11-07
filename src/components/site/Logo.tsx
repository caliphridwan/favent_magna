import Image from "next/image";
import { cn } from "@/lib/utils";

/** Uses the uploaded logo from Site Settings; falls back to a wordmark until the real logo is supplied. */
export function Logo({ src, name, dark = true, className }: { src?: string | null; name: string; dark?: boolean; className?: string }) {
  if (src) {
    return <Image src={src} alt={name} width={180} height={48} className={cn("h-10 w-auto", className)} priority />;
  }
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime text-[15px] font-bold tracking-tight text-ink">FM</span>
      <span className="flex flex-col leading-[1.05]">
        <span className={cn("text-base font-semibold tracking-[0.04em]", dark ? "text-white" : "text-ink")}>FAVENT MAGNA</span>
        <span className={cn("font-mono text-[10px] tracking-[0.14em]", dark ? "text-muted-dark" : "text-muted")}>NIGERIA LIMITED</span>
      </span>
    </span>
  );
}
