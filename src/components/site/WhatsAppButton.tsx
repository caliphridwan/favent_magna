import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/utils";

export function WhatsAppButton({ number }: { number?: string | null }) {
  const href = whatsappHref(number);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Favent Magna on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-lime text-ink shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}
