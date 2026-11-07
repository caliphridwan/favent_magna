"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Runs a server action, optionally after a confirmation prompt. */
export function ActionButton({
  action,
  confirm,
  children,
  className,
  title,
}: {
  action: () => Promise<unknown>;
  confirm?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      title={title}
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        start(async () => {
          try {
            await action();
          } catch (e) {
            // redirect() throws a special error that Next handles; surface anything else
            if (e && typeof e === "object" && "digest" in e && String((e as { digest: string }).digest).startsWith("NEXT_REDIRECT")) throw e;
            window.alert(e instanceof Error ? e.message : "Action failed");
          }
        });
      }}
      className={cn("inline-flex items-center gap-2 disabled:opacity-60", className)}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
