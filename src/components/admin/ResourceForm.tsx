"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import type { Field } from "@/lib/admin/resources";
import type { ActionState } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { GalleryField, ImageField, MultiCheck } from "./fields";

type Props = {
  fields: Field[];
  values: Record<string, unknown>;
  options?: Record<string, { value: string; label: string }[]>;
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  submitLabel?: string;
  cancelHref?: string;
  readOnly?: boolean;
};

function Submit({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button type="submit" disabled={pending} className="btn btn-lime h-11 px-6 text-sm">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
      {pending ? "Saving…" : label}
    </button>
  );
}

const inputCls = "block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[15px] focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/30";

export function ResourceForm({ fields, values, options = {}, action, submitLabel = "Save", cancelHref, readOnly }: Props) {
  const [state, formAction, pending] = useActionState(action, { ok: false } as ActionState);
  // Submit via onSubmit (not the form `action` prop) so React doesn't reset the
  // uncontrolled inputs when the server returns validation errors.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };

  const sections = fields.reduce<{ name: string; fields: Field[] }[]>((acc, f) => {
    const name = f.section ?? "Details";
    const s = acc.find((x) => x.name === name);
    if (s) s.fields.push(f);
    else acc.push({ name, fields: [f] });
    return acc;
  }, []);

  const renderField = (f: Field) => {
    const id = `f-${f.name}`;
    const v = values[f.name];
    const errs = state.fieldErrors?.[f.name];
    const common = { id, name: f.name, "aria-invalid": !!errs, "aria-describedby": f.help ? `${id}-help` : undefined, disabled: readOnly };

    let control: React.ReactNode;
    switch (f.type) {
      case "textarea":
        control = <textarea {...common} rows={f.rows ?? 4} defaultValue={(v as string) ?? ""} maxLength={f.max} className={cn(inputCls, "resize-y")} />;
        break;
      case "list":
        control = <textarea {...common} rows={Math.max(4, ((v as string[]) ?? []).length + 1)} defaultValue={((v as string[]) ?? []).join("\n")} className={cn(inputCls, "resize-y font-mono text-sm")} />;
        break;
      case "number":
        control = <input {...common} type="number" defaultValue={v === null || v === undefined || v === "" ? "" : String(v)} className={inputCls} />;
        break;
      case "boolean":
        control = (
          <label className="flex h-11 cursor-pointer items-center gap-3 text-[15px]">
            <input {...common} type="checkbox" defaultChecked={Boolean(v)} className="h-5 w-5 accent-lime" />
            {f.label}
          </label>
        );
        break;
      case "select":
        control = (
          <select {...common} defaultValue={(v as string) ?? ""} className={inputCls}>
            {!f.required ? <option value="">—</option> : null}
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
        break;
      case "relation":
        control = (
          <select {...common} defaultValue={(v as string) ?? ""} className={inputCls}>
            <option value="">— None —</option>
            {(options[f.name] ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
        break;
      case "relationMany":
        control = <MultiCheck name={f.name} options={options[f.name] ?? []} defaultValue={(v as string[]) ?? []} />;
        break;
      case "image":
        control = <ImageField name={f.name} defaultValue={v as string} />;
        break;
      case "file":
        control = <ImageField name={f.name} defaultValue={v as string} accept="application/pdf" kind="file" />;
        break;
      case "gallery":
        control = <GalleryField name={f.name} defaultValue={(v as { url: string; alt?: string | null }[]) ?? []} />;
        break;
      default:
        control = (
          <input
            {...common}
            type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"}
            defaultValue={(v as string) ?? ""}
            maxLength={f.max}
            placeholder={f.placeholder ?? (f.type === "slug" ? "auto-generated" : undefined)}
            className={cn(inputCls, f.type === "slug" && "font-mono text-sm")}
          />
        );
    }

    return (
      <div key={f.name} className={cn(f.wide && "md:col-span-2")}>
        {f.type !== "boolean" ? (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
            {f.label}
            {f.required ? <span className="text-red-600"> *</span> : null}
          </label>
        ) : null}
        {control}
        {f.help ? (
          <p id={`${id}-help`} className="mt-1.5 text-xs text-muted">
            {f.help}
          </p>
        ) : null}
        {errs?.length ? <p className="mt-1.5 text-sm text-red-700">{errs[0]}</p> : null}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {sections.map((s) => (
        <fieldset key={s.name} className="rounded-2xl border border-line bg-white p-6 md:p-8">
          <legend className="sr-only">{s.name}</legend>
          <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">{s.name}</h2>
          <div className="grid gap-6 md:grid-cols-2">{s.fields.map(renderField)}</div>
        </fieldset>
      ))}
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={cn("rounded-xl px-4 py-3 text-sm", state.ok ? "bg-lime-soft text-lime-ink" : "bg-red-50 text-red-700")}>
          {state.message}
        </p>
      ) : null}
      {!readOnly ? (
        <div className="sticky bottom-0 flex flex-wrap gap-3 border-t border-line bg-mist/95 py-4 backdrop-blur">
          <Submit label={submitLabel} pending={pending} />
          {cancelHref ? (
            <Link href={cancelHref} className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium hover:bg-white">
              Cancel
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
