/**
 * Declarative definitions for every content type managed in the admin.
 * The generic list / form / server action use these to render fields,
 * validate input (Zod, built server-side from these) and write to Prisma.
 * This file is shared by server and client code — keep it free of server imports.
 */
import { iconOptions } from "@/lib/icons";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "file"
  | "list"
  | "slug"
  | "relation"
  | "relationMany"
  | "gallery"
  | "email"
  | "url";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  rows?: number;
  max?: number;
  options?: { value: string; label: string }[];
  /** For relation fields: which resource provides the options. */
  relation?: ResourceKey;
  /** Column span in the 2-col form grid. */
  wide?: boolean;
  section?: string;
};

export type ResourceKey =
  | "services"
  | "service-categories"
  | "partners"
  | "solutions"
  | "industries"
  | "projects"
  | "training"
  | "testimonials"
  | "faqs"
  | "pages";

export type Resource = {
  key: ResourceKey;
  model: string; // Prisma delegate name
  label: string;
  singular: string;
  description: string;
  titleField: string;
  slugFrom?: string;
  searchFields: string[];
  columns: { field: string; label: string; kind?: "boolean" | "date" | "image" | "badge" }[];
  orderBy: Record<string, "asc" | "desc">[];
  fields: Field[];
  publicPath?: (row: Record<string, unknown>) => string | null;
  allowCreate?: boolean;
  allowDelete?: boolean;
};

const seo: Field[] = [
  { name: "metaTitle", label: "SEO title", type: "text", max: 70, section: "SEO", help: "Shown in search results. Aim for 50–60 characters." },
  { name: "metaDescription", label: "SEO description", type: "textarea", rows: 3, max: 170, section: "SEO", wide: true, help: "Aim for 140–160 characters." },
];

const publishing: Field[] = [
  { name: "order", label: "Display order", type: "number", help: "Lower numbers appear first." },
  { name: "published", label: "Published", type: "boolean" },
];

const partnerCategoryOptions = [
  { value: "NETWORKING", label: "Networking & Switching" },
  { value: "SECURITY", label: "Cybersecurity" },
  { value: "PHYSICAL_SECURITY", label: "Physical Security" },
  { value: "CABLING", label: "Structured Cabling" },
  { value: "STORAGE", label: "Data Centre & Storage" },
  { value: "CONNECTIVITY", label: "Connectivity & Internet Management" },
  { value: "CLOUD_PRODUCTIVITY", label: "Cloud & Productivity" },
  { value: "UNIFIED_COMMUNICATIONS", label: "Unified Communications" },
  { value: "OTHER", label: "Additional Platforms" },
];

