"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { type ReactElement, useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({
  error,
  retry,
}: ErrorPageProps): ReactElement {
  useEffect(() => {
    // No error reporting service yet, so the browser console is the only log.
    console.error(error);
  }, [error]);

  return (
    <main className="relative isolate z-10 flex min-h-dvh w-full min-w-0 flex-col items-center justify-center overflow-x-clip px-4 py-16 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-1/3 left-1/2 size-96 -translate-x-1/2 rounded-full bg-app-action-skip/10 blur-3xl" />
      </div>

      <p className="flex items-center justify-center gap-3 text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase motion-safe:animate-fade-up">
        <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
        Something went wrong
      </p>

      <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
        <span className="block">We hit an</span>
        <span className="block text-neutral-400">unexpected snag.</span>
      </h1>

      <p className="mt-8 max-w-md text-base leading-relaxed font-light text-neutral-300 motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
        It&apos;s not you. Try again, and if it keeps happening, let us know.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
        <button
          type="button"
          onClick={retry}
          className="group inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-[#ece8e1] px-7 text-sm font-semibold text-black transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <RotateCcw
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transition-none"
          />
          Try again
        </button>
        <Link
          href="/"
          className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-app-border px-7 text-sm font-medium text-neutral-300 transition-colors duration-300 hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Back to home
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-8 font-mono text-xs text-neutral-600">
          Reference: {error.digest}
        </p>
      ) : null}
    </main>
  );
}
