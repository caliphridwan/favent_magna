import { getPage, getSettings } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const revalidate = 3600;
export const generateMetadata = () => pageMetadata("/privacy", "Privacy Notice");

/** Editable in Admin → Pages & SEO (path "/privacy", Body field). Have the final wording reviewed for NDPA compliance. */
export default async function PrivacyPage() {
  const [page, s] = await Promise.all([getPage("/privacy"), getSettings()]);
  const body =
    page?.body ||
    `${s.companyName} collects the details you submit through this website's forms (such as your name, email address, phone number, organisation and message) so that we can respond to your enquiry or send you newsletters you have subscribed to.\n\nWe do not sell your information. You can ask us to access, correct or delete your details at any time${s.email ? ` by emailing ${s.email}` : " by contacting us"}. You can unsubscribe from newsletters using the link in any email.`;
  return (
    <>
      <PageHero title={page?.heading || "Privacy Notice"} crumbs={[{ name: "Privacy" }]} />
      <section className="bg-white">
        <div className="container max-w-3xl py-20">
          <div className="prose-fm">
            {body.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
