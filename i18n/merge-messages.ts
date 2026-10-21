import type { AbstractIntlMessages } from "next-intl";

// Lays a translation over the English messages, key by key at every depth,
// so a key that is not translated yet shows English instead of its raw name.
export function mergeMessages(
  base: AbstractIntlMessages,
  override: AbstractIntlMessages,
): AbstractIntlMessages {
  const merged: AbstractIntlMessages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = merged[key];
    merged[key] =
      typeof value === "object" && typeof baseValue === "object"
        ? mergeMessages(baseValue, value)
        : value;
  }

  return merged;
}
