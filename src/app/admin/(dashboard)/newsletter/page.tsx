import { Download, Trash2 } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { can } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { deleteSubscriber } from "@/actions/admin/manage";
import { ActionButton } from "@/components/admin/ActionButton";
import { Card, PageHeader, Pagination, StatusBadge } from "@/components/admin/ui";

export const metadata = { title: "Newsletter" };
type Props = { searchParams: Promise<{ page?: string }> };
const PER_PAGE = 50;

export default async function NewsletterPage({ searchParams }: Props) {
  const admin = await requirePage("enquiries:view");
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [subs, total, active] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
  ]);
  const canManage = can(admin.role, "enquiries:manage");

  return (
    <>
      <PageHeader
        title="Newsletter subscribers"
        description={`${active} active of ${total} total. Export to your email marketing tool to send campaigns.`}
        actions={
          <a href="/api/admin/export?type=newsletter" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-ink">
            <Download className="h-4 w-4" aria-hidden /> Export CSV
          </a>
        }
      />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              <th className="px-5 py-3.5 font-medium">Email</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium">Subscribed</th>
              <th className="px-5 py-3.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2EE]">
            {subs.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3.5 font-medium">{s.email}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-5 py-3.5 text-muted">{formatDate(s.createdAt)}</td>
                <td className="px-5 py-3.5 text-right">
                  {canManage ? (
                    <ActionButton action={deleteSubscriber.bind(null, s.id)} confirm={`Remove ${s.email}?`} className="text-red-700" title="Remove subscriber">
                      <Trash2 className="h-4 w-4" aria-label="Remove" />
                    </ActionButton>
                  ) : null}
                </td>
              </tr>
            ))}
            {!subs.length ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-muted">
                  No subscribers yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
      <Pagination page={page} pages={Math.ceil(total / PER_PAGE)} makeHref={(p) => `/admin/newsletter?page=${p}`} />
    </>
  );
}
