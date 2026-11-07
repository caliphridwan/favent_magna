"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission, AuthError } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { passwordSchema, type ActionState } from "@/lib/validation";

/* ───────────── Enquiries ───────────── */

const enquiryUpdate = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "CLOSED", "SPAM"]),
  internalNotes: z.string().max(10000).optional(),
  assigneeId: z.string().optional(),
});

export async function updateEnquiry(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requirePermission("enquiries:manage");
  } catch (e) {
    return { ok: false, message: e instanceof AuthError ? e.message : "Not allowed." };
  }
  const parsed = enquiryUpdate.safeParse({
    status: fd.get("status"),
    internalNotes: fd.get("internalNotes") ?? undefined,
    assigneeId: fd.get("assigneeId") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Invalid update." };
  await prisma.enquiry.update({
    where: { id },
    data: { status: parsed.data.status, internalNotes: parsed.data.internalNotes || null, assigneeId: parsed.data.assigneeId || null },
  });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Enquiry updated." };
}

export async function setEnquiryStatus(id: string, status: "NEW" | "IN_PROGRESS" | "CLOSED" | "SPAM") {
  await requirePermission("enquiries:manage");
  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}

export async function deleteEnquiry(id: string) {
  await requirePermission("enquiries:manage");
  await prisma.enquiry.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/enquiries?deleted=1");
}

/* ───────────── Media ───────────── */

export async function deleteMedia(id: string) {
  await requirePermission("media:manage");
  const m = await prisma.media.findUnique({ where: { id } });
  if (!m) return;
  await deleteFromCloudinary(m.publicId, m.format === "pdf" || m.url.includes("/raw/"));
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}

export async function updateMediaAlt(id: string, alt: string) {
  await requirePermission("media:manage");
  await prisma.media.update({ where: { id }, data: { alt: alt.slice(0, 200) || null } });
  revalidatePath("/admin/media");
}

/* ───────────── Newsletter ───────────── */

export async function deleteSubscriber(id: string) {
  await requirePermission("enquiries:manage");
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}

/* ───────────── Administrators (super admin only) ───────────── */

const adminSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["SUPER_ADMIN", "EDITOR", "VIEWER"]),
  active: z.boolean(),
});

export async function saveAdmin(id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  let me;
  try {
    me = await requirePermission("admins:manage");
  } catch (e) {
    return { ok: false, message: e instanceof AuthError ? e.message : "Not allowed." };
  }
  const parsed = adminSchema.safeParse({ name: fd.get("name"), email: fd.get("email"), role: fd.get("role"), active: fd.get("active") === "on" });
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };

  const password = String(fd.get("password") || "");
  if (!id || password) {
    const p = passwordSchema.safeParse(password);
    if (!p.success) return { ok: false, fieldErrors: { password: p.error.issues.map((i) => i.message) } };
  }
  if (id === me.id && (parsed.data.role !== "SUPER_ADMIN" || !parsed.data.active)) {
    return { ok: false, message: "You can't remove your own super admin access or deactivate yourself." };
  }

  try {
    const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;
    if (id) await prisma.admin.update({ where: { id }, data: { ...parsed.data, ...(passwordHash ? { passwordHash } : {}) } });
    else await prisma.admin.create({ data: { ...parsed.data, passwordHash: passwordHash! } });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") return { ok: false, fieldErrors: { email: ["An administrator with this email already exists"] } };
    console.error(e);
    return { ok: false, message: "Could not save administrator." };
  }
  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export async function deleteAdmin(id: string) {
  const me = await requirePermission("admins:manage");
  if (id === me.id) throw new Error("You can't delete your own account.");
  const supers = await prisma.admin.count({ where: { role: "SUPER_ADMIN", active: true, NOT: { id } } });
  if (!supers) throw new Error("At least one active super admin is required.");
  await prisma.admin.delete({ where: { id } });
  revalidatePath("/admin/users");
  redirect("/admin/users?deleted=1");
}
