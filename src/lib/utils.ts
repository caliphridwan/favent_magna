import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://faventmagna.com").replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function telHref(phone?: string | null) {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;
}

export function whatsappHref(number?: string | null, text = "Hello Favent Magna, I'd like to make an enquiry.") {
  if (!number) return undefined;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function formatDate(d: Date | string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-NG", opts).format(new Date(d));
}

export function formatDateTime(d: Date | string) {
  return formatDate(d, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export const partnerCategoryLabels: Record<string, string> = {
  NETWORKING: "Networking & Switching",
  SECURITY: "Cybersecurity",
  PHYSICAL_SECURITY: "Physical Security",
  CABLING: "Structured Cabling",
  STORAGE: "Data Centre & Storage",
  CONNECTIVITY: "Connectivity & Internet Management",
  CLOUD_PRODUCTIVITY: "Cloud & Productivity",
  UNIFIED_COMMUNICATIONS: "Unified Communications",
  OTHER: "Additional Platforms",
};

/** Insert automatic format/quality transforms into a Cloudinary delivery URL. */
export function optimisedUrl(url: string, width?: number) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
  const t = ["f_auto", "q_auto", width ? `w_${width}` : null].filter(Boolean).join(",");
  return url.replace("/image/upload/", `/image/upload/${t}/`);
}
