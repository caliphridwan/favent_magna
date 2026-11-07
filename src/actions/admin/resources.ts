"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { requirePermission, AuthError } from "@/lib/auth";
import { getResource, settingsFields } from "@/lib/admin/resources";
import { buildSchema, delegate, readForm, toPrismaData } from "@/lib/admin/server";
import { prisma } from "@/lib/prisma";
import type { ActionState } from "@/lib/validation";

function prismaError(e: unknown): ActionState | null {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    const target = (e.meta?.target as string[] | undefined)?.[0] ?? "slug";
    return { ok: false, message: "That value is already in use.", fieldErrors: { [target]: ["Already in use — choose another"] } };
  }
  return null;
}

export async function saveResource(key: string, id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const resource = getResource(key);
  if (!resource) return { ok: false, message: "Unknown content type." };
  try {
    await requirePermission("content:manage");
  } catch (e) {
    return { ok: false, message: e instanceof AuthError ? e.message : "Not allowed." };
  }

  const parsed = buildSchema(resource.fields).safeParse(readForm(resource.fields, fd));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const values = parsed.data as Record<string, unknown>;

  if (resource.key === "projects" && values.published && !values.verified) {
    return { ok: false, message: "Only verified projects can be published.", fieldErrors: { verified: ["Confirm the project details are verified before publishing"] } };
  }

  try {
    const d = delegate(resource.model);
    if (id) await d.update({ where: { id }, data: toPrismaData(resource, values, "update", id) });
    else await d.create({ data: toPrismaData(resource, values, "create") });
  } catch (e) {
    const handled = prismaError(e);
    if (handled) return handled;
    console.error(`[admin] save ${key} failed`, e);
    return { ok: false, message: "Could not save. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect(`/admin/${key}?saved=1`);
}

export async function deleteResource(key: string, id: string) {
  const resource = getResource(key);
  if (!resource || resource.allowDelete === false) throw new Error("Not allowed");
  await requirePermission("content:manage");
  await delegate(resource.model).delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`/admin/${key}?deleted=1`);
}

export async function togglePublished(key: string, id: string, published: boolean) {
  const resource = getResource(key);
  if (!resource || !resource.fields.some((f) => f.name === "published")) throw new Error("Not allowed");
  await requirePermission("content:manage");
  if (key === "projects" && published) {
    const p = await prisma.project.findUnique({ where: { id }, select: { verified: true } });
    if (!p?.verified) throw new Error("Only verified projects can be published.");
  }
  await delegate(resource.model).update({ where: { id }, data: { published } });
  revalidatePath("/", "layout");
}

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requirePermission("settings:manage");
  } catch (e) {
    return { ok: false, message: e instanceof AuthError ? e.message : "Not allowed." };
  }
  const parsed = buildSchema(settingsFields).safeParse(readForm(settingsFields, fd));
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined)) as unknown as Prisma.SiteSettingUncheckedUpdateInput;
  if (typeof data.whatsapp === "string") data.whatsapp = data.whatsapp.replace(/\D/g, "");
  try {
    await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: data,
      create: { ...(data as unknown as Prisma.SiteSettingUncheckedCreateInput), id: 1 },
    });
  } catch (e) {
    console.error("[admin] settings", e);
    return { ok: false, message: "Could not save settings." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
