import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession, type SessionPayload } from "./session";
import { can, type Permission } from "./permissions";

export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Current admin, re-validated against the database (so deactivated admins lose access immediately). */
export const getCurrentAdmin = cache(async () => {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const admin = await prisma.admin.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  if (!admin || !admin.active) return null;
  return admin;
});

/** Use in admin pages: redirects to login or to the dashboard when not permitted. */
export async function requirePage(permission: Permission = "dashboard:view") {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (!can(admin.role, permission)) redirect("/admin?denied=1");
  return admin;
}

export class AuthError extends Error {}

/** Use in server actions and route handlers: throws when not permitted. */
export async function requirePermission(permission: Permission) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new AuthError("You must be signed in.");
  if (!can(admin.role, permission)) throw new AuthError("You do not have permission to do that.");
  return admin;
}
