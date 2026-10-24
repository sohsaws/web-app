// Drafts missing translations with DeepL at development time. English
// (messages/en) is the source; only keys missing in a locale are sent, so
// reviewed translations are never overwritten. Drafts must be reviewed
// before committing.
//
// Run: npx tsx --env-file=.env.local scripts/translate-messages.ts [namespace...]
// Without namespaces every namespace is checked.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { MESSAGE_NAMESPACES, type MessageNamespace } from "@/i18n/namespaces";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/config/locales";
import { type DeeplFormality, translateTexts } from "./i18n/deepl";
import { isMessageTree, type MessageTree } from "./i18n/message-tree";
import { protectPlaceholders } from "./i18n/placeholders";
import { applyDrafts, planTranslation } from "./i18n/translation-plan";

// English is the source (DEFAULT_LOCALE is typed as any Locale, so the
// literal is spelled out here).
type TargetLocale = Exclude<Locale, "en">;

// Matches the tone of the translations already in messages/: formal
// Russian and French, informal Spanish and German, as apps usually do.
const FORMALITY: Record<TargetLocale, DeeplFormality> = {
  ru: "prefer_more",
  es: "prefer_less",
  fr: "prefer_more",
  de: "prefer_less",
};

const MESSAGES_DIR = path.join(process.cwd(), "messages");

interface NamespaceReport {
  translated: number;
  manual: string[];
  rejected: string[];
  removed: string[];
}

function isTargetLocale(locale: Locale): locale is TargetLocale {
  return locale !== "en";
}

function isMessageNamespace(value: string): value is MessageNamespace {
  return MESSAGE_NAMESPACES.some((namespace) => namespace === value);
}

function messageFile(locale: Locale, namespace: MessageNamespace): string {
  return path.join(MESSAGES_DIR, locale, `${namespace}.json`);
}

async function readMessageTree(file: string): Promise<MessageTree> {
  const data: unknown = JSON.parse(await readFile(file, "utf8"));
  if (!isMessageTree(data)) {
    throw new Error(`${file} is not a tree of string messages`);
  }
  return data;
}

async function translateNamespace(
  namespace: MessageNamespace,
  locale: TargetLocale,
  apiKey: string,
): Promise<NamespaceReport> {
  const source = await readMessageTree(messageFile(DEFAULT_LOCALE, namespace));
  const target = await readMessageTree(messageFile(locale, namespace));
  const plan = planTranslation(source, target);

  const drafts = await translateTexts(
    plan.automatic.map(([, text]) => protectPlaceholders(text)),
    { apiKey, targetLang: locale.toUpperCase(), formality: FORMALITY[locale] },
  );
  const result = applyDrafts(source, target, plan.automatic, drafts);

  if (result.translated.length > 0 || plan.removed.length > 0) {
    await writeFile(
      messageFile(locale, namespace),
      `${JSON.stringify(result.tree, null, 2)}
`,
    );
  }

  return {
    translated: result.translated.length,
    manual: plan.manual,
    rejected: result.rejected,
    removed: plan.removed,
  };
}

function printReport(label: string, report: NamespaceReport): void {
  const lines = [`${label}: ${report.translated} translated`];
  if (report.manual.length > 0) {
    lines.push(
      `  translate by hand (ICU plural/select/format): ${report.manual.join(", ")}`,
    );
  }
  if (report.rejected.length > 0) {
    lines.push(
      `  rejected (placeholders changed): ${report.rejected.join(", ")}`,
    );
  }
  if (report.removed.length > 0) {
    lines.push(`  removed (not in English): ${report.removed.join(", ")}`);
  }
  console.info(lines.join("\n"));
}

async function main(): Promise<void> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error(
      "DEEPL_API_KEY is not set. Run with --env-file=.env.local.",
    );
  }

  const requested = process.argv.slice(2);
  const unknown = requested.filter((name) => !isMessageNamespace(name));
  if (unknown.length > 0) {
    throw new Error(`Unknown namespaces: ${unknown.join(", ")}`);
  }
  const namespaces =
    requested.length > 0
      ? requested.filter(isMessageNamespace)
      : [...MESSAGE_NAMESPACES];

  for (const namespace of namespaces) {
    for (const locale of LOCALES.filter(isTargetLocale)) {
      const report = await translateNamespace(namespace, locale, apiKey);
      printReport(`${locale}/${namespace}`, report);
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
