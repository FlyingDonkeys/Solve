import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"

interface SolutionCollapsibleProps {
  triggerText: string;
  contentText: string;
}

export function SolutionCollapsible({ triggerText, contentText }: SolutionCollapsibleProps) {
  return (
    <Collapsible className="rounded-md bg-neutral-800">
      <CollapsibleTrigger
        render={
          <Button variant="ghost" className="w-full text-xs font-semibold uppercase text-neutral-400">
            { triggerText }
            <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
          </Button>}
      />

      <CollapsibleContent
        className="p-4 whitespace-pre-line text-lg"
      >
        <Latex>
          {contentText}
        </Latex>
      </CollapsibleContent>
    </Collapsible>
  )
}
