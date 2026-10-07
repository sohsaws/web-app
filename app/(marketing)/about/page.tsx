import type { ReactElement } from "react";

export const dynamic = "error";

const steps = [
  {
    number: "01",
    title: "Tell us about you",
    description:
      "Write a short bio in your profile: your work, your hobbies, what you enjoy. It is the only setup Swiipy needs.",
  },
  {
    number: "02",
    title: "Swipe through ideas",
    description:
      "AI builds a fresh deck of ideas around your bio. Skip what doesn't spark anything, save what does.",
  },
  {
    number: "03",
    title: "Keep what matters",
    description:
      "Saved ideas land in your pocket, and your overview shows which interests you keep coming back to.",
  },
] as const;

const CARD_CLASS =
  "min-w-0 rounded-2xl border border-app-border bg-app-surface p-6 shadow-2xl shadow-black/40 sm:p-7";

const CARD_LABEL_CLASS =
  "border-b border-app-border pb-5 text-xs font-semibold tracking-[0.15em] text-white uppercase";

const EYEBROW_CLASS =
  "flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase";

export default function About(): ReactElement {
  return (
    <main className="relative isolate w-full min-w-0 flex-1 overflow-x-clip px-4 py-16 sm:px-6 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-0 left-0 size-128 -translate-x-1/3 rounded-full bg-app-glow/60 blur-3xl" />
        <div className="absolute top-24 right-0 size-96 translate-x-1/3 rounded-full bg-category-navy/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-5xl space-y-20 lg:space-y-28">
        <header className="max-w-3xl">
          <p className={`${EYEBROW_CLASS} motion-safe:animate-fade-up`}>
            <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
            About Swiipy
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
            <span className="block">Stop scrolling.</span>
            <span className="block text-neutral-400">Start deciding.</span>
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed font-light text-neutral-300 md:text-lg motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
            Swiipy turns the endless &ldquo;what should I do?&rdquo; into a few
            quick swipes.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
          <section className={CARD_CLASS}>
            <p className={CARD_LABEL_CLASS}>The problem</p>
            <h2 className="mt-6 font-serif text-3xl tracking-tight text-white">
              Too many options, no decision
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              A free evening, a long weekend, a new hobby to pick up. Every list
              online offers a hundred options, and endless scrolling leaves you
              more tired than when you started. Nothing actually gets done.
            </p>
          </section>

          <section className={CARD_CLASS}>
            <p className={CARD_LABEL_CLASS}>The solution</p>
            <h2 className="mt-6 font-serif text-3xl tracking-tight text-white">
              One card, one decision
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Swiipy shows ideas one at a time, shaped by what you tell us about
              yourself. Swipe left to skip, right to keep. No feeds and no
              noise, just a short stack of ideas that fit you.
            </p>
          </section>
        </div>

        <section>
          <p className={EYEBROW_CLASS}>
            <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
            How it works
          </p>
          <h2 className="mt-6 font-serif text-4xl tracking-tight text-white sm:text-5xl">
            Three steps to your <span className="text-neutral-400">deck</span>
          </h2>

          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.number} className={CARD_CLASS}>
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-lg border border-app-action-skip/30 bg-app-action-skip/10 font-mono text-xs text-app-action-skip"
                >
                  {step.number}
                </span>
                <h3 className="mt-5 font-medium text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${CARD_CLASS} lg:p-10`}>
          <p className={CARD_LABEL_CLASS}>Coming next</p>
          <h2 className="mt-6 font-serif text-3xl tracking-tight text-white sm:text-4xl">
            From ideas to <span className="text-neutral-400">real plans</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
            Soon, your saved ideas will turn into real things to try: places
            nearby, clubs to join, films, games and reads picked just for you.
            The more you swipe, the sharper these picks get.
          </p>
        </section>
      </div>
    </main>
  );
}
