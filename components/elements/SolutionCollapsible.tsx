"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SolutionCollapsibleProps {
  contentText: string;
}

export function SolutionCollapsible({ contentText }: SolutionCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-xl border border-border bg-muted/30">
      <CollapsibleTrigger className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
        {isOpen ? "Hide solution" : "Show solution"}
        <ChevronDown aria-hidden="true" className={`size-4 shrink-0 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="math-content whitespace-pre-line border-t border-border p-4 sm:p-5">
          <Latex>{contentText}</Latex>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
