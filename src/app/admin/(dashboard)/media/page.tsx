import { requirePage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import { PageHeader, Pagination } from "@/components/admin/ui";
import { MediaGrid } from "./MediaGrid";

export const metadata = { title: "Media library" };
type Props = { searchParams: Promise<{ page?: string }> };
const PER_PAGE = 48;

export default async function MediaPage({ searchParams }: Props) {
  await requirePage("media:manage");
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [items, total] = await Promise.all([
    prisma.media.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    prisma.media.count(),
  ]);
  return (
    <>
      <PageHeader title="Media library" description="Images and documents stored on Cloudinary. Upload here or directly from any image field." />
      {!cloudinaryConfigured ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to enable uploads.</p>
      ) : null}
      <MediaGrid items={items.map((m) => ({ id: m.id, url: m.url, alt: m.alt, format: m.format, width: m.width, height: m.height, bytes: m.bytes }))} />
      <Pagination page={page} pages={Math.ceil(total / PER_PAGE)} makeHref={(p) => `/admin/media?page=${p}`} />
    </>
  );
}
