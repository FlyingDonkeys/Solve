// app/page.tsx
import Link from "next/link";
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import Latex from 'react-latex-next';
import "katex/dist/katex.min.css";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3.5 py-1 text-xs font-medium text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Curated Exam Repository
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
          H2 Math practice, organized by subtopics.
        </h1>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-neutral-400 leading-relaxed">
          Drill curated past-year questions, filter by granular subtopics, and verify your
          working with step-by-step LaTeX solutions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/questions"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            Browse Problems
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid sm:grid-cols-3 gap-4 border-t border-neutral-600 pt-16">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-2">
          <div className="text-neutral-300 pb-2">
            <Layers className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-semibold text-white">Granular Subtopics</h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Target specific weaknesses using fast in-memory filters instead of scrolling
            through mixed papers.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-2">
          <div className="text-neutral-300 pb-2">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-semibold text-white">High-Fidelity Math</h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Problems and algebraic formulas rendered with KaTeX for sharp, readable
            notation across devices.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-2">
          <div className="text-neutral-300 pb-2">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-semibold text-white">On-Demand Solutions</h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Collapsible answer schemes let you work independently without spoiling
            the final result.
          </p>
        </div>
      </section>

      {/* Interactive Teaser Preview */}
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Preview
        </p>
        <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 gap-4">

          {/* Header & Badges */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-200 border border-neutral-700">
                  Mathematics
                </span>
                <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-400 border border-neutral-700">
                  2023
                </span>
              </div>
              <span className="text-xs font-mono text-neutral-500">Sample Item</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md px-2.5 py-1 text-xs font-medium border border-blue-600 bg-blue-900 text-blue-300">
                Inequalities
              </span>
            </div>
          </div>

          {/* Question Content */}
          <div className="whitespace-pre-line text-sm sm:text-base text-neutral-300 leading-relaxed">
            <Latex>{"Solve the inequality $x + 1 > \\frac{1}{x - 1}$."}</Latex>
          </div>

          {/* Footer Action */}
          <div className="pt-2 border-t border-neutral-800">
            <Link
              href="/questions"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              View full collection in question bank →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
