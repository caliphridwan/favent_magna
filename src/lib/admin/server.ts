import "server-only";
import { z, type ZodTypeAny } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { Field, Resource } from "./resources";
import { getResource } from "./resources";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Delegate = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
};

export function delegate(model: string): Delegate {
  const d = (prisma as unknown as Record<string, Delegate>)[model];
  if (!d) throw new Error(`Unknown model ${model}`);
  return d;
}

const galleryItem = z.object({ url: z.string().url(), alt: z.string().max(200).optional().nullable() });

function fieldSchema(f: Field): ZodTypeAny {
  const optStr = (s: z.ZodString) => (f.required ? s.min(1, `${f.label} is required`) : s.optional().nullable());
  switch (f.type) {
    case "text":
    case "textarea":
    case "image":
    case "file":
      return optStr(z.string().max(f.max ?? (f.type === "textarea" ? 20000 : 500)));
    case "slug":
      return z
        .string()
        .max(90)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only")
        .optional()
        .nullable();
    case "email":
      return f.required ? z.string().email("Enter a valid email") : z.string().email("Enter a valid email").optional().nullable();
    case "url":
      return f.required ? z.string().url("Enter a full URL starting with https://") : z.string().url("Enter a full URL starting with https://").optional().nullable();
    case "select":
      if (f.options?.length) {
        const values = f.options.map((o) => o.value) as [string, ...string[]];
        return f.required ? z.enum(values) : z.enum(values).optional().nullable();
      }
      return z.string().optional().nullable();
    case "number":
      return z.number().int().min(-100000).max(100000).optional().nullable();
    case "boolean":
      return z.boolean();
    case "list":
      return z.array(z.string().max(500)).max(100);
    case "relation":
      return z.string().optional().nullable();
    case "relationMany":
      return z.array(z.string()).max(200);
    case "gallery":
      return z.array(galleryItem).max(60);
  }
}

export function buildSchema(fields: Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
}

/** FormData → plain values matching buildSchema(). */
export function readForm(fields: Field[], fd: FormData) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = fd.get(f.name);
    const str = typeof raw === "string" ? raw.trim() : "";
    switch (f.type) {
      case "boolean":
        out[f.name] = raw === "on" || raw === "true";
        break;
      case "number":
        out[f.name] = str === "" ? (f.name === "order" ? 0 : null) : Number(str);
        break;
      case "list":
        out[f.name] = str
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        break;
      case "relationMany":
        out[f.name] = fd.getAll(f.name).map(String).filter(Boolean);
        break;
      case "gallery":
        try {
          out[f.name] = str ? JSON.parse(str) : [];
        } catch {
          out[f.name] = [];
        }
        break;
      case "select":
        // empty select = keep DB default on create / leave unchanged on update
        out[f.name] = str === "" ? (f.required ? "" : undefined) : str;
        break;
      default:
        out[f.name] = str === "" ? null : str;
    }
  }
  return out;
}

/** Validated values → Prisma create/update data, including relations. */
export function toPrismaData(resource: Resource, values: Record<string, unknown>, mode: "create" | "update", selfId?: string) {
  const data: Record<string, unknown> = {};
  for (const f of resource.fields) {
    const v = values[f.name];
    if (v === undefined) continue;
    if (f.type === "relationMany") {
      const ids = (v as string[]).filter((id) => id !== selfId).map((id) => ({ id }));
      data[f.name] = mode === "create" ? { connect: ids } : { set: ids };
    } else if (f.type === "gallery") {
      const items = (v as { url: string; alt?: string | null }[]).map((it, i) => ({ url: it.url, alt: it.alt || null, order: i }));
      data[f.name] = mode === "create" ? { create: items } : { deleteMany: {}, create: items };
    } else if (f.type === "slug") {
      const fallback = resource.slugFrom ? slugify(String(values[resource.slugFrom] ?? "")) : "";
      data[f.name] = (v as string | null) || fallback || `item-${Date.now().toString(36)}`;
    } else {
      data[f.name] = v;
    }
  }
  return data;
}

/** Prisma `include` needed to load relation fields for the edit form. */
export function includeFor(resource: Resource) {
  const include: Record<string, unknown> = {};
  for (const f of resource.fields) {
    if (f.type === "relationMany") include[f.name] = { select: { id: true } };
    if (f.type === "gallery") include[f.name] = { orderBy: { order: "asc" }, select: { url: true, alt: true } };
  }
  return Object.keys(include).length ? include : undefined;
}

/** Options for every relation / relationMany field of a resource. */
export async function relationOptions(resource: Resource) {
  const out: Record<string, { value: string; label: string }[]> = {};
  for (const f of resource.fields) {
    if ((f.type === "relation" || f.type === "relationMany") && f.relation) {
      const target = getResource(f.relation)!;
      const rows = await delegate(target.model).findMany({ orderBy: target.orderBy, select: { id: true, [target.titleField]: true } });
      out[f.name] = rows.map((r) => ({ value: r.id as string, label: String(r[target.titleField]) }));
    }
  }
  return out;
}

/** Shape a DB row into form default values. */
export function toFormValues(resource: Resource, row: Record<string, any> | null) {
  const values: Record<string, unknown> = {};
  for (const f of resource.fields) {
    const v = row?.[f.name];
    if (f.type === "relationMany") values[f.name] = (v ?? []).map((x: { id: string }) => x.id);
    else values[f.name] = v ?? (f.type === "boolean" ? (f.name === "published" ? true : false) : f.type === "list" || f.type === "gallery" ? [] : "");
  }
  return values;
}
