import Link from "next/link";
import { Plus } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { roleLabels } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { ButtonLink, Card, Flash, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Administrators" };
type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function UsersPage({ searchParams }: Props) {
  await requirePage("admins:manage");
  const sp = await searchParams;
  const admins = await prisma.admin.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] });
  return (
    <>
      <PageHeader
        title="Administrators"
        description="Super Admins manage everything; Editors manage content and enquiries; Viewers can read enquiries only."
        actions={
          <ButtonLink href="/admin/users/new" variant="lime">
            <Plus className="h-4 w-4" aria-hidden /> New administrator
          </ButtonLink>
        }
      />
      <Flash searchParams={sp} />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              <th className="px-5 py-3.5 font-medium">Name</th>
              <th className="px-5 py-3.5 font-medium">Role</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium">Last sign-in</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2EE]">
            {admins.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-3.5">
                  <span className="block font-medium">{a.name}</span>
                  <span className="text-muted">{a.email}</span>
                </td>
                <td className="px-5 py-3.5">{roleLabels[a.role]}</td>
                <td className="px-5 py-3.5">{a.active ? "Active" : <span className="text-red-700">Deactivated</span>}</td>
                <td className="px-5 py-3.5 text-muted">{a.lastLoginAt ? formatDateTime(a.lastLoginAt) : "Never"}</td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/admin/users/${a.id}`} className="font-semibold">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
