import { beforeEach, describe, expect, it, vi } from "vitest";
import { translateTexts } from "./deepl";

const fetchMock = vi.fn();

function deeplAnswer(texts: string[]): Response {
  return Response.json({
    translations: texts.map((text) => ({ text: `de:${text}` })),
  });
}

function sentBody(call: number): { text: string[] } & Record<string, unknown> {
  const init = fetchMock.mock.calls[call]?.[1];
  return JSON.parse(String(init?.body));
}

const options = {
  apiKey: "key:fx",
  targetLang: "DE",
  formality: "prefer_less",
} as const;

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockImplementation((_url: string, init: RequestInit) =>
    Promise.resolve(deeplAnswer(JSON.parse(String(init.body)).text)),
  );
});

describe("translateTexts", () => {
  it("sends nothing for an empty list", async () => {
    await expect(translateTexts([], options)).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("calls the free host with the key, tag handling and formality", async () => {
    await expect(translateTexts(["a", "b"], options)).resolves.toEqual([
      "de:a",
      "de:b",
    ]);

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://api-free.deepl.com/v2/translate");
    expect(init.headers).toMatchObject({
      Authorization: "DeepL-Auth-Key key:fx",
    });
    expect(sentBody(0)).toEqual({
      text: ["a", "b"],
      source_lang: "EN",
      target_lang: "DE",
      formality: "prefer_less",
      tag_handling: "xml",
      ignore_tags: ["x"],
    });
  });

  it("uses the paid host for a key without :fx", async () => {
    await translateTexts(["a"], { ...options, apiKey: "pro-key" });

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://api.deepl.com/v2/translate",
    );
  });

  it("splits more than 50 texts into batches and keeps the order", async () => {
    const texts = Array.from({ length: 101 }, (_, index) => `t${index}`);

    const result = await translateTexts(texts, options);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(sentBody(0).text).toHaveLength(50);
    expect(sentBody(2).text).toEqual(["t100"]);
    expect(result).toEqual(texts.map((text) => `de:${text}`));
  });

  it("throws with the status when DeepL refuses", async () => {
    fetchMock.mockResolvedValue(
      new Response("Quota exceeded", { status: 456 }),
    );

    await expect(translateTexts(["a"], options)).rejects.toThrow(
      "DeepL request failed: 456 Quota exceeded",
    );
  });

  it.each([
    ["no translations array", {}],
    ["a translation without text", { translations: [{}] }],
    ["too few translations", { translations: [] }],
  ])("throws on %s", async (_case, body) => {
    fetchMock.mockResolvedValue(Response.json(body));

    await expect(translateTexts(["a"], options)).rejects.toThrow(/DeepL/);
  });
});
