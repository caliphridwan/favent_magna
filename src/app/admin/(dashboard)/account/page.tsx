import { requirePage } from "@/lib/auth";
import { roleLabels } from "@/lib/auth/permissions";
import { changeOwnPassword } from "@/actions/admin/auth";
import { ActionForm } from "@/components/admin/ActionForm";
import { PageHeader, adminInput } from "@/components/admin/ui";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const me = await requirePage();
  return (
    <>
      <PageHeader title="My account" description={`${me.name} · ${me.email} · ${roleLabels[me.role]}`} />
      <ActionForm action={changeOwnPassword} submitLabel="Change password" className="max-w-md rounded-2xl border border-line bg-white p-6 md:p-8">
        <h2 className="font-semibold">Change password</h2>
        <div>
          <label htmlFor="current" className="mb-1.5 block text-sm font-medium">
            Current password
          </label>
          <input id="current" name="current" type="password" autoComplete="current-password" className={adminInput} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            New password
          </label>
          <input id="password" name="password" type="password" autoComplete="new-password" className={adminInput} />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
            Confirm new password
          </label>
          <input id="confirm" name="confirm" type="password" autoComplete="new-password" className={adminInput} />
        </div>
      </ActionForm>
    </>
  );
}
