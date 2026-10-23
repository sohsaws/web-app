"use client";

import { ChevronDown } from "lucide-react";
import type { ChangeEvent, ReactElement } from "react";
import {
  isLocale,
  LOCALE_NAMES,
  LOCALES,
  type Locale,
} from "@/lib/config/locales";

export type LanguageSelectVariant = "pill" | "field";

interface LanguageSelectProps {
  value: Locale;
  onChange: (locale: Locale) => void;
  // The accessible name of the select. A caller that shows a visible label
  // passes the same text and points its <label> at `id`.
  label: string;
  variant?: LanguageSelectVariant;
  disabled?: boolean;
  id?: string;
  // Id of a hint that explains, for example, why the select is disabled.
  describedBy?: string;
}

const wrapperClassNames: Record<LanguageSelectVariant, string> = {
  pill: "relative inline-flex shrink-0 items-center rounded-full border border-white/10 bg-neutral-900/60 px-3 py-1.5 text-app-nav font-semibold tracking-tight text-neutral-300 transition-colors duration-200 hover:text-white has-[select:focus-visible]:outline-2 has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-white has-[select:disabled]:opacity-50 motion-reduce:transition-none",
  field:
    "relative flex w-full items-center rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-sm text-white shadow-sm transition-colors has-[select:focus-visible]:border-white/20 has-[select:focus-visible]:ring-1 has-[select:focus-visible]:ring-white/20 has-[select:disabled]:opacity-60 motion-reduce:transition-none",
};

// The pill is drawn small to match the header buttons; its invisible select
// reaches 6px past it vertically, so the tap target is 40px tall.
const selectBoxClassNames: Record<LanguageSelectVariant, string> = {
  pill: "-top-1.5 left-0 h-[calc(100%+0.75rem)] w-full",
  field: "inset-0 size-full",
};

// A native <select> laid invisibly over a styled control: the closed control
// can show a short code on narrow screens while keyboard, screen readers and
// the open list stay those of a real select. The open list is the browser's
// own, kept dark through color-scheme.
export function LanguageSelect({
  value,
  onChange,
  label,
  variant = "field",
  disabled = false,
  id,
  describedBy,
}: LanguageSelectProps): ReactElement {
  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextLocale = event.currentTarget.value;

    if (isLocale(nextLocale) && nextLocale !== value) {
      onChange(nextLocale);
    }
  }

  return (
    <div className={wrapperClassNames[variant]}>
      <span
        aria-hidden="true"
        className="pointer-events-none flex min-w-0 flex-1 items-center justify-between gap-1.5"
      >
        {variant === "pill" ? (
          <>
            <span className="sm:hidden">{value.toUpperCase()}</span>
            <span className="hidden sm:inline">{LOCALE_NAMES[value]}</span>
          </>
        ) : (
          <span className="truncate">{LOCALE_NAMES[value]}</span>
        )}
        <ChevronDown className="size-3.5 shrink-0 text-neutral-400" />
      </span>

      <select
        id={id}
        aria-label={label}
        aria-describedby={describedBy}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        className={`absolute ${selectBoxClassNames[variant]} cursor-pointer opacity-0 scheme-dark disabled:cursor-not-allowed [&_option]:bg-app-bg [&_option]:text-white`}
      >
        {LOCALES.map((locale) => (
          // lang lets screen readers pronounce each name in its own language.
          <option key={locale} value={locale} lang={locale}>
            {LOCALE_NAMES[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
