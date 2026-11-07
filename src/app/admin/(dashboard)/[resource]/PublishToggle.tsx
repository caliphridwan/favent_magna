"use client";

import { useOptimistic, useTransition } from "react";
import { togglePublished } from "@/actions/admin/resources";
import { cn } from "@/lib/utils";

export function PublishToggle({ resourceKey, id, published }: { resourceKey: string; id: string; published: boolean }) {
  const [pending, start] = useTransition();
  const [value, setValue] = useOptimistic(published);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={value ? "Published — click to unpublish" : "Draft — click to publish"}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setValue(!value);
          try {
            await togglePublished(resourceKey, id, !value);
          } catch (e) {
            window.alert(e instanceof Error ? e.message : "Could not update");
          }
        })
      }
      className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", value ? "bg-lime" : "bg-[#D4DAD0]")}
    >
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", value ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  );
}
