"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { LOCALE_NAMES, LOCALES, type Locale } from "@/lib/config/locales";

export type LanguageSelectVariant = "pill" | "field";

interface LanguageSelectProps {
  value: Locale;
  onChange: (locale: Locale) => void;
  // The accessible name of the control. A caller that shows a visible label
  // passes the same text and points its <label> at `id`.
  label: string;
  variant?: LanguageSelectVariant;
  disabled?: boolean;
  id?: string;
  // Id of a hint that explains, for example, why the control is disabled.
  describedBy?: string;
}

const triggerClassNames: Record<LanguageSelectVariant, string> = {
  // Same padding and type as the Sign In / Sign Up pills, so all three line
  // up. The before: layer only grows the tap area to 40px.
  pill: "relative inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900/60 px-[clamp(0.75rem,3vw,1.75rem)] py-1.5 text-app-nav font-semibold tracking-tight text-neutral-300 transition-colors duration-200 before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
  field:
    "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral-800 bg-[#080808] px-3 py-2 text-left text-sm text-white shadow-sm outline-none transition-colors focus-visible:border-white/20 focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none",
};

// The header pill sits at the right edge, so its list opens towards the left.
const listboxPlacementClassNames: Record<LanguageSelectVariant, string> = {
  pill: "right-0 w-40 origin-top-right",
  field: "left-0 w-full origin-top",
};

// The panel and items match the user menu (DropdownMenu, UserDropdown). The
// selected language keeps the glow and a grey background; the active one
// (pointer or arrow keys) gets the user menu's hover look.
const listboxClassName =
  "absolute top-[calc(100%+0.5rem)] z-50 rounded-lg border border-white/50 bg-app-bg p-1 shadow-[0_0_18px_var(--color-app-glow)]";
const optionClassName =
  "block w-full cursor-pointer rounded-md px-3 py-2 text-center text-sm text-white transition-[background-color,text-shadow] data-[active=true]:bg-app-glow/70 data-[active=true]:[text-shadow:0_0_10px_var(--color-app-fg)] aria-selected:bg-white/10 aria-selected:[text-shadow:0_0_10px_var(--color-app-fg)] motion-reduce:transition-none";

const LAST_INDEX = LOCALES.length - 1;

// A select-only combobox (WAI-ARIA APG): focus stays on the button, the
// highlighted option is announced through aria-activedescendant. A native
// <select> cannot be used here because its open list cannot be styled.
export function LanguageSelect({
  value,
  onChange,
  label,
  variant = "field",
  disabled = false,
  id,
  describedBy,
}: LanguageSelectProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => LOCALES.indexOf(value));
  const rootRef = useRef<HTMLDivElement>(null);
  // Set when Space chose an option on key down, so the button's own key-up
  // click does not reopen the list. A Space on the closed button still
  // opens it through that click.
  const spaceChoseOptionRef = useRef(false);
  const listboxId = useId();
  const reducedMotion = useReducedMotion();

  const optionId = (locale: Locale): string => `${listboxId}-${locale}`;
  const activeLocale = LOCALES[activeIndex] ?? value;

  function open(): void {
    setActiveIndex(LOCALES.indexOf(value));
    setIsOpen(true);
  }

  function choose(locale: Locale): void {
    setIsOpen(false);
    if (locale !== value) {
      onChange(locale);
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (!isOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        open();
      }
      // Enter and Space reach onClick through the button's own behaviour.
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, LAST_INDEX));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(LAST_INDEX);
        break;
      case "Enter":
        // Stops the button's click, which would reopen the list.
        event.preventDefault();
        choose(activeLocale);
        break;
      case " ":
        event.preventDefault();
        spaceChoseOptionRef.current = true;
        choose(activeLocale);
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  }

  return (
    <div
      ref={rootRef}
      className={variant === "field" ? "relative" : "relative inline-flex"}
    >
      <button
        id={id}
        type="button"
        role="combobox"
        aria-label={label}
        aria-describedby={describedBy}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? optionId(activeLocale) : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        // Space activates a button on key up.
        onKeyUp={(event) => {
          if (event.key === " " && spaceChoseOptionRef.current) {
            spaceChoseOptionRef.current = false;
            event.preventDefault();
          }
        }}
        className={triggerClassNames[variant]}
      >
        {variant === "pill" ? (
          <>
            <span className="sm:hidden">{value.toUpperCase()}</span>
            <span className="hidden sm:inline">{LOCALE_NAMES[value]}</span>
          </>
        ) : (
          <span className="truncate">{LOCALE_NAMES[value]}</span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 shrink-0 text-neutral-400 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className={`${listboxClassName} ${listboxPlacementClassNames[variant]}`}
          >
            {LOCALES.map((locale, index) => (
              <li
                key={locale}
                id={optionId(locale)}
                role="option"
                aria-selected={locale === value}
                data-active={index === activeIndex}
                // lang lets screen readers pronounce each name in its own
                // language.
                lang={locale}
                // Keeps focus on the button while choosing with the pointer.
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(locale)}
                className={optionClassName}
              >
                {LOCALE_NAMES[locale]}
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
