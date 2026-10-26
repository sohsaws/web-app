"use client";

import { useTranslations } from "next-intl";
import { type ReactElement, useId } from "react";
import { LanguageSelect } from "@/components/ui/language-select.client";
import { useLocalePreference } from "@/hooks/account/use-locale-preference";

interface ProfileLanguageSelectProps {
  // Switching the language re-renders the page under a new locale, which
  // resets the form, so it waits until the edits are saved or cancelled.
  hasUnsavedChanges: boolean;
}

// Lives outside the profile form values: the language is saved the moment it
// is chosen, not with "Save changes".
export function ProfileLanguageSelect({
  hasUnsavedChanges,
}: ProfileLanguageSelectProps): ReactElement {
  const t = useTranslations("Settings.language");
  const { locale, isSaving, changeLocale } = useLocalePreference();
  const selectId = useId();
  const hintId = useId();

  return (
    <div className="space-y-2">
      <label
        htmlFor={selectId}
        className="block text-xs font-medium text-neutral-500"
      >
        {t("label")}
      </label>
      <LanguageSelect
        id={selectId}
        label={t("label")}
        value={locale}
        onChange={changeLocale}
        disabled={isSaving || hasUnsavedChanges}
        describedBy={hasUnsavedChanges ? hintId : undefined}
        variant="field"
      />
      {hasUnsavedChanges ? (
        <p id={hintId} className="text-xs text-neutral-500">
          {t("unsavedHint")}
        </p>
      ) : null}
    </div>
  );
}
