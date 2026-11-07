import Link from "next/link";
import { requirePage } from "@/lib/auth";
import { saveAdmin } from "@/actions/admin/manage";
import { PageHeader } from "@/components/admin/ui";
import { AdminUserForm } from "../AdminUserForm";

export const metadata = { title: "New administrator" };

export default async function NewAdmin() {
  await requirePage("admins:manage");
  return (
    <>
      <Link href="/admin/users" className="text-sm text-muted hover:text-ink">
        ← Administrators
      </Link>
      <PageHeader title="New administrator" />
      <AdminUserForm isNew action={saveAdmin.bind(null, null)} />
    </>
  );
}
