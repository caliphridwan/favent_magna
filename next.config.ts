import type { NextConfig } from "next";
import { legacyRedirects } from "./redirects.config";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Force the canonical apex domain (www → faventmagna.com)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.faventmagna.com" }],
        destination: "https://faventmagna.com/:path*",
        permanent: true,
      },
      ...legacyRedirects.map((r) => ({ source: r.from, destination: r.to, permanent: true })),
    ];
  },
};

export default nextConfig;