export const resources: Record<ResourceKey, Resource> = {
  services: {
    key: "services",
    model: "service",
    label: "Services",
    singular: "Service",
    description: "Service pages, capabilities, platforms and related services.",
    titleField: "title",
    slugFrom: "title",
    searchFields: ["title", "shortDescription"],
    columns: [
      { field: "title", label: "Title" },
      { field: "order", label: "Order" },
      { field: "featured", label: "On homepage", kind: "boolean" },
      { field: "published", label: "Published", kind: "boolean" },
      { field: "updatedAt", label: "Updated", kind: "date" },
    ],
    orderBy: [{ order: "asc" }],
    publicPath: (r) => `/services/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 120 },
      { name: "slug", label: "URL slug", type: "slug", help: "Leave blank to generate from the title. Changing it changes the page URL." },
      { name: "icon", label: "Icon", type: "select", options: iconOptions },
      { name: "categoryId", label: "Category", type: "relation", relation: "service-categories" },
      { name: "shortDescription", label: "Short description", type: "textarea", rows: 2, required: true, max: 260, wide: true, help: "Used on cards and as the page summary." },
      { name: "intro", label: "Page introduction", type: "textarea", rows: 3, wide: true },
      { name: "body", label: "Detailed description", type: "textarea", rows: 6, wide: true, help: "Separate paragraphs with a blank line." },
      { name: "heroImageUrl", label: "Hero image", type: "image", wide: true },
      { name: "capabilities", label: "Capabilities", type: "list", wide: true, help: "One per line." },
      { name: "applications", label: "Business applications", type: "list", wide: true, help: "One per line." },
      { name: "benefits", label: "Benefits", type: "list", wide: true, help: "One per line." },
      { name: "partners", label: "Technology platforms", type: "relationMany", relation: "partners", wide: true },
      { name: "related", label: "Related services", type: "relationMany", relation: "services", wide: true },
      { name: "featured", label: "Show on homepage", type: "boolean" },
      ...publishing,
      ...seo,
    ],
  },
  "service-categories": {
    key: "service-categories",
    model: "serviceCategory",
    label: "Service categories",
    singular: "Service category",
    description: "Groupings used on the services page.",
    titleField: "name",
    slugFrom: "name",
    searchFields: ["name"],
    columns: [
      { field: "name", label: "Name" },
      { field: "order", label: "Order" },
    ],
    orderBy: [{ order: "asc" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 80 },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "order", label: "Display order", type: "number" },
    ],
  },
  partners: {
    key: "partners",
    model: "partner",
    label: "Technology partners",
    singular: "Partner",
    description: "OEM and technology brands shown on the site.",
    titleField: "name",
    slugFrom: "name",
    searchFields: ["name"],
    columns: [
      { field: "logoUrl", label: "Logo", kind: "image" },
      { field: "name", label: "Name" },
      { field: "category", label: "Category", kind: "badge" },
      { field: "published", label: "Published", kind: "boolean" },
    ],
    orderBy: [{ order: "asc" }],
    publicPath: () => "/partners",
    fields: [
      { name: "name", label: "Brand name", type: "text", required: true, max: 80 },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "category", label: "Category", type: "select", required: true, options: partnerCategoryOptions },
      { name: "websiteUrl", label: "Website", type: "url" },
      { name: "logoUrl", label: "Logo", type: "image", wide: true, help: "Use the brand's authentic logo (SVG or transparent PNG)." },
      { name: "description", label: "Description", type: "textarea", rows: 3, wide: true },
      {
        name: "statusNote",
        label: "Verified partner status",
        type: "text",
        wide: true,
        help: "Only fill this in when the status is formally confirmed, e.g. “Authorised Partner”. Leave blank otherwise.",
      },
      ...publishing,
    ],
  },
  solutions: {
    key: "solutions",
    model: "solution",
    label: "Business solutions",
    singular: "Solution",
    description: "Outcome-based packages combining services.",
    titleField: "title",
    slugFrom: "title",
    searchFields: ["title", "summary"],
    columns: [
      { field: "title", label: "Title" },
      { field: "order", label: "Order" },
      { field: "published", label: "Published", kind: "boolean" },
    ],
    orderBy: [{ order: "asc" }],
    publicPath: () => "/solutions",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 120 },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "icon", label: "Icon", type: "select", options: iconOptions },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true, max: 300, wide: true },
      { name: "body", label: "Details", type: "textarea", rows: 5, wide: true },
      { name: "services", label: "Services involved", type: "relationMany", relation: "services", wide: true },
      ...publishing,
    ],
  },
  industries: {
    key: "industries",
    model: "industry",
    label: "Industries",
    singular: "Industry",
    description: "Sectors served. Publish only sectors Favent Magna actually serves.",
    titleField: "name",
    slugFrom: "name",
    searchFields: ["name"],
    columns: [
      { field: "name", label: "Name" },
      { field: "order", label: "Order" },
      { field: "published", label: "Published", kind: "boolean" },
    ],
    orderBy: [{ order: "asc" }],
    publicPath: () => "/industries",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 80 },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "icon", label: "Icon", type: "select", options: iconOptions },
      { name: "summary", label: "Summary", type: "textarea", rows: 3, wide: true },
      ...publishing,
    ],
  },
  projects: {
    key: "projects",
    model: "project",
    label: "Projects & case studies",
    singular: "Project",
    description: "Portfolio. A project can only be published once it is marked verified.",
    titleField: "title",
    slugFrom: "title",
    searchFields: ["title", "client", "sector"],
    columns: [
      { field: "coverImageUrl", label: "Cover", kind: "image" },
      { field: "title", label: "Title" },
      { field: "sector", label: "Sector" },
      { field: "verified", label: "Verified", kind: "boolean" },
      { field: "published", label: "Published", kind: "boolean" },
    ],
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    publicPath: (r) => (r.published ? `/projects/${r.slug}` : null),
    fields: [
      { name: "title", label: "Project title", type: "text", required: true, max: 140 },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "client", label: "Client", type: "text", help: "Only name the client with their permission." },
      { name: "sector", label: "Sector", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "year", label: "Year", type: "number" },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true, max: 400, wide: true },
      { name: "challenge", label: "The challenge", type: "textarea", rows: 4, wide: true },
      { name: "solution", label: "Our solution", type: "textarea", rows: 4, wide: true },
      { name: "outcome", label: "The outcome", type: "textarea", rows: 4, wide: true },
      { name: "coverImageUrl", label: "Cover image", type: "image", wide: true },
      { name: "images", label: "Gallery", type: "gallery", wide: true },
      { name: "services", label: "Services delivered", type: "relationMany", relation: "services", wide: true },
      { name: "verified", label: "Verified project (details confirmed)", type: "boolean" },
      { name: "featured", label: "Feature on homepage", type: "boolean" },
      ...publishing,
      ...seo,
    ],
  },
  training: {
    key: "training",
    model: "trainingProgramme",
    label: "Training programmes",
    singular: "Training programme",
    description: "Courses shown on the training page.",
    titleField: "title",
    slugFrom: "title",
    searchFields: ["title", "summary"],
    columns: [
      { field: "title", label: "Title" },
      { field: "duration", label: "Duration" },
      { field: "published", label: "Published", kind: "boolean" },
    ],
    orderBy: [{ order: "asc" }],
    publicPath: (r) => `/training#${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 140 },
      { name: "slug", label: "Slug", type: "slug" },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, required: true, max: 400, wide: true },
      { name: "description", label: "Description", type: "textarea", rows: 5, wide: true },
      { name: "duration", label: "Duration", type: "text", placeholder: "e.g. 3 days" },
      { name: "deliveryMode", label: "Delivery mode", type: "text", placeholder: "e.g. On-site / Virtual" },
      { name: "audience", label: "Audience", type: "text", wide: true },
      { name: "outline", label: "Outline", type: "list", wide: true, help: "One module per line." },
      { name: "imageUrl", label: "Image", type: "image", wide: true },
      ...publishing,
      ...seo,
    ],
  },
  testimonials: {
    key: "testimonials",
    model: "testimonial",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Genuine client quotes only, published with permission.",
    titleField: "author",
    searchFields: ["author", "organisation", "quote"],
    columns: [
      { field: "author", label: "Author" },
      { field: "organisation", label: "Organisation" },
      { field: "published", label: "Published", kind: "boolean" },
    ],
    orderBy: [{ order: "asc" }],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", rows: 4, required: true, max: 800, wide: true },
      { name: "author", label: "Author", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "organisation", label: "Organisation", type: "text" },
      ...publishing,
    ],
  },
  faqs: {
    key: "faqs",
    model: "faq",
    label: "FAQs",
    singular: "FAQ",
    description: "Category “general” (or blank) shows on Contact; “training” shows on Training.",
    titleField: "question",
    searchFields: ["question", "answer"],
    columns: [
      { field: "question", label: "Question" },
      { field: "category", label: "Category", kind: "badge" },
      { field: "published", label: "Published", kind: "boolean" },
    ],
    orderBy: [{ order: "asc" }],
    fields: [
      { name: "question", label: "Question", type: "text", required: true, max: 240, wide: true },
      { name: "answer", label: "Answer", type: "textarea", rows: 5, required: true, max: 3000, wide: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "general", label: "General (Contact page)" },
          { value: "training", label: "Training" },
        ],
      },
      ...publishing,
    ],
  },
  pages: {
    key: "pages",
    model: "page",
    label: "Pages & SEO",
    singular: "Page",
    description: "Headings, introductions and search metadata for each fixed page.",
    titleField: "name",
    searchFields: ["name", "path"],
    columns: [
      { field: "name", label: "Page" },
      { field: "path", label: "URL" },
      { field: "noIndex", label: "Hidden from search", kind: "boolean" },
      { field: "updatedAt", label: "Updated", kind: "date" },
    ],
    orderBy: [{ path: "asc" }],
    publicPath: (r) => String(r.path),
    allowDelete: false,
    fields: [
      { name: "name", label: "Page name", type: "text", required: true },
      { name: "path", label: "URL path", type: "text", required: true, help: "Must match the site route, e.g. /about." },
      { name: "heading", label: "Page heading", type: "text", wide: true },
      { name: "intro", label: "Introduction", type: "textarea", rows: 3, wide: true },
      { name: "body", label: "Body content", type: "textarea", rows: 8, wide: true, help: "Used on About and Privacy. Separate paragraphs with a blank line." },
      { name: "metaTitle", label: "SEO title", type: "text", max: 70, section: "SEO" },
      { name: "metaDescription", label: "SEO description", type: "textarea", rows: 3, max: 170, wide: true, section: "SEO" },
      { name: "ogImageUrl", label: "Social share image", type: "image", wide: true, section: "SEO" },
      { name: "noIndex", label: "Hide from search engines", type: "boolean", section: "SEO" },
    ],
  },
};

