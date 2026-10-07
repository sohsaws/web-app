import type { ReactElement } from "react";
import { HeroCards } from "./_components/hero-cards.client";
import { HeroCta } from "./_components/hero-cta.client";

export const dynamic = "error";

export default function Home(): ReactElement {
  
  return (
    <main className="relative isolate flex w-full min-w-0 flex-1 flex-col items-center overflow-x-clip px-4 pt-16 pb-16 text-center sm:pt-24">
      
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-24 left-1/2 size-96 translate-x-[-115%] rounded-full bg-app-action-skip/10 blur-3xl" />
        <div className="absolute top-32 left-1/2 size-96 translate-x-[15%] rounded-full bg-category-navy/10 blur-3xl" />
      </div>

      <p className="flex items-center justify-center gap-3 text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase motion-safe:animate-fade-up">
        <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />A
        calmer way to choose
      </p>

      <h1 className="mt-8 font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-[7.5rem] motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
        <span className="block text-white">Swipe. Decide.</span>
        <span className="block bg-linear-to-b from-white to-neutral-500 bg-clip-text pb-2 text-transparent">
          Done.
        </span>
      </h1>

      <p className="mt-8 max-w-lg text-base font-light text-neutral-300 md:text-lg motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
        From vacation spots to startup ideas, clarity is just a swipe away.
      </p>

      <div className="mt-10 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
        <HeroCta />
      </div>

      <p className="mt-6 text-xs text-neutral-500 motion-safe:animate-fade-up motion-safe:[animation-delay:400ms]">
        Free to use. Built for curious minds.
      </p>

      <div className="mt-14 w-full sm:mt-16">
        <HeroCards />
      </div>
    </main>
  );
}
