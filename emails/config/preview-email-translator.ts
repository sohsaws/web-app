import { createTranslator, type Messages } from "next-intl";
import englishEmailMessages from "@/messages/en/emails.json";
import type { EmailTranslator } from "./email-translator";

// Template previews (PreviewProps) show the real English copy instead of a
// second set of hard-coded strings.
export const previewEmailTranslator: EmailTranslator = createTranslator<
  Messages,
  "Emails"
>({
  locale: "en",
  messages: englishEmailMessages,
  namespace: "Emails",
});
