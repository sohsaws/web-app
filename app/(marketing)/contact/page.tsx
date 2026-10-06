import { Mail, MessageCircle } from "lucide-react";
import type { ReactElement } from "react";
import { ContactForm } from "./_components/contact-form.client";

const CONTACT_EMAIL = "hello@swiipy.com";

const ICON_BOX_CLASS =
  "flex size-8 shrink-0 items-center justify-center rounded-lg border border-app-action-skip/30 bg-app-action-skip/10 text-app-action-skip";

export default function Contact(): ReactElement {
  return (
    <main className="relative isolate flex w-full min-w-0 flex-1 items-center overflow-x-clip px-4 py-16 sm:px-6 lg:py-24">
      {/* Soft background glow; decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-1/4 left-0 size-128 -translate-x-1/3 rounded-full bg-app-glow/60 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-5xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-24">
        <div className="min-w-0">
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-neutral-400 uppercase motion-safe:animate-fade-up">
            <span aria-hidden="true" className="h-px w-6 bg-app-action-skip" />
            Let&apos;s talk
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
            Make the next <span className="text-neutral-400">conversation</span>{" "}
            count.
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed font-light text-neutral-300 motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
            Questions, thoughtful feedback, or just a good idea? We&apos;re
            listening. Send a note and we&apos;ll get back to you soon.
          </p>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-5 motion-safe:animate-fade-up motion-safe:[animation-delay:300ms]">
            <li className="flex items-start gap-3">
              <span aria-hidden="true" className={ICON_BOX_CLASS}>
                <Mail className="size-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-xs font-medium text-white">Email us</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-1 block text-xs text-neutral-500 transition-colors hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span aria-hidden="true" className={ICON_BOX_CLASS}>
                <MessageCircle className="size-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-xs font-medium text-white">
                  Usually replies within
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  one thoughtful day
                </p>
              </div>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
