"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Copy, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { deleteMedia, updateMediaAlt } from "@/actions/admin/manage";

type Item = { id: string; url: string; alt: string | null; format: string | null; width: number | null; height: number | null; bytes: number | null };

export function MediaGrid({ items }: { items: Item[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", f);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="btn btn-lime h-11 px-5 text-sm">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />} Upload files
        </button>
        <span className="text-sm text-muted">JPG, PNG, WebP, AVIF, SVG or PDF · max 10 MB</span>
        <input ref={input} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => onFiles(e.target.files)} />
      </div>
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {items.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => {
            const isPdf = m.format === "pdf" || m.url.includes("/raw/");
            return (
              <li key={m.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-[4/3] bg-mist">
                  {isPdf ? (
                    <FileText className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-muted" aria-hidden />
                  ) : (
                    <Image src={m.url} alt={m.alt || ""} fill sizes="300px" className="object-contain p-2" />
                  )}
                </div>
                <div className="space-y-2 p-3">
                  <input
                    defaultValue={m.alt ?? ""}
                    placeholder="Alt text"
                    aria-label="Alt text"
                    onBlur={(e) => e.target.value !== (m.alt ?? "") && start(() => updateMediaAlt(m.id, e.target.value))}
                    className="block w-full rounded-lg border border-line px-2.5 py-1.5 text-sm"
                  />
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>
                      {m.width && m.height ? `${m.width}×${m.height}` : m.format?.toUpperCase()} {m.bytes ? `· ${Math.round(m.bytes / 1024)} KB` : ""}
                    </span>
                    <span className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(m.url);
                          setCopied(m.id);
                          setTimeout(() => setCopied(null), 1500);
                        }}
                        className="rounded p-1.5 hover:bg-mist"
                        aria-label="Copy URL"
                      >
                        {copied === m.id ? "Copied" : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => window.confirm("Delete this file? Pages using it will lose the image.") && start(() => deleteMedia(m.id))}
                        className="rounded p-1.5 text-red-700 hover:bg-red-50"
                        aria-label="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-12 text-center text-sm text-muted">No files yet.</p>
      )}
    </div>
  );
}
