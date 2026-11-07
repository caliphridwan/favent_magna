"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  Home,
  FileText,
  Wrench,
  FolderTree,
  Layers,
  Handshake,
  Building2,
  Briefcase,
  GraduationCap,
  Quote,
  HelpCircle,
  Image as ImageIcon,
  Mail,
  Settings,
  Users,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Permission } from "@/lib/auth/permissions";

const items: { href: string; label: string; Icon: typeof Inbox; perm: Permission; badge?: "new" }[] = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, perm: "dashboard:view" },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Inbox, perm: "enquiries:view", badge: "new" },
  { href: "/admin/settings", label: "Homepage & settings", Icon: Home, perm: "settings:manage" },
  { href: "/admin/pages", label: "Pages & SEO", Icon: FileText, perm: "content:manage" },
  { href: "/admin/services", label: "Services", Icon: Wrench, perm: "content:manage" },
  { href: "/admin/service-categories", label: "Service categories", Icon: FolderTree, perm: "content:manage" },
  { href: "/admin/solutions", label: "Solutions", Icon: Layers, perm: "content:manage" },
  { href: "/admin/partners", label: "Partners", Icon: Handshake, perm: "content:manage" },
  { href: "/admin/industries", label: "Industries", Icon: Building2, perm: "content:manage" },
  { href: "/admin/projects", label: "Projects", Icon: Briefcase, perm: "content:manage" },
  { href: "/admin/training", label: "Training", Icon: GraduationCap, perm: "content:manage" },
  { href: "/admin/testimonials", label: "Testimonials", Icon: Quote, perm: "content:manage" },
  { href: "/admin/faqs", label: "FAQs", Icon: HelpCircle, perm: "content:manage" },
  { href: "/admin/media", label: "Media library", Icon: ImageIcon, perm: "media:manage" },
  { href: "/admin/newsletter", label: "Newsletter", Icon: Mail, perm: "enquiries:view" },
  { href: "/admin/users", label: "Administrators", Icon: Users, perm: "admins:manage" },
  { href: "/admin/account", label: "My account", Icon: Settings, perm: "dashboard:view" },
];

export function Sidebar({ permissions, newCount }: { permissions: Permission[]; newCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const allowed = items.filter((i) => permissions.includes(i.perm));
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      <div className="flex items-center justify-between bg-ink px-4 py-3 text-white lg:hidden">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-[0.04em]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-xs font-bold text-ink">FM</span> ADMIN
        </span>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} className="rounded-lg p-2 hover:bg-charcoal">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <aside className={cn("w-full shrink-0 bg-ink text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col", open ? "block" : "hidden lg:flex")}>
        <div className="hidden items-center gap-2.5 px-6 py-6 lg:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-xs font-bold text-ink">FM</span>
          <span className="text-sm font-semibold tracking-[0.04em]">FAVENT MAGNA</span>
        </div>
        <nav aria-label="Admin" className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {allowed.map(({ href, label, Icon, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors", active(href) ? "bg-charcoal text-white" : "text-[#C4C4C4] hover:bg-charcoal/60 hover:text-white")}
            >
              <Icon className={cn("h-4 w-4", active(href) && "text-lime")} aria-hidden />
              <span className="flex-1">{label}</span>
              {badge && newCount > 0 ? <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-semibold text-ink">{newCount}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="border-t border-charcoal p-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#C4C4C4] hover:bg-charcoal hover:text-white">
            <ExternalLink className="h-4 w-4" aria-hidden /> View website
          </a>
        </div>
      </aside>
    </>
  );
}
