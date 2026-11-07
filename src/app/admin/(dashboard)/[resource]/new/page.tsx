import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePage } from "@/lib/auth";
import { getResource } from "@/lib/admin/resources";
import { relationOptions, toFormValues } from "@/lib/admin/server";
import { saveResource } from "@/actions/admin/resources";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { PageHeader } from "@/components/admin/ui";

type Props = { params: Promise<{ resource: string }> };

export default async function NewResource({ params }: Props) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource || resource.allowCreate === false) notFound();
  await requirePage("content:manage");
  const options = await relationOptions(resource);

  return (
    <>
      <Link href={`/admin/${key}`} className="text-sm text-muted hover:text-ink">
        ← {resource.label}
      </Link>
      <PageHeader title={`New ${resource.singular.toLowerCase()}`} />
      <ResourceForm
        fields={resource.fields}
        values={toFormValues(resource, null)}
        options={options}
        action={saveResource.bind(null, key, null)}
        submitLabel={`Create ${resource.singular.toLowerCase()}`}
        cancelHref={`/admin/${key}`}
      />
    </>
  );
}
