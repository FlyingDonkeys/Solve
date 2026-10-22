"use client";

import { useRef, useState } from "react";
import { Download, ExternalLink, FileText, LoaderCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { PracticeResource } from "@/lib/resources";

export function ResourceCard({ resource }: { resource: PracticeResource }) {
  const [pending, setPending] = useState<"view_requested" | "download_requested" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  async function accessResource(eventType: "view_requested" | "download_requested") {
    if (busy.current) return;
    busy.current = true;
    setPending(eventType);
    setError(null);

    // Open synchronously so browsers don't block the new tab after the POST.
    const tab = eventType === "view_requested" ? window.open("about:blank", "_blank") : null;
    if (tab) tab.opener = null;
    try {
      const response = await fetch("/api/resources/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource_path: resource.path, event_type: eventType }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to open this resource. Please try again.");
      if (tab && !tab.closed) {
        tab.location.replace(result.url);
      } else {
        // Signed download URLs set Content-Disposition; the app stays open.
        // If a view popup was blocked, open the PDF in the current tab instead.
        window.location.assign(result.url);
      }
    } catch (cause) {
      tab?.close();
      setError(cause instanceof Error ? cause.message : "Unable to open this resource. Please try again.");
    } finally {
      busy.current = false;
      setPending(null);
    }
  }

  return (
    <article className="surface-panel flex min-w-0 flex-col p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="rounded-xl bg-accent p-3 text-accent-foreground"><FileText aria-hidden="true" className="size-5" /></div>
      </div>
      <h2 className="break-words text-lg font-semibold tracking-tight">{resource.name.replace(/\.pdf$/i, "")}</h2>
      <div className="mt-auto flex flex-wrap gap-2 pt-6" aria-busy={pending !== null}>
        <button type="button" disabled={pending !== null} onClick={() => void accessResource("view_requested")} aria-label={`View ${resource.name} (opens in a new tab)`} className={buttonVariants({ className: "min-h-11 flex-1 gap-2" })}>
          {pending === "view_requested" ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <ExternalLink aria-hidden="true" className="size-4" />}View
        </button>
        <button type="button" disabled={pending !== null} onClick={() => void accessResource("download_requested")} aria-label={`Download ${resource.name}`} className={buttonVariants({ variant: "outline", className: "min-h-11 flex-1 gap-2" })}>
          {pending === "download_requested" ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Download aria-hidden="true" className="size-4" />}Download
        </button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm leading-6 text-destructive">{error}</p>}
    </article>
  );
}
