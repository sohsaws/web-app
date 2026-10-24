import { getTranslations } from "next-intl/server";
import type { ReactElement, ReactNode } from "react";

export const dynamic = "error";

// Step copy lives in Marketing.about.steps.<messageKey>.
const steps = [
  { number: "01", messageKey: "bio" },
  { number: "02", messageKey: "swipe" },
  { number: "03", messageKey: "keep" },
] as const;

const CARD_CLASS =
  "min-w-0 rounded-2xl border border-app-border bg-app-surface p-6 shadow-2xl shadow-black/40 sm:p-7";

const CARD_LABEL_CLASS =
  "border-b border-app-border pb-5 text-xs font-semibold tracking-[0.15em] text-white uppercase";

const EYEBROW_CLASS =
  "flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase";

function renderMuted(chunks: ReactNode): ReactElement {
  return <span className="text-neutral-400">{chunks}</span>;
}

export default async function About(): Promise<ReactElement> {
  const t = await getTranslations("Marketing.about");

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
            {t("eyebrow")}
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
            <span className="block">{t("titleFirstLine")}</span>
            <span className="block text-neutral-400">
              {t("titleSecondLine")}
            </span>
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed font-light text-neutral-300 md:text-lg motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
            {t("intro")}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
          <section className={CARD_CLASS}>
            <p className={CARD_LABEL_CLASS}>{t("problem.label")}</p>
            <h2 className="mt-6 font-serif text-3xl tracking-tight text-white">
              {t("problem.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              {t("problem.description")}
            </p>
          </section>

          <section className={CARD_CLASS}>
            <p className={CARD_LABEL_CLASS}>{t("solution.label")}</p>
            <h2 className="mt-6 font-serif text-3xl tracking-tight text-white">
              {t("solution.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              {t("solution.description")}
            </p>
          </section>
        </div>

        <section>
          <p className={EYEBROW_CLASS}>
            <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
            {t("howItWorks.eyebrow")}
          </p>
          <h2 className="mt-6 font-serif text-4xl tracking-tight text-white sm:text-5xl">
            {t.rich("howItWorks.title", { muted: renderMuted })}
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
                <h3 className="mt-5 font-medium text-white">
                  {t(`steps.${step.messageKey}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {t(`steps.${step.messageKey}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${CARD_CLASS} lg:p-10`}>
          <p className={CARD_LABEL_CLASS}>{t("comingNext.label")}</p>
          <h2 className="mt-6 font-serif text-3xl tracking-tight text-white sm:text-4xl">
            {t.rich("comingNext.title", { muted: renderMuted })}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">
            {t("comingNext.description")}
          </p>
        </section>
      </div>
    </main>
  );
}
