"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { enquirySchema, newsletterSchema, type ActionState, type EnquiryInput, type NewsletterInput } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { sendEnquiryNotifications, sendNewsletterWelcome } from "@/lib/email";

async function clientInfo() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return { ip, userAgent: h.get("user-agent")?.slice(0, 300) || undefined };
}

export async function submitEnquiry(input: EnquiryInput): Promise<ActionState> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  // Honeypot filled → pretend success, store nothing.
  if (data.website) return { ok: true, message: "Thank you — your enquiry has been received." };

  const { ip, userAgent } = await clientInfo();
  if (!rateLimit(`enquiry:${ip}`, 5, 10 * 60 * 1000).ok) {
    return { ok: false, message: "Too many submissions. Please try again in a few minutes." };
  }

  try {
    const [service, training] = await Promise.all([
      data.serviceId ? prisma.service.findUnique({ where: { id: data.serviceId }, select: { id: true, title: true } }) : null,
      data.trainingId ? prisma.trainingProgramme.findUnique({ where: { id: data.trainingId }, select: { id: true, title: true } }) : null,
    ]);

    const enquiry = await prisma.enquiry.create({
      data: {
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        organisation: data.organisation,
        subject: data.subject,
        message: data.message,
        preferredDate: data.preferredDate,
        sourcePath: data.sourcePath,
        serviceId: service?.id,
        trainingId: training?.id,
        ipAddress: ip,
        userAgent,
      },
    });

    // Email failures never block the enquiry being saved.
    await sendEnquiryNotifications({
      ...enquiry,
      serviceTitle: service?.title,
      trainingTitle: training?.title,
    });

    return { ok: true, message: "Thank you — your enquiry has been received. Our team will be in touch shortly." };
  } catch (e) {
    console.error("[enquiry] failed", e);
    return { ok: false, message: "Something went wrong sending your enquiry. Please try again or contact us directly." };
  }
}

export async function subscribeNewsletter(input: NewsletterInput): Promise<ActionState> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid email" };
  if (parsed.data.website) return { ok: true, message: "You're subscribed." };

  const { ip } = await clientInfo();
  if (!rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000).ok) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: parsed.data.email } });
    if (existing?.status === "ACTIVE") return { ok: true, message: "You're already subscribed — thank you!" };
    const sub = existing
      ? await prisma.newsletterSubscriber.update({ where: { id: existing.id }, data: { status: "ACTIVE" } })
      : await prisma.newsletterSubscriber.create({ data: { email: parsed.data.email, source: "website" } });
    await sendNewsletterWelcome(sub.email, sub.unsubscribeToken);
    return { ok: true, message: "You're subscribed. Welcome aboard!" };
  } catch (e) {
    console.error("[newsletter] failed", e);
    return { ok: false, message: "We couldn't subscribe you just now. Please try again." };
  }
}
