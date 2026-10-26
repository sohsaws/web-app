// DeepL may translate or reshape ICU placeholders ({max} → {maximum}), so
// they are sent inside a tag DeepL is told to leave alone.
export const PROTECTED_TAG = "x";

const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;

// Any formatted ICU argument ({count, plural, ...}, {n, number},
// {when, date, short}) is translated by hand: plurals need grammar per
// language (Russian one/few/many/other), and DeepL could translate the
// format keywords ("number" → "Nummer"), which breaks the message.
export function needsManualTranslation(text: string): boolean {
  return /\{\s*\w+\s*,/.test(text);
}

export function placeholderNames(text: string): string[] {
  return Array.from(text.matchAll(PLACEHOLDER_PATTERN), (match) => match[1])
    .filter((name): name is string => name !== undefined)
    .sort();
}

const RICH_TAG_PATTERN = /<(\w+)>/g;

// Opening rich-text tags rendered by t.rich (<muted>, <link>, <br>). A
// translation that drops or renames one loses that markup.
export function richTagNames(text: string): string[] {
  return Array.from(text.matchAll(RICH_TAG_PATTERN), (match) => match[1])
    .filter((name): name is string => name !== undefined)
    .sort();
}

export function hasSameRichTags(source: string, translation: string) {
  return richTagNames(source).join(",") === richTagNames(translation).join(",");
}

export function hasSamePlaceholders(source: string, translation: string) {
  return (
    placeholderNames(source).join(",") ===
    placeholderNames(translation).join(",")
  );
}

// With XML tag handling a bare "&" would be read as an entity start.
export function protectPlaceholders(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replace(PLACEHOLDER_PATTERN, `<${PROTECTED_TAG}>{$1}</${PROTECTED_TAG}>`);
}

export function restorePlaceholders(text: string): string {
  return (
    text
      .replaceAll(`<${PROTECTED_TAG}>`, "")
      .replaceAll(`</${PROTECTED_TAG}>`, "")
      .replaceAll("&quot;", '"')
      .replaceAll("&apos;", "'")
      // "&amp;" goes last, so an escaped "&amp;quot;" stays the text "&quot;".
      .replaceAll("&amp;", "&")
      // In ICU an apostrophe right before "{" quotes it, so the user would
      // see a literal "{name}" (French "l'{name}"). A typographic one is
      // plain text and also the correct French punctuation.
      .replaceAll("'{", "’{")
  );
}
