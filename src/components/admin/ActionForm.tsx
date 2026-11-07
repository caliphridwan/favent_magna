"use client";

import { startTransition, useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { ActionState } from "@/lib/validation";
import { cn } from "@/lib/utils";

/** Small wrapper for hand-built admin forms backed by a server action. */
export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  className,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, dispatch, pending] = useActionState(action, { ok: false } as ActionState);
  const errors = Object.entries(state.fieldErrors ?? {}).filter(([, v]) => v?.length);

  return (
    <form
      noValidate
      className={cn("space-y-5", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => dispatch(fd));
      }}
    >
      {children}
      {errors.length ? (
        <ul role="alert" className="space-y-1 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.map(([k, v]) => (
            <li key={k}>
              <span className="font-medium capitalize">{k}</span>: {v![0]}
            </li>
          ))}
        </ul>
      ) : null}
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={cn("rounded-xl px-4 py-3 text-sm", state.ok ? "bg-lime-soft text-lime-ink" : "bg-red-50 text-red-700")}>
          {state.message}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn btn-lime h-11 px-6 text-sm">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
