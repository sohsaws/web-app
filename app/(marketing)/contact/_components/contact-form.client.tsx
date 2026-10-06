"use client";

import { ArrowRight } from "lucide-react";
import { type ReactElement, useState } from "react";

const FIELD_CLASS =
  "mt-2 w-full rounded-lg border border-white/10 bg-app-bg/60 px-3.5 py-3 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10";

export function ContactForm(): ReactElement {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="min-w-0 rounded-2xl border border-app-border bg-app-surface p-6 shadow-2xl shadow-black/40 sm:p-7 motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
      <h2 className="border-b border-app-border pb-5 text-xs font-semibold tracking-[0.15em] text-white uppercase">
        Write us a note
      </h2>

      <form className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs text-neutral-400"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={FIELD_CLASS}
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs text-neutral-400"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={FIELD_CLASS}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-xs text-neutral-400"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={`${FIELD_CLASS} resize-y`}
            placeholder="What's on your mind?"
          />
        </div>

        <button
          type="submit"
          className="group inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-[#ece8e1] px-6 text-sm font-semibold text-black transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Send message
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </button>
      </form>
    </div>
  );
}
