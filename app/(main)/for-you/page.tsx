import type { ReactElement } from "react";

export default function ForYouPage(): ReactElement {
  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-20">
      <section
        aria-labelledby="for-you-heading"
        className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-white/5 bg-app-bg px-6 py-16 text-center"
      >
        <p className="text-xs tracking-widest text-app-muted uppercase">
          For you
        </p>
        <h1
          id="for-you-heading"
          className="mt-4 font-serif text-4xl text-white text-shadow-[0_0_24px_rgb(255_255_255/0.45)] sm:text-5xl"
        >
          Coming soon...
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-6 text-white/85 text-shadow-[0_0_16px_rgb(255_255_255/0.25)] sm:text-base sm:leading-7">
          Your saved ideas will turn into real things to try: places nearby,
          clubs to join, films, games and reads picked just for you. Every swipe
          sharpens these picks, so the more you save, the better they get.
        </p>
      </section>
    </main>
  );
}
