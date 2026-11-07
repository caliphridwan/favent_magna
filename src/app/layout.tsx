import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/site";
import { siteUrl } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s.companyName;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.defaultMetaTitle || name, template: `%s | ${name}` },
    description: s.defaultMetaDesc || undefined,
    applicationName: name,
    icons: { icon: "/favicon.svg" },
    formatDetection: { telephone: true, email: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
