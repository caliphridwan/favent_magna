import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/site/PageHero";

export const metadata = { title: "Unsubscribe", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams;
  let ok = false;
  if (token && /^[a-z0-9]{20,40}$/i.test(token)) {
    const res = await prisma.newsletterSubscriber.updateMany({ where: { unsubscribeToken: token }, data: { status: "UNSUBSCRIBED" } });
    ok = res.count > 0;
  }
  return (
    <>
      <PageHero title={ok ? "You've been unsubscribed" : "Link not valid"} intro={ok ? "You won't receive any more newsletters from us." : "This unsubscribe link is invalid or has already been used."} />
      <div className="container py-16">
        <Link href="/" className="btn btn-ink">
          Back to home
        </Link>
      </div>
    </>
  );
}
