"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-ink px-6 text-center text-white">
      <p className="eyebrow text-lime">Something went wrong</p>
      <h1 className="text-4xl font-semibold tracking-tight">We couldn&apos;t load this page</h1>
      <p className="max-w-md text-muted-dark">Please try again. If the problem continues, contact us directly.</p>
      <button type="button" onClick={reset} className="btn btn-lime">
        Try again
      </button>
    </main>
  );
}
