import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePage } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Card, Flash, PageHeader, StatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Overview" };
type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function Overview({ searchParams }: Props) {
  await requirePage();
  const sp = await searchParams;
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const [newE, openE, monthE, subs, services, projects, recent, settings] = await Promise.all([
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { status: "IN_PROGRESS" } }),
    prisma.enquiry.count({ where: { createdAt: { gte: since }, status: { not: "SPAM" } } }),
    prisma.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
    prisma.service.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { service: { select: { title: true } } } }),
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
  ]);

  const missing = [
    !settings?.logoUrl && "Upload the company logo",
    !settings?.phone && "Add the company phone number",
    !settings?.email && "Add the company email",
    !settings?.address && "Add the office address",
    !settings?.whatsapp && "Add the WhatsApp number",
    !settings?.profilePdfUrl && "Upload the corporate profile PDF",
    projects === 0 && "Publish verified project case studies",
  ].filter(Boolean) as string[];

  const stats = [
    { label: "New enquiries", value: newE, href: "/admin/enquiries?status=NEW", dark: true },
    { label: "In progress", value: openE, href: "/admin/enquiries?status=IN_PROGRESS" },
    { label: "Enquiries (30 days)", value: monthE, href: "/admin/enquiries" },
    { label: "Newsletter subscribers", value: subs, href: "/admin/newsletter" },
    { label: "Published services", value: services, href: "/admin/services" },
    { label: "Published projects", value: projects, href: "/admin/projects" },
  ];

  return (
    <>
      <PageHeader title="Overview" description="Website activity and content at a glance." />
      <Flash searchParams={sp} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 ${s.dark ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>
            <span className={`text-sm ${s.dark ? "text-muted-dark" : "text-muted"}`}>{s.label}</span>
            <span className={`mt-1 block text-3xl font-semibold ${s.dark ? "text-lime" : ""}`}>{s.value}</span>
          </Link>
        ))}
      </div>

      {missing.length ? (
        <Card className="border-amber-200 bg-amber-50 p-6">
          <h2 className="font-semibold text-amber-900">Before launch</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <Link href="/admin/settings" className="mt-4 inline-block text-sm font-semibold text-amber-900 underline">
            Open settings
          </Link>
        </Card>
      ) : null}

      <Card>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-semibold">Latest enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm font-medium underline decoration-lime underline-offset-4">
            View all
          </Link>
        </div>
        {recent.length ? (
          <ul className="divide-y divide-line">
            {recent.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${e.id}`} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-mist">
                  <span>
                    <span className="block font-medium">{e.name}</span>
                    <span className="text-sm text-muted">{[e.organisation, e.service?.title, e.type.toLowerCase()].filter(Boolean).join(" · ")}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm text-muted">
                    {formatDateTime(e.createdAt)} <StatusBadge status={e.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-muted">No enquiries yet.</p>
        )}
      </Card>
    </>
  );
}
