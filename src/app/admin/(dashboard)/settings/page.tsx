import { requirePage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsFields } from "@/lib/admin/resources";
import { saveSettings } from "@/actions/admin/resources";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Homepage & settings" };

export default async function SettingsPage() {
  await requirePage("settings:manage");
  const row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const values = Object.fromEntries(settingsFields.map((f) => [f.name, (row as Record<string, unknown> | null)?.[f.name] ?? (f.type === "list" ? [] : "")]));
  return (
    <>
      <PageHeader title="Homepage & settings" description="Company details, homepage copy, contact information and default SEO. Changes go live immediately." />
      <ResourceForm fields={settingsFields} values={values} action={saveSettings} submitLabel="Save settings" />
    </>
  );
}
