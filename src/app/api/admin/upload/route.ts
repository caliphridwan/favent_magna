import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission, AuthError } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

/** POST multipart/form-data { file, alt? } → { id, url } and a Media library row. */
export async function POST(req: Request) {
  try {
    await requirePermission("media:manage");
  } catch (e) {
    return NextResponse.json({ error: e instanceof AuthError ? e.message : "Not allowed" }, { status: 403 });
  }

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received" }, { status: 400 });

  try {
    const r = await uploadToCloudinary(file);
    const media = await prisma.media.create({
      data: {
        publicId: r.public_id,
        url: r.secure_url,
        format: r.format ?? (file.type === "application/pdf" ? "pdf" : null),
        width: r.width ?? null,
        height: r.height ?? null,
        bytes: r.bytes ?? null,
        alt: (fd.get("alt") as string | null)?.slice(0, 200) || null,
      },
    });
    return NextResponse.json({ id: media.id, url: media.url });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 });
  }
}
