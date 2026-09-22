"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Sigma } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center justify-between gap-3">
        <Link href="/" aria-label="Solve home" className="flex shrink-0 items-center gap-2.5 rounded-md text-xl font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-accent-foreground">
            <Sigma aria-hidden="true" className="size-5" />
          </span>
          Solve
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          {[{ href: "/", label: "Home" }, { href: "/questions", label: "Problems" }].map(({ href, label }) => {
            const active = href === "/" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined}
                className={cn("inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors", active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}>
                {label}
              </Link>
            );
          })}
          <a href="https://t.me/FlyingDonkey1" target="_blank" rel="noopener noreferrer" aria-label="Contact us (opens in a new tab)"
            className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
            <span className="hidden sm:inline">Contact</span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
