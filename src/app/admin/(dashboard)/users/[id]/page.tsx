import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteAdmin, saveAdmin } from "@/actions/admin/manage";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/ui";
import { AdminUserForm } from "../AdminUserForm";

export const metadata = { title: "Edit administrator" };
type Props = { params: Promise<{ id: string }> };

export default async function EditAdmin({ params }: Props) {
  const me = await requirePage("admins:manage");
  const { id } = await params;
  const a = await prisma.admin.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, active: true } });
  if (!a) notFound();
  return (
    <>
      <Link href="/admin/users" className="text-sm text-muted hover:text-ink">
        ← Administrators
      </Link>
      <PageHeader
        title={a.name}
        description={a.email}
        actions={
          a.id !== me.id ? (
            <ActionButton action={deleteAdmin.bind(null, a.id)} confirm={`Delete ${a.name}'s account?`} className="h-10 rounded-full border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" aria-hidden /> Delete
            </ActionButton>
          ) : null
        }
      />
      <AdminUserForm action={saveAdmin.bind(null, a.id)} values={a} />
    </>
  );
}
