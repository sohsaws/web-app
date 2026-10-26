import { readFileSync } from "node:fs";
import path from "node:path";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { mergeMessages } from "@/i18n/merge-messages";
import { MESSAGE_NAMESPACES } from "@/i18n/namespaces";

// Vitest runs from the project root; import.meta.url is not a file URL in the
// jsdom environment, so the path is built from the working directory.
const ENGLISH_MESSAGES_DIR = path.join(process.cwd(), "messages", "en");

// The same English messages the app loads, read once per test file, so tests
// assert on the real English copy.
function loadEnglishMessages(): AbstractIntlMessages {
  return MESSAGE_NAMESPACES.map((namespace): AbstractIntlMessages => {
    const file = path.join(ENGLISH_MESSAGES_DIR, `${namespace}.json`);
    return JSON.parse(readFileSync(file, "utf8"));
  }).reduce(mergeMessages, {});
}

const englishMessages = loadEnglishMessages();

export function IntlTestProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <NextIntlClientProvider locale="en" messages={englishMessages}>
      {children}
    </NextIntlClientProvider>
  );
}
