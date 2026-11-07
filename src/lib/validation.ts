import { z } from "zod";

const optionalText = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

export const phoneRegex = /^[+\d][\d\s()-]{6,19}$/;

export const enquirySchema = z.object({
  type: z.enum(["CONTACT", "CONSULTATION", "SERVICE", "TRAINING"]).default("CONTACT"),
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || phoneRegex.test(v), "Please enter a valid phone number")
    .transform((v) => (v ? v : undefined)),
  organisation: optionalText(160),
  subject: optionalText(200),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)").max(5000),
  preferredDate: optionalText(60),
  serviceId: optionalText(40),
  trainingId: optionalText(40),
  sourcePath: optionalText(300),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree so we can respond to your enquiry" }) }),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().or(z.literal("")),
});
export type EnquiryInput = z.input<typeof enquirySchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(160),
  website: z.string().max(0).optional().or(z.literal("")),
});
export type NewsletterInput = z.input<typeof newsletterSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password").max(200),
});

export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters")
  .max(200)
  .regex(/[a-z]/, "Include a lowercase letter")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number");

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
