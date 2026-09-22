"use client";

import { useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { StatePanel } from "@/components/elements/StatePanel";
import { buttonVariants } from "@/components/ui/button";

export function ErrorPage({ error, retry }: {
  error?: Error & { digest?: string };
  retry?: () => void;
}) {
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <StatePanel icon={<CircleAlert className="size-5" />} label="Something went wrong" title="Let’s try that again." description="We couldn’t load this page. Please try again, or head back home.">
      {retry && <button type="button" onClick={retry} className={buttonVariants({ size: "lg", className: "w-full" })}>Try again</button>}
      {/* Full navigation also works when the app router has failed. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}>Back to home</a>
      {error?.digest && <p className="max-w-full break-words text-xs text-muted-foreground">Error reference: {error.digest}</p>}
    </StatePanel>
  );
}
