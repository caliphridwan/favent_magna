import "server-only";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "application/pdf"];
export const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadToCloudinary(file: File): Promise<UploadApiResponse> {
  if (!cloudinaryConfigured) throw new Error("Cloudinary is not configured. Add CLOUDINARY_* environment variables.");
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Unsupported file type.");
  if (file.size > MAX_BYTES) throw new Error("File is larger than 10 MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || "faventmagna",
          resource_type: file.type === "application/pdf" ? "raw" : "image",
          use_filename: true,
          unique_filename: true,
        },
        (err, result) => (err || !result ? reject(err ?? new Error("Upload failed")) : resolve(result))
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string, isRaw = false) {
  if (!cloudinaryConfigured) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: isRaw ? "raw" : "image" });
}

export { optimisedUrl } from "@/lib/utils";
