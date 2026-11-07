import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Health check for the hosting platform. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
