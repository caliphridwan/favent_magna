import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center text-white">
      <p className="eyebrow text-lime">404</p>
      <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-tightest">Page not found</h1>
      <p className="max-w-md text-muted-dark">The page you&apos;re looking for has moved or no longer exists.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-lime">
          Go to homepage
        </Link>
        <Link href="/services" className="btn btn-ghost-dark">
          View services
        </Link>
      </div>
    </main>
  );
}
