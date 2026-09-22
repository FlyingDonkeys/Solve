import type { ReactNode } from "react";

interface StatePanelProps {
  icon: ReactNode;
  label: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function StatePanel({ icon, label, title, description, children }: StatePanelProps) {
  return (
    <main className="page-container flex flex-1 items-center justify-center py-16 sm:py-24">
      <section className="surface-panel w-full max-w-lg p-7 text-center sm:p-12">
        <div aria-hidden="true" className="mx-auto mb-6 flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-accent-foreground">
          {icon}
        </div>
        <p className="eyebrow mb-3">{label}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-col items-center gap-4">{children}</div>
      </section>
    </main>
  );
}
