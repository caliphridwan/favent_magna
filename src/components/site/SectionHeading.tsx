import Link from "next/link";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string | null;
  dark?: boolean;
  action?: { href: string; label: string };
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, dark, action, className }: Props) {
  return (
    <Reveal className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="max-w-2xl space-y-4">
        <p className={cn("eyebrow", dark ? "text-lime" : "text-muted")}>{eyebrow}</p>
        <h2 className="h-section">{title}</h2>
        {intro ? <p className={cn("text-lg leading-relaxed", dark ? "text-muted-dark" : "text-muted")}>{intro}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className={cn("link-underline", dark && "text-white hover:text-lime")}>
          {action.label}
        </Link>
      ) : null}
    </Reveal>
  );
}
