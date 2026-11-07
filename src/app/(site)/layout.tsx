import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { JsonLd } from "@/components/site/JsonLd";
import { ScrollProgress } from "@/components/site/motion/ScrollProgress";
import { BackToTop, SpotlightEffect } from "@/components/site/motion/Effects";
import { getNavServices, getSettings } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, org] = await Promise.all([getSettings(), getNavServices(), organizationJsonLd()]);
  return (
    <>
      <JsonLd data={org} />
      <ScrollProgress />
      <SpotlightEffect />
      <Header services={services} logoUrl={settings.logoDarkUrl || settings.logoUrl} companyName={settings.companyName} />
      <main id="main">{children}</main>
      <Footer settings={settings} services={services} />
      <WhatsAppButton number={settings.whatsapp} />
      <BackToTop />
    </>
  );
}
