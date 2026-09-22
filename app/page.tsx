import Link from "next/link";
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { buttonVariants } from "@/components/ui/button";

const features = [
  { icon: Layers, title: "Find your focus", description: "Choose a subtopic and spend your time on the areas that need a little more practice." },
  { icon: BookOpen, title: "Read with clarity", description: "Clear mathematical notation makes every question easy to follow, on any screen." },
  { icon: CheckCircle2, title: "Check your thinking", description: "Work through each problem at your own pace, then reveal the step-by-step solution." },
];

export default function Home() {
  return (
    <main className="page-container pb-16 sm:pb-24">
      <section className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent-foreground" aria-hidden="true" />
            H2 Mathematics · Question bank
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            A little practice.<br /><span className="text-accent-foreground">A clearer mind.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground">
            Build confidence one problem at a time. Explore curated past-year questions, focus on a subtopic, and learn from every solution.
          </p>
          <Link href="/questions" className={buttonVariants({ size: "lg", className: "mt-8 h-12 gap-3 px-6" })}>
            Browse problems <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">Sign in with Google to start practising.</p>
        </div>

        <div className="surface-panel min-w-0 overflow-hidden shadow-xl shadow-black/10">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
            <p className="eyebrow">A taste of the practice</p>
            <BookOpen aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          </div>
          <div className="space-y-6 p-5 sm:p-7">
            <div className="flex flex-wrap gap-2">
              <span className="meta-badge">H2 Mathematics</span>
              <span className="rounded-md border border-accent-foreground/20 bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">Inequalities</span>
            </div>
            <div className="math-content py-5">
              <p className="mb-4 text-sm text-muted-foreground">Solve the inequality</p>
              <Latex>{"$$x + 1 > \\frac{1}{x - 1}$$"}</Latex>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
              <CheckCircle2 aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent-foreground" />
              Try it yourself first. Reveal the solution when you’re ready to check your working.
            </div>
          </div>
          <Link href="/questions" className="flex min-h-14 items-center justify-between gap-3 border-t border-border px-5 py-4 text-sm font-medium transition-colors hover:bg-muted/50 sm:px-7">
            Explore the question bank <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="practice-heading" className="border-t border-border pt-10 sm:pt-12">
        <p className="eyebrow">Make each session count</p>
        <h2 id="practice-heading" className="mt-3 text-2xl font-semibold tracking-tight">Less searching. More solving.</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="surface-panel p-6">
              <Icon aria-hidden="true" className="mb-5 size-5 text-accent-foreground" />
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
