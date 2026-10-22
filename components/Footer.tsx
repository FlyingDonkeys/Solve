import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-background">
      <div className="page-container flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
        <p className="text-sm text-muted-foreground">Solve · H2 Mathematics practice</p>
        <nav aria-label="Footer navigation" className="flex items-center gap-1">
          <Link href="/privacy" className={buttonVariants({ variant: "ghost", className: "min-h-11 text-muted-foreground" })}>
            Privacy policy
          </Link>
          <a href="https://t.me/FlyingDonkey1" target="_blank" rel="noopener noreferrer"
            aria-label="Contact Solve (opens in a new tab)"
            className={buttonVariants({ variant: "ghost", className: "min-h-11 text-muted-foreground" })}>
            Contact
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
