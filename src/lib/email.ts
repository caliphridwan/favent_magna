import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || "Favent Magna <no-reply@faventmagna.com>";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#F5F7F4;font-family:Arial,Helvetica,sans-serif;color:#050505">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
  <tr><td style="background:#050505;padding:24px 32px;color:#ffffff;font-weight:bold;letter-spacing:2px">FAVENT <span style="color:#80C83F">MAGNA</span></td></tr>
  <tr><td style="padding:32px"><h1 style="margin:0 0 16px;font-size:22px">${esc(title)}</h1>${body}</td></tr>
  <tr><td style="padding:20px 32px;background:#F5F7F4;font-size:12px;color:#4B5049">Favent Magna Nigeria Limited · faventmagna.com</td></tr>
  </table></td></tr></table></body></html>`;
}

async function send(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${opts.subject}"`);
    return { skipped: true };
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, ...opts });
    if (error) console.error("[email] Resend error:", error);
    return { error };
  } catch (e) {
    console.error("[email] send failed:", e);
    return { error: e };
  }
}

type EnquiryMail = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  organisation?: string | null;
  subject?: string | null;
  message: string;
  serviceTitle?: string | null;
  trainingTitle?: string | null;
};

export async function sendEnquiryNotifications(e: EnquiryMail) {
  const notify = (process.env.ENQUIRY_NOTIFY_EMAIL || "").split(",").map((s) => s.trim()).filter(Boolean);
  const rows = [
    ["Type", e.type],
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone],
    ["Organisation", e.organisation],
    ["Service", e.serviceTitle],
    ["Training", e.trainingTitle],
    ["Subject", e.subject],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#4B5049;font-size:14px">${k}</td><td style="padding:6px 0;font-size:14px"><strong>${esc(String(v))}</strong></td></tr>`)
    .join("");
  const admin = `${process.env.NEXT_PUBLIC_SITE_URL || "https://faventmagna.com"}/admin/enquiries/${e.id}`;

  const jobs: Promise<unknown>[] = [];
  if (notify.length) {
    jobs.push(
      send({
        to: notify,
        replyTo: e.email,
        subject: `New ${e.type.toLowerCase()} enquiry — ${e.name}${e.organisation ? ` (${e.organisation})` : ""}`,
        html: layout(
          "New website enquiry",
          `<table cellpadding="0" cellspacing="0">${rows}</table>
           <p style="margin:20px 0 8px;color:#4B5049;font-size:14px">Message</p>
           <div style="white-space:pre-wrap;font-size:15px;line-height:1.6;background:#F5F7F4;padding:16px;border-radius:10px">${esc(e.message)}</div>
           <p style="margin-top:24px"><a href="${admin}" style="background:#80C83F;color:#050505;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Open in dashboard</a></p>`
        ),
      })
    );
  }
  jobs.push(
    send({
      to: e.email,
      subject: "We've received your enquiry — Favent Magna",
      html: layout(
        `Thank you, ${e.name.split(" ")[0]}`,
        `<p style="font-size:15px;line-height:1.7">We've received your enquiry and a member of our team will be in touch.</p>
         <p style="font-size:15px;line-height:1.7;color:#4B5049">For reference, here is what you sent:</p>
         <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;background:#F5F7F4;padding:16px;border-radius:10px">${esc(e.message)}</div>`
      ),
    })
  );
  await Promise.allSettled(jobs);
}

export async function sendNewsletterWelcome(email: string, unsubscribeToken: string) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://faventmagna.com"}/newsletter/unsubscribe?token=${unsubscribeToken}`;
  await send({
    to: email,
    subject: "You're subscribed to Favent Magna updates",
    html: layout(
      "Thanks for subscribing",
      `<p style="font-size:15px;line-height:1.7">You'll receive technology updates and insights from the Favent Magna team.</p>
       <p style="font-size:13px;color:#4B5049">Changed your mind? <a href="${url}" style="color:#050505">Unsubscribe</a>.</p>`
    ),
  });
}