export const resourceList = Object.values(resources);

export function getResource(key: string): Resource | undefined {
  return (resources as Record<string, Resource>)[key];
}

/** Site Settings form (singleton) — reuses the same field renderer. */
export const settingsFields: Field[] = [
  { name: "companyName", label: "Company name", type: "text", required: true, section: "Company" },
  { name: "tagline", label: "Tagline", type: "text", section: "Company" },
  { name: "logoUrl", label: "Logo (for light backgrounds)", type: "image", section: "Company" },
  { name: "logoDarkUrl", label: "Logo (for dark backgrounds)", type: "image", section: "Company" },
  { name: "profilePdfUrl", label: "Corporate profile (PDF)", type: "file", section: "Company", wide: true },
  { name: "aboutBody", label: "About text (fallback for About page)", type: "textarea", rows: 6, wide: true, section: "Company" },
  { name: "mission", label: "Mission", type: "textarea", rows: 3, section: "Company" },
  { name: "vision", label: "Vision", type: "textarea", rows: 3, section: "Company" },

  { name: "heroEyebrow", label: "Hero eyebrow", type: "text", section: "Homepage" },
  { name: "heroHeadline", label: "Hero headline", type: "text", required: true, section: "Homepage", wide: true, help: "The last word is highlighted in lime." },
  { name: "heroSubtext", label: "Hero supporting copy", type: "textarea", rows: 2, required: true, wide: true, section: "Homepage" },
  { name: "heroPrimaryCta", label: "Primary button", type: "text", section: "Homepage" },
  { name: "heroSecondaryCta", label: "Secondary button", type: "text", section: "Homepage" },
  { name: "introHeading", label: "Introduction heading", type: "text", wide: true, section: "Homepage" },
  { name: "introBody", label: "Introduction text", type: "textarea", rows: 5, wide: true, section: "Homepage" },
  { name: "whyItems", label: "Why choose us", type: "list", wide: true, section: "Homepage", help: "One per line: Title | Description" },
  { name: "approachSteps", label: "Delivery approach steps", type: "list", wide: true, section: "Homepage", help: "One per line: Title | Description" },
  { name: "ctaHeading", label: "Consultation CTA heading", type: "text", wide: true, section: "Homepage" },
  { name: "ctaBody", label: "Consultation CTA text", type: "textarea", rows: 2, wide: true, section: "Homepage" },

  { name: "address", label: "Office address", type: "textarea", rows: 3, wide: true, section: "Contact" },
  { name: "phone", label: "Phone", type: "text", placeholder: "+234 …", section: "Contact" },
  { name: "phoneAlt", label: "Alternative phone", type: "text", section: "Contact" },
  { name: "whatsapp", label: "WhatsApp number", type: "text", placeholder: "2348012345678", help: "International format, digits only.", section: "Contact" },
  { name: "email", label: "Email", type: "email", section: "Contact" },
  { name: "businessHours", label: "Business hours", type: "text", wide: true, section: "Contact" },
  { name: "mapEmbedUrl", label: "Google Maps embed URL", type: "url", wide: true, section: "Contact" },
  { name: "linkedinUrl", label: "LinkedIn", type: "url", section: "Social" },
  { name: "facebookUrl", label: "Facebook", type: "url", section: "Social" },
  { name: "instagramUrl", label: "Instagram", type: "url", section: "Social" },
  { name: "xUrl", label: "X (Twitter)", type: "url", section: "Social" },

  { name: "defaultMetaTitle", label: "Default SEO title", type: "text", max: 70, section: "SEO", wide: true },
  { name: "defaultMetaDesc", label: "Default SEO description", type: "textarea", rows: 3, max: 170, wide: true, section: "SEO" },
  { name: "ogImageUrl", label: "Default social share image", type: "image", wide: true, section: "SEO" },
];
