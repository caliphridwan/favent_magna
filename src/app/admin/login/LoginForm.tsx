"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { login } from "@/actions/admin/auth";
import type { ActionState } from "@/lib/validation";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, { ok: false } as ActionState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label htmlFor="email" className="field-label text-muted-dark">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field-input-dark" />
      </div>
      <div>
        <label htmlFor="password" className="field-label text-muted-dark">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field-input-dark" />
      </div>
      {state.message ? (
        <p role="alert" className="rounded-xl bg-red-950/60 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn btn-lime w-full">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogIn className="h-4 w-4" aria-hidden />} Sign in
      </button>
    </form>
  );
}
