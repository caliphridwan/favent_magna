import { ActionForm } from "@/components/admin/ActionForm";
import { adminInput } from "@/components/admin/ui";
import type { ActionState } from "@/lib/validation";

type Values = { name: string; email: string; role: string; active: boolean };

export function AdminUserForm({ action, values, isNew }: { action: (p: ActionState, fd: FormData) => Promise<ActionState>; values?: Values; isNew?: boolean }) {
  return (
    <ActionForm action={action} submitLabel={isNew ? "Create administrator" : "Save changes"} className="max-w-xl rounded-2xl border border-line bg-white p-6 md:p-8">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Full name
        </label>
        <input id="name" name="name" defaultValue={values?.name} required className={adminInput} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" defaultValue={values?.email} required className={adminInput} />
      </div>
      <div>
        <label htmlFor="role" className="mb-1.5 block text-sm font-medium">
          Role
        </label>
        <select id="role" name="role" defaultValue={values?.role ?? "EDITOR"} className={adminInput}>
          <option value="SUPER_ADMIN">Super Admin — everything, including administrators and settings</option>
          <option value="EDITOR">Editor — content, media and enquiries</option>
          <option value="VIEWER">Viewer — read-only enquiries</option>
        </select>
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          {isNew ? "Password" : "New password (leave blank to keep)"}
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" className={adminInput} />
        <p className="mt-1.5 text-xs text-muted">At least 12 characters with upper- and lowercase letters and a number.</p>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="active" defaultChecked={values?.active ?? true} className="h-5 w-5 accent-lime" /> Account active
      </label>
    </ActionForm>
  );
}
