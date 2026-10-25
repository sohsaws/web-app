"use client";

import { useTranslations } from "next-intl";

// Categories stay English keys everywhere else: the AI picks from the English
// list, the database stores them and the category distribution groups by
// them. Only the label the user sees is translated. A value without a
// message (for example one saved before a category was renamed) is shown as
// stored rather than as a raw message key.
export function useCategoryLabel(): (category: string) => string {
  const t = useTranslations("Categories");

  return (category) => (t.has(category) ? t(category) : category);
}
