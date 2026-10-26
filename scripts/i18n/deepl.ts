import { PROTECTED_TAG } from "./placeholders";

export type DeeplFormality = "prefer_more" | "prefer_less";

interface TranslateOptions {
  apiKey: string;
  targetLang: string;
  formality: DeeplFormality;
}

// DeepL documents at most 50 texts per request.
const MAX_TEXTS_PER_REQUEST = 50;

// Free-plan keys end in ":fx" and only work on the free host.
function deeplBaseUrl(apiKey: string): string {
  return apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com"
    : "https://api.deepl.com";
}

function readTranslations(data: unknown, expectedCount: number): string[] {
  if (
    typeof data !== "object" ||
    data === null ||
    !("translations" in data) ||
    !Array.isArray(data.translations)
  ) {
    throw new Error("DeepL returned an unexpected response shape");
  }

  const texts = data.translations.map((item: unknown) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("text" in item) ||
      typeof item.text !== "string"
    ) {
      throw new Error("DeepL returned a translation without text");
    }
    return item.text;
  });

  if (texts.length !== expectedCount) {
    throw new Error(
      `DeepL returned ${texts.length} translations for ${expectedCount} texts`,
    );
  }
  return texts;
}

async function translateBatch(
  texts: string[],
  options: TranslateOptions,
): Promise<string[]> {
  const response = await fetch(`${deeplBaseUrl(options.apiKey)}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      source_lang: "EN",
      target_lang: options.targetLang,
      formality: options.formality,
      tag_handling: "xml",
      ignore_tags: [PROTECTED_TAG],
    }),
  });

  if (!response.ok) {
    // The body explains quota (456) or bad-request errors; it never echoes
    // the key.
    const details = await response.text().catch(() => "");
    throw new Error(`DeepL request failed: ${response.status} ${details}`);
  }

  return readTranslations(await response.json(), texts.length);
}

export async function translateTexts(
  texts: string[],
  options: TranslateOptions,
): Promise<string[]> {
  const translations: string[] = [];

  for (let start = 0; start < texts.length; start += MAX_TEXTS_PER_REQUEST) {
    const batch = texts.slice(start, start + MAX_TEXTS_PER_REQUEST);
    translations.push(...(await translateBatch(batch, options)));
  }

  return translations;
}
