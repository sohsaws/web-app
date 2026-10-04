import type { ReactElement } from "react";

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

export default function About(): ReactElement {
  return (
    <section className="max-w-6xl mx-auto pt-10 pb-10 px-6 space-y-24">
      <header className="max-w-2xl space-y-4">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
          About Swiipy
        </span>
        <h1 className="font-serif text-4xl text-white tracking-tight sm:text-5xl">
          Stop scrolling. Start deciding.
        </h1>
        <p className="text-base leading-relaxed text-neutral-400">
          Swiipy turns the endless &ldquo;what should I do?&rdquo; into a few
          quick swipes.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-4">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            The Problem
          </span>
          <h2 className="text-xl font-medium text-white tracking-tight">
            Too many options, no decision
          </h2>
          <p className="text-sm leading-relaxed text-neutral-400">
            A free evening, a long weekend, a new hobby to pick up. Every list
            online offers a hundred options, and endless scrolling leaves you
            more tired than when you started. Nothing actually gets done.
          </p>
        </div>
        <div className="space-y-4">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            The Solution
          </span>
          <h2 className="text-xl font-medium text-white tracking-tight">
            One card, one decision
          </h2>
          <p className="text-sm leading-relaxed text-neutral-400">
            Swiipy shows ideas one at a time, shaped by what you tell us about
            yourself. Swipe left to skip, right to keep. No feeds and no noise,
            just a short stack of ideas that fit you.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-16">
        <div className="mb-10">
          <h2 className="text-2xl font-medium text-white tracking-tight">
            How It Works
          </h2>
        </div>
        <ol className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <li key={step.number} className="relative group">
              <div
                aria-hidden="true"
                className="text-5xl font-bold text-neutral-800 mb-4 select-none group-hover:text-neutral-700 transition-colors"
              >
                {step.number}
              </div>
              <h3 className="text-white font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-500">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-white/5 pt-16 max-w-2xl space-y-4">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
          Coming next
        </span>
        <h2 className="text-xl font-medium text-white tracking-tight">
          From ideas to real plans
        </h2>
        <p className="text-sm leading-relaxed text-neutral-400">
          Soon, your saved ideas will turn into real things to try: places
          nearby, clubs to join, films, games and reads picked just for you. The
          more you swipe, the sharper these picks get.
        </p>
      </div>
    </section>
  );
}
