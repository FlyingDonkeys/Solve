"use client";

import { FileWarning } from "lucide-react";
import { StatePanel } from "@/components/elements/StatePanel";
import { buttonVariants } from "@/components/ui/button";

export default function ResourcesError({ retry }: { retry: () => void }) {
  return (
    <StatePanel icon={<FileWarning className="size-5" />} label="Practice papers" title="The resources couldn’t load." description="Please try again in a moment.">
      <button type="button" onClick={retry} className={buttonVariants({ variant: "outline" })}>Try again</button>
    </StatePanel>
  );
}
