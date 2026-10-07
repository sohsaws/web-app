import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

export default function NotFound(): ReactElement {
  return (
    <main className="relative isolate z-10 flex min-h-dvh w-full min-w-0 flex-col items-center justify-center overflow-x-clip px-4 py-16 text-center">
      {/* Soft background glow; decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-1/3 left-1/2 size-96 translate-x-[-115%] rounded-full bg-app-action-skip/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 size-96 translate-x-[15%] rounded-full bg-category-navy/10 blur-3xl" />
      </div>

      <p className="flex items-center justify-center gap-3 text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase motion-safe:animate-fade-up">
        <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
        Error 404
      </p>

      <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
        <span className="block">This page</span>
        <span className="block text-neutral-400">wandered off.</span>
      </h1>

      <p className="mt-8 max-w-md text-base leading-relaxed font-light text-neutral-300 motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
        The link may be broken, or the page has moved. Let&apos;s get you back
        to deciding.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
        <Link
          href="/"
          className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#ece8e1] px-7 text-sm font-semibold text-black transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Back to home
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-12 items-center rounded-full border border-app-border px-7 text-sm font-medium text-neutral-300 transition-colors duration-300 hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Contact us
        </Link>
      </div>
    </main>
  );
}
