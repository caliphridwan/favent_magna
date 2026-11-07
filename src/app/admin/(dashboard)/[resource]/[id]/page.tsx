import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { requirePage } from "@/lib/auth";
import { getResource } from "@/lib/admin/resources";
import { delegate, includeFor, relationOptions, toFormValues } from "@/lib/admin/server";
import { deleteResource, saveResource } from "@/actions/admin/resources";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ActionButton } from "@/components/admin/ActionButton";
import { PageHeader } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils";

type Props = { params: Promise<{ resource: string; id: string }> };

export default async function EditResource({ params }: Props) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  await requirePage("content:manage");

  const [row, options] = await Promise.all([delegate(resource.model).findUnique({ where: { id }, include: includeFor(resource) }), relationOptions(resource)]);
  if (!row) notFound();
  if (options.related) options.related = options.related.filter((o) => o.value !== id);
  const pub = resource.publicPath?.(row);

  return (
    <>
      <Link href={`/admin/${key}`} className="text-sm text-muted hover:text-ink">
        ← {resource.label}
      </Link>
      <PageHeader
        title={String(row[resource.titleField] ?? resource.singular)}
        description={row.updatedAt ? `Last updated ${formatDateTime(row.updatedAt)}` : undefined}
        actions={
          <>
            {pub ? (
              <a href={pub} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-ink">
                <ExternalLink className="h-4 w-4" aria-hidden /> View
              </a>
            ) : null}
            {resource.allowDelete !== false ? (
              <ActionButton
                action={deleteResource.bind(null, key, id)}
                confirm={`Delete this ${resource.singular.toLowerCase()}? This cannot be undone.`}
                className="h-10 rounded-full border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden /> Delete
              </ActionButton>
            ) : null}
          </>
        }
      />
      <ResourceForm fields={resource.fields} values={toFormValues(resource, row)} options={options} action={saveResource.bind(null, key, id)} submitLabel="Save changes" cancelHref={`/admin/${key}`} />
    </>
  );
}
