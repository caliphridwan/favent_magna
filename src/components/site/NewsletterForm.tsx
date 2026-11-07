"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation";
import { subscribeNewsletter } from "@/actions/public";

export function NewsletterForm() {
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema), defaultValues: { email: "", website: "" } });

  const onSubmit = handleSubmit(async (values) => {
    const res = await subscribeNewsletter(values);
    setResult(res);
    if (res.ok) reset();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <label htmlFor="newsletter-email" className="eyebrow block text-[#737373]">
        Newsletter
      </label>
      <p className="text-sm leading-relaxed text-muted-dark">Technology updates and insights from our team.</p>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          className="h-12 min-w-0 flex-1 rounded-full border border-line-dark bg-[#0D0D0D] px-4 text-sm text-white placeholder:text-[#737373] focus:border-lime focus:outline-none"
          {...register("email")}
        />
        <button type="submit" disabled={isSubmitting} className="btn btn-lime h-12 px-5 text-sm">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Subscribing" /> : "Subscribe"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
        {errors.email ? <span className="text-red-400">{errors.email.message}</span> : result ? <span className={result.ok ? "text-lime" : "text-red-400"}>{result.message}</span> : null}
      </p>
    </form>
  );
}
