/**
 * Edge-safe session helpers (used by middleware and server code).
 * Sessions are signed JWTs (HS256) stored in an httpOnly, secure cookie.
 */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "fm_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export type AdminRoleName = "SUPER_ADMIN" | "EDITOR" | "VIEWER";

export type SessionPayload = {
  sub: string; // admin id
  email: string;
  name: string;
  role: AdminRoleName;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .setIssuer("faventmagna")
    .sign(getSecret());
}

export async function verifySession(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: "faventmagna", algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as AdminRoleName,
    };
  } catch {
    return null;
  }
}
