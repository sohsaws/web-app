import { createTranslator, type Messages } from "next-intl";
import { mergeMessages } from "@/i18n/merge-messages";
import type { Locale } from "@/lib/config/locales";
import deEmailMessages from "@/messages/de/emails.json";
import englishEmailMessages from "@/messages/en/emails.json";
import esEmailMessages from "@/messages/es/emails.json";
import frEmailMessages from "@/messages/fr/emails.json";
import ruEmailMessages from "@/messages/ru/emails.json";
import type { EmailTranslator } from "./email-translator";

const EMAIL_MESSAGES: Record<Locale, typeof englishEmailMessages> = {
  en: englishEmailMessages,
  ru: ruEmailMessages,
  es: esEmailMessages,
  fr: frEmailMessages,
  de: deEmailMessages,
};

// Auth emails are sent from /api/auth (no [locale] segment), and lib/auth.ts
// is also loaded by proxy.ts, where next-intl's request config cannot run
// (it reads next/root-params). So emails build their own translator from the
// Emails messages, with English under any key a translation lacks.
export function getEmailTranslator(locale: Locale): EmailTranslator {
  return createTranslator<Messages, "Emails">({
    locale,
    messages: mergeMessages(englishEmailMessages, EMAIL_MESSAGES[locale]),
    namespace: "Emails",
  });
}
