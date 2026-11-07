import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { can, roleLabels, type Permission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { logout } from "@/actions/admin/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const all: Permission[] = ["dashboard:view", "enquiries:view", "enquiries:manage", "content:manage", "media:manage", "settings:manage", "admins:manage"];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requirePage();
  const newCount = await prisma.enquiry.count({ where: { status: "NEW" } });
  const permissions = all.filter((p) => can(admin.role, p));

  return (
    <div className="min-h-screen bg-mist lg:flex">
      <Sidebar permissions={permissions} newCount={newCount} />
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-end gap-4 border-b border-line bg-white px-6 py-3 lg:px-10">
          <span className="text-right text-sm leading-tight">
            <span className="block font-medium">{admin.name}</span>
            <span className="text-xs text-muted">{roleLabels[admin.role]}</span>
          </span>
          <form action={logout}>
            <button type="submit" className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-4 text-sm hover:border-ink">
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </form>
        </header>
        <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
