import {
  buildMessageTree,
  flattenMessages,
  type MessageTree,
} from "./message-tree";
import {
  hasSamePlaceholders,
  needsManualTranslation,
  restorePlaceholders,
} from "./placeholders";

export interface TranslationPlan {
  // Missing keys DeepL drafts, as [key, English text].
  automatic: [string, string][];
  // Missing keys with formatted ICU arguments, translated by hand.
  manual: string[];
  // Keys in the locale file that English no longer has.
  removed: string[];
}

export interface TranslationResult {
  tree: MessageTree;
  translated: string[];
  rejected: string[];
}

export function planTranslation(
  source: MessageTree,
  target: MessageTree,
): TranslationPlan {
  const sourceMessages = flattenMessages(source);
  const existing = flattenMessages(target);
  const missing = [...sourceMessages].filter(([key]) => !existing.has(key));

  return {
    automatic: missing.filter(([, text]) => !needsManualTranslation(text)),
    manual: missing
      .filter(([, text]) => needsManualTranslation(text))
      .map(([key]) => key),
    removed: [...existing.keys()].filter((key) => !sourceMessages.has(key)),
  };
}

// `drafts[i]` is DeepL's answer for `automatic[i]`, still protected. A draft
// that is empty or changed its placeholders is rejected. Existing
// translations always win, so reviewed text is never overwritten.
export function applyDrafts(
  source: MessageTree,
  target: MessageTree,
  automatic: [string, string][],
  drafts: string[],
): TranslationResult {
  const existing = flattenMessages(target);
  const accepted = new Map<string, string>();
  const rejected: string[] = [];

  automatic.forEach(([key, text], index) => {
    const draft = restorePlaceholders(drafts[index] ?? "");
    if (draft.trim() !== "" && hasSamePlaceholders(text, draft)) {
      accepted.set(key, draft);
    } else {
      rejected.push(key);
    }
  });

  return {
    tree: buildMessageTree(
      source,
      (key) => existing.get(key) ?? accepted.get(key),
    ),
    translated: [...accepted.keys()],
    rejected,
  };
}
