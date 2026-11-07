import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  return (
    <main className="grid min-h-screen bg-ink text-white lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <div className="bg-grid-dark absolute inset-0" aria-hidden />
        <div className="relative flex h-full flex-col justify-between p-14">
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime font-bold text-ink">FM</span>
            <span className="font-semibold tracking-[0.04em]">FAVENT MAGNA</span>
          </span>
          <p className="max-w-md text-4xl font-semibold leading-tight tracking-[-0.03em]">
            Website administration. <span className="text-lime">Content, enquiries and SEO</span> in one place.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <p className="eyebrow text-lime">Admin</p>
            <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
          </div>
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
