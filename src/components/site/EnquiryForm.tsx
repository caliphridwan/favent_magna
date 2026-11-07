"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { z } from "zod";
import { enquirySchema, type EnquiryInput } from "@/lib/validation";
import { submitEnquiry } from "@/actions/public";
import { cn } from "@/lib/utils";

type Option = { id: string; title: string };
type EnquiryType = "CONTACT" | "CONSULTATION" | "SERVICE" | "TRAINING";

type Props = {
  defaultType?: EnquiryType;
  serviceId?: string;
  trainingId?: string;
  services?: Option[];
  trainings?: Option[];
  dark?: boolean;
  showTypeSelect?: boolean;
  title?: string;
};

const typeLabels: Record<EnquiryType, string> = {
  CONTACT: "General enquiry",
  CONSULTATION: "Request a consultation",
  SERVICE: "Service enquiry",
  TRAINING: "Training enquiry",
};

export function EnquiryForm({ defaultType = "CONTACT", serviceId, trainingId, services = [], trainings = [], dark, showTypeSelect, title }: Props) {
  const pathname = usePathname();
  const [done, setDone] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput, unknown, z.output<typeof enquirySchema>>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      type: defaultType,
      name: "",
      email: "",
      phone: "",
      organisation: "",
      subject: "",
      message: "",
      preferredDate: "",
      serviceId: serviceId ?? "",
      trainingId: trainingId ?? "",
      website: "",
    },
  });

  const type = watch("type");
  const input = dark ? "field-input-dark" : "field-input";
  const label = cn("field-label", dark ? "text-muted-dark" : "text-ink");

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await submitEnquiry({ ...values, sourcePath: pathname } as EnquiryInput);
    if (res.ok) {
      setDone(res.message ?? "Thank you.");
      reset();
      return;
    }
    if (res.fieldErrors) {
      for (const [k, v] of Object.entries(res.fieldErrors)) if (v?.[0]) setError(k as keyof EnquiryInput, { message: v[0] });
    }
    setServerError(res.message ?? "Something went wrong.");
  });

  const err = (k: keyof EnquiryInput) =>
    errors[k]?.message ? (
      <p id={`${k}-error`} className="field-error">
        {String(errors[k]?.message)}
      </p>
    ) : null;

  return (
    <div className={cn("rounded-[24px] p-6 sm:p-10", dark ? "bg-ink text-white" : "border border-line bg-white")}>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-5 py-10" role="status">
            <CheckCircle2 className="h-12 w-12 text-lime" aria-hidden />
            <h3 className="text-2xl font-semibold tracking-tight">Enquiry sent</h3>
            <p className={cn("max-w-md text-[15px] leading-relaxed", dark ? "text-muted-dark" : "text-muted")}>{done}</p>
            <button type="button" onClick={() => setDone(null)} className={cn("btn", dark ? "btn-ghost-dark" : "btn-ghost-light")}>
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {title ? <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2> : null}
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />

            {showTypeSelect ? (
              <div>
                <label htmlFor="type" className={label}>
                  How can we help?
                </label>
                <select id="type" className={input} {...register("type")}>
                  {(Object.keys(typeLabels) as EnquiryType[]).map((t) => (
                    <option key={t} value={t}>
                      {typeLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <input type="hidden" {...register("type")} />
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={label}>
                  Full name *
                </label>
                <input id="name" autoComplete="name" className={input} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
                {err("name")}
              </div>
              <div>
                <label htmlFor="organisation" className={label}>
                  Organisation
                </label>
                <input id="organisation" autoComplete="organization" className={input} {...register("organisation")} />
              </div>
              <div>
                <label htmlFor="email" className={label}>
                  Work email *
                </label>
                <input id="email" type="email" autoComplete="email" className={input} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
                {err("email")}
              </div>
              <div>
                <label htmlFor="phone" className={label}>
                  Phone
                </label>
                <input id="phone" type="tel" autoComplete="tel" className={input} aria-invalid={!!errors.phone} {...register("phone")} />
                {err("phone")}
              </div>
            </div>

            {serviceId ? (
              <input type="hidden" {...register("serviceId")} />
            ) : services.length && (type === "SERVICE" || type === "CONSULTATION" || showTypeSelect) ? (
              <div>
                <label htmlFor="serviceId" className={label}>
                  Service of interest
                </label>
                <select id="serviceId" className={input} {...register("serviceId")}>
                  <option value="">Not sure yet</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {trainingId ? (
              <input type="hidden" {...register("trainingId")} />
            ) : trainings.length && type === "TRAINING" ? (
              <div>
                <label htmlFor="trainingId" className={label}>
                  Programme
                </label>
                <select id="trainingId" className={input} {...register("trainingId")}>
                  <option value="">Select a programme</option>
                  {trainings.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {type === "CONSULTATION" ? (
              <div>
                <label htmlFor="preferredDate" className={label}>
                  Preferred date / time for a call
                </label>
                <input id="preferredDate" placeholder="e.g. Tuesday morning" className={input} {...register("preferredDate")} />
              </div>
            ) : null}

            <div>
              <label htmlFor="message" className={label}>
                Tell us about your requirements *
              </label>
              <textarea id="message" rows={5} className={cn(input, "resize-y")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} {...register("message")} />
              {err("message")}
            </div>

            <div>
              <label className={cn("flex items-start gap-3 text-sm", dark ? "text-muted-dark" : "text-muted")}>
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-lime" {...register("consent")} />
                <span>I agree to Favent Magna storing these details to respond to my enquiry.</span>
              </label>
              {err("consent")}
            </div>

            {serverError ? (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </p>
            ) : null}

            <button type="submit" disabled={isSubmitting} className="btn btn-lg btn-lime w-full sm:w-auto">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              {isSubmitting ? "Sending…" : "Send enquiry"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
