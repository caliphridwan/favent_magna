"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FileText, ImagePlus, Loader2, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

async function upload(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

export function ImageField({ name, defaultValue, accept = "image/*", kind = "image" }: { name: string; defaultValue?: string | null; accept?: string; kind?: "image" | "file" }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const onFile = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setError(null);
    try {
      setUrl(await upload(f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex h-24 w-36 items-center justify-center overflow-hidden rounded-xl border border-line bg-mist">
          {url && kind === "image" ? (
            <Image src={url} alt="" fill sizes="144px" className="object-contain p-1" unoptimized={!url.includes("res.cloudinary.com")} />
          ) : url ? (
            <FileText className="h-8 w-8 text-muted" aria-hidden />
          ) : (
            <ImagePlus className="h-7 w-7 text-muted" aria-hidden />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => input.current?.click()} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium hover:border-ink">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
            {url ? "Replace" : "Upload"}
          </button>
          {url ? (
            <button type="button" onClick={() => setUrl("")} className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" aria-hidden /> Remove
            </button>
          ) : null}
        </div>
        <input ref={input} type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="…or paste an image URL"
        aria-label="Image URL"
        className="block w-full rounded-lg border border-line px-3 py-2 text-xs text-muted focus:border-lime focus:outline-none"
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

type GalleryItem = { url: string; alt?: string | null };

export function GalleryField({ name, defaultValue }: { name: string; defaultValue?: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(defaultValue ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const urls = [];
      for (const f of Array.from(files)) urls.push(await upload(f));
      setItems((prev) => [...prev, ...urls.map((url) => ({ url, alt: "" }))]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const move = (i: number, d: number) =>
    setItems((prev) => {
      const next = [...prev];
      const j = i + d;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      {items.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={`${it.url}-${i}`} className="space-y-2 rounded-xl border border-line p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-mist">
                <Image src={it.url} alt={it.alt || ""} fill sizes="240px" className="object-cover" unoptimized={!it.url.includes("res.cloudinary.com")} />
              </div>
              <input
                value={it.alt ?? ""}
                onChange={(e) => setItems((prev) => prev.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))}
                placeholder="Alt text (describe the image)"
                aria-label={`Alt text for image ${i + 1}`}
                className="block w-full rounded-lg border border-line px-3 py-2 text-sm"
              />
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} className="rounded p-2 hover:bg-mist" aria-label="Move earlier">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} className="rounded p-2 hover:bg-mist" aria-label="Move later">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <button type="button" onClick={() => setItems((prev) => prev.filter((_, k) => k !== i))} className="rounded p-2 text-red-700 hover:bg-red-50" aria-label="Remove image">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <button type="button" onClick={() => input.current?.click()} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-line bg-white px-4 text-sm font-medium hover:border-ink">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ImagePlus className="h-4 w-4" aria-hidden />} Add images
      </button>
      <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

export function MultiCheck({ name, options, defaultValue }: { name: string; options: { value: string; label: string }[]; defaultValue?: string[] }) {
  const [q, setQ] = useState("");
  const selected = new Set(defaultValue ?? []);
  const shown = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="rounded-xl border border-line">
      {options.length > 8 ? (
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" aria-label="Filter options" className="block w-full rounded-t-xl border-b border-line px-3 py-2 text-sm focus:outline-none" />
      ) : null}
      <div className="grid max-h-64 gap-1 overflow-y-auto p-3 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className={cn("flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-mist", !shown.includes(o) && "hidden")}>
            <input type="checkbox" name={name} value={o.value} defaultChecked={selected.has(o.value)} className="h-4 w-4 accent-lime" />
            {o.label}
          </label>
        ))}
        {!options.length ? <p className="text-sm text-muted">Nothing to choose yet.</p> : null}
      </div>
    </div>
  );
}
