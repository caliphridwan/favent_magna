import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requirePage } from "@/lib/auth";
import { can } from "@/lib/auth/permissions";
import { formatDateTime, telHref, whatsappHref } from "@/lib/utils";
import { deleteEnquiry, updateEnquiry } from "@/actions/admin/manage";
import { ActionButton } from "@/components/admin/ActionButton";
import { ActionForm } from "@/components/admin/ActionForm";
import { Card, PageHeader, StatusBadge, adminInput } from "@/components/admin/ui";

export const metadata = { title: "Enquiry" };
type Props = { params: Promise<{ id: string }> };

export default async function EnquiryDetail({ params }: Props) {
  const admin = await requirePage("enquiries:view");
  const { id } = await params;
  const [e, admins] = await Promise.all([
    prisma.enquiry.findUnique({ where: { id }, include: { service: true, training: true, assignee: { select: { name: true } } } }),
    prisma.admin.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!e) notFound();
  const canManage = can(admin.role, "enquiries:manage");

  // Opening a NEW enquiry marks it as in progress.
  if (canManage && e.status === "NEW") {
    await prisma.enquiry.update({ where: { id }, data: { status: "IN_PROGRESS" } });
    e.status = "IN_PROGRESS";
  }

  const wa = e.phone ? whatsappHref(e.phone, `Hello ${e.name.split(" ")[0]}, thank you for contacting Favent Magna.`) : undefined;
  const details = [
    ["Type", e.type.toLowerCase()],
    ["Organisation", e.organisation],
    ["Service", e.service?.title],
    ["Training", e.training?.title],
    ["Subject", e.subject],
    ["Preferred call time", e.preferredDate],
    ["Submitted from", e.sourcePath],
    ["Received", formatDateTime(e.createdAt)],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <Link href="/admin/enquiries" className="text-sm text-muted hover:text-ink">
        ← Enquiries
      </Link>
      <PageHeader
        title={e.name}
        description={e.email}
        actions={
          <>
            <a href={`mailto:${e.email}?subject=${encodeURIComponent("Re: your enquiry to Favent Magna")}`} className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white">
              <Mail className="h-4 w-4" aria-hidden /> Reply by email
            </a>
            {e.phone ? (
              <a href={telHref(e.phone)} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold">
                <Phone className="h-4 w-4" aria-hidden /> Call
              </a>
            ) : null}
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold">
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
            ) : null}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Message</h2>
              <StatusBadge status={e.status} />
            </div>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{e.message}</p>
          </Card>
          <Card className="p-6 md:p-8">
            <dl className="grid gap-4 sm:grid-cols-2">
              {details.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{k}</dt>
                  <dd className="mt-1 text-[15px]">{v}</dd>
                </div>
              ))}
              {e.phone ? (
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Phone</dt>
                  <dd className="mt-1 text-[15px]">{e.phone}</dd>
                </div>
              ) : null}
            </dl>
          </Card>
        </div>

        <Card className="h-fit p-6">
          <h2 className="mb-4 font-semibold">Manage</h2>
          {canManage ? (
            <ActionForm action={updateEnquiry.bind(null, e.id)} submitLabel="Update enquiry">
              <div>
                <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
                  Status
                </label>
                <select id="status" name="status" defaultValue={e.status} className={adminInput}>
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="CLOSED">Closed</option>
                  <option value="SPAM">Spam</option>
                </select>
              </div>
              <div>
                <label htmlFor="assigneeId" className="mb-1.5 block text-sm font-medium">
                  Assigned to
                </label>
                <select id="assigneeId" name="assigneeId" defaultValue={e.assigneeId ?? ""} className={adminInput}>
                  <option value="">Unassigned</option>
                  {admins.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="internalNotes" className="mb-1.5 block text-sm font-medium">
                  Internal notes
                </label>
                <textarea id="internalNotes" name="internalNotes" rows={6} defaultValue={e.internalNotes ?? ""} className={adminInput} />
              </div>
            </ActionForm>
          ) : (
            <p className="text-sm text-muted">You have view-only access{e.assignee ? ` · assigned to ${e.assignee.name}` : ""}.</p>
          )}
          {canManage ? (
            <div className="mt-6 border-t border-line pt-5">
              <ActionButton action={deleteEnquiry.bind(null, e.id)} confirm="Permanently delete this enquiry?" className="text-sm font-medium text-red-700">
                <Trash2 className="h-4 w-4" aria-hidden /> Delete enquiry
              </ActionButton>
            </div>
          ) : null}
        </Card>
      </div>
    </>
  );
}
