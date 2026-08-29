import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SolutionCollapsibleProps {
  triggerText: string;
  contentText: string;
}

export function SolutionCollapsible({ triggerText, contentText }: SolutionCollapsibleProps) {
  return (
    <Collapsible className="rounded-md bg-neutral-800">
      <CollapsibleTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "p-4 justify-between text-xs font-semibold uppercase text-neutral-400 hover:bg-neutral-700 hover:text-white")}
      >
        {triggerText}
      </CollapsibleTrigger>

      <CollapsibleContent
        className="p-4 whitespace-pre-line text-base"
      >
        <Latex>
          {contentText}
        </Latex>
      </CollapsibleContent>
    </Collapsible>
  )
}
