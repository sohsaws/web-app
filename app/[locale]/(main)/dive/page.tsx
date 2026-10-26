import { ArrowRight, Bookmark, RotateCcw, X } from "lucide-react";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactElement, ReactNode } from "react";
import { Link, redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { CardsPool } from "./_components/cards-pool.client";

const EYEBROW_CLASS =
  "flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase";

const gestureHints = [
  {
    id: "save",
    Icon: Bookmark,
    iconClassName: "fill-current",
    boxClassName:
      "border-app-action-favorite/30 bg-app-action-favorite/10 text-app-action-favorite",
  },
  {
    id: "skip",
    Icon: X,
    iconClassName: "",
    boxClassName:
      "border-app-action-skip/30 bg-app-action-skip/10 text-app-action-skip",
  },
  {
    id: "restore",
    Icon: RotateCcw,
    iconClassName: "",
    boxClassName: "border-app-border bg-white/5 text-app-fg",
  },
] as const;

function BackgroundGlow(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="absolute top-1/4 left-0 size-128 -translate-x-1/3 rounded-full bg-app-glow/60 blur-3xl" />
      <div className="absolute top-1/3 right-0 size-96 translate-x-1/3 rounded-full bg-app-action-favorite/5 blur-3xl" />
    </div>
  );
}

// The second line of a two-line serif heading, dimmed. Messages mark it with
// <muted>…</muted> so translators keep the whole sentence in one string.
function mutedHeadingLine(chunks: ReactNode): ReactElement {
  return <span className="block text-neutral-400">{chunks}</span>;
}

async function EmptyBio(): Promise<ReactElement> {
  const t = await getTranslations("Dive.page");

  return (
    <main className="relative isolate z-10 flex min-h-dvh w-full min-w-0 flex-col items-center justify-center overflow-x-clip px-4 pt-28 pb-16 text-center">
      <BackgroundGlow />

      <p className={`${EYEBROW_CLASS} motion-safe:animate-fade-up`}>
        <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
        {t("eyebrow")}
      </p>

      <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
        {t.rich("bioRequired.heading", { muted: mutedHeadingLine })}
      </h1>

      <p className="mt-8 max-w-md text-base leading-relaxed font-light text-neutral-300 motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
        {t("bioRequired.description")}
      </p>

      <div className="mt-10 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
        <Link
          href="/settings/profile"
          className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#ece8e1] px-7 text-sm font-semibold text-black transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {t("bioRequired.cta")}
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </main>
  );
}

export default async function Dive(): Promise<ReactElement> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect({ href: "/login?reason=unauthorized", locale: await getLocale() });
  }

  const userBio = session.user.bio;

  if (!userBio) {
    return <EmptyBio />;
  }

  const t = await getTranslations("Dive.page");

  return (
    <main className="relative isolate z-10 w-full min-w-0 overflow-x-clip px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:pb-24">
      <BackgroundGlow />

      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:min-h-[calc(100dvh-14rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:gap-24">
        <header className="min-w-0 text-center lg:text-left">
          <p
            className={`${EYEBROW_CLASS} justify-center lg:justify-start motion-safe:animate-fade-up`}
          >
            <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
            {t("eyebrow")}
          </p>

          <h1
            id="dive-heading"
            className="mt-6 font-serif text-4xl leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-7xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]"
          >
            {t.rich("heading", { muted: mutedHeadingLine })}
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed font-light text-neutral-300 lg:mx-0 lg:mt-8 motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
            {t("intro")}
          </p>

          <ul className="mt-10 hidden flex-col gap-5 lg:flex motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
            {gestureHints.map(({ id, Icon, iconClassName, boxClassName }) => (
              <li key={id} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${boxClassName}`}
                >
                  <Icon
                    className={`size-4 ${iconClassName}`}
                    strokeWidth={1.75}
                  />
                </span>
                <div>
                  <p className="text-xs font-medium text-white">
                    {t(`hints.${id}.title`)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {t(`hints.${id}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </header>

        <section
          aria-labelledby="dive-heading"
          className="flex min-w-0 justify-center motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]"
        >
          <CardsPool userBio={userBio} />
        </section>
      </div>
    </main>
  );
}
