import type { createTranslator, Messages } from "next-intl";

// The Emails translator from createTranslator: getEmailTranslator builds it
// for a user's locale, and the template previews build an English one.
export type EmailTranslator = ReturnType<
  typeof createTranslator<Messages, "Emails">
>;
