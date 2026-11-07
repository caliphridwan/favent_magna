import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export const runtime = "nodejs";

function csv(rows: (string | number | null | undefined)[][]) {
  return rows
    .map((r) =>
      r
        .map((v) => {
          let s = v == null ? "" : String(v);
          if (/^[=+\-@]/.test(s)) s = `'${s}`; // neutralise spreadsheet formula injection
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");
}

/** GET /api/admin/export?type=enquiries|newsletter → CSV download. */
export async function GET(req: Request) {
  try {
    await requirePermission("enquiries:view");
  } catch {
    return new Response("Forbidden", { status: 403 });
  }
  const type = new URL(req.url).searchParams.get("type");
  let body = "";
  if (type === "newsletter") {
    const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
    body = csv([["Email", "Status", "Source", "Subscribed"], ...subs.map((s) => [s.email, s.status, s.source, s.createdAt.toISOString()])]);
  } else {
    const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, include: { service: { select: { title: true } }, training: { select: { title: true } } } });
    body = csv([
      ["Received", "Type", "Status", "Name", "Email", "Phone", "Organisation", "Service", "Training", "Subject", "Message"],
      ...rows.map((e) => [e.createdAt.toISOString(), e.type, e.status, e.name, e.email, e.phone, e.organisation, e.service?.title, e.training?.title, e.subject, e.message]),
    ]);
  }
  const name = `${type === "newsletter" ? "newsletter" : "enquiries"}-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "no-store" },
  });
}
