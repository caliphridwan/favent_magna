"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, destroySessionCookie, getCurrentAdmin } from "@/lib/auth";
import { loginSchema, passwordSchema, type ActionState } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

// A real hash so failed lookups take the same time as wrong passwords.
const DUMMY_HASH = bcrypt.hashSync("timing-equaliser-not-a-real-password", 12);

export async function login(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { ok: false, message: "Enter your email and password.", fieldErrors: parsed.error.flatten().fieldErrors };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const limit = rateLimit(`login:${ip}:${parsed.data.email}`, 5, 15 * 60 * 1000);
  if (!limit.ok) return { ok: false, message: "Too many attempts. Please wait 15 minutes and try again." };

  const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email } });
  const valid = await bcrypt.compare(parsed.data.password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !valid || !admin.active) return { ok: false, message: "Incorrect email or password." };

  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  await createSessionCookie({ sub: admin.id, email: admin.email, name: admin.name, role: admin.role });

  const next = String(fd.get("next") || "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  await destroySessionCookie();
  redirect("/admin/login");
}

export async function changeOwnPassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await getCurrentAdmin();
  if (!me) return { ok: false, message: "Please sign in again." };
  const current = String(fd.get("current") || "");
  const next = passwordSchema.safeParse(fd.get("password"));
  if (!next.success) return { ok: false, fieldErrors: { password: next.error.issues.map((i) => i.message) } };
  if (fd.get("password") !== fd.get("confirm")) return { ok: false, fieldErrors: { confirm: ["Passwords do not match"] } };
  const admin = await prisma.admin.findUnique({ where: { id: me.id } });
  if (!admin || !(await bcrypt.compare(current, admin.passwordHash))) return { ok: false, fieldErrors: { current: ["Current password is incorrect"] } };
  await prisma.admin.update({ where: { id: me.id }, data: { passwordHash: await bcrypt.hash(next.data, 12) } });
  return { ok: true, message: "Password updated." };
}
