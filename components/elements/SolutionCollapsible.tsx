import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {useState} from "react";

interface SolutionCollapsibleProps {
  contentText: string;
}

export function SolutionCollapsible({ contentText }: SolutionCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible className="rounded-md bg-neutral-800">
      <CollapsibleTrigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "p-4 justify-between text-xs font-semibold uppercase text-neutral-400 hover:bg-neutral-700 hover:text-white")}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Hide Solution" : "Show Solution"}
      </CollapsibleTrigger>

      { isOpen && (
        <CollapsibleContent
          className="p-4 whitespace-pre-line text-base"
        >
          <Latex>
            {contentText}
          </Latex>
        </CollapsibleContent>)
      }
    </Collapsible>
  )
}
