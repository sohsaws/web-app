---
name: mixroute
description: How this project calls MixRoute directly, without the Vercel AI SDK. Use before writing or changing anything in lib/ai/, the /api/ideas/generate or /api/ideas/image routes, prompts, structured output schemas, category classification, or image generation.
---

# MixRoute integration

Decision (2026-09-30): the Vercel AI SDK (`ai`, `@ai-sdk/*`) is removed. Do not
reintroduce it. Text uses the official `openai` client, images use `fetch`.

## Docs

- Structured output: https://docs.mixroute.ai/en/api-reference/endpoint/chat-openai#structured-output
- Gemini images: https://docs.mixroute.ai/en/api-reference/endpoint/nano-banana
- `openai` client types: `node_modules/openai/helpers/zod.d.ts` and
  `node_modules/openai/resources/chat/completions/completions.d.ts`.

## Setup (`lib/ai/mixroute.ts`)

- Env vars: `MIXROUTE_API_BASE_URL` (the `/v1` base) and `MIXROUTE_API_KEY`.
  Read them only through `getMixrouteBaseUrl()` and `getMixrouteApiKey()`,
  which throw a clear error when a value is missing. No `!` assertions.
- Never open `.env` or `.env.*`, not even to check a value.
- `createMixrouteClient()` returns an `OpenAI` client with the MixRoute base
  URL and `maxRetries: 0`, because retries multiply cost on a paid gateway.

| Task | Model id | Path |
|---|---|---|
| Idea text, structured | `gpt-4o-mini-2024-07-18` | `{base}/chat/completions` |
| Category choice | `gpt-4o-mini-2024-07-18` | `{base}/chat/completions` |
| Card illustration | `gemini-2.5-flash-image` | `{base}/models/{id}:generateContent` |

Keep model ids in the constants in `mixroute.ts`.

## Structured text

- Use `client.chat.completions.parse` with
  `response_format: zodResponseFormat(schema, name)` from `openai/helpers/zod`.
  It builds a strict JSON Schema from Zod and validates the reply with the same
  schema, including `refine`.
- Reuse schemas from `lib/config/ideas.ts`. Never redefine a shape in
  `lib/ai/`.
- Strict mode needs every property required and `additionalProperties: false`.
  `zodResponseFormat` handles both. Optional fields must be `.nullable()`.
- Read results through `readParsedOutput`, which throws on `refusal` and on a
  missing `parsed` value. `.parse()` itself throws when the reply was cut off
  by length or a content filter.
- System rules go in the `system` message. User data goes in the `user`
  message, and the system prompt says to treat it as data.

## Gemini images

- `fetch` POST to `{base}/models/gemini-2.5-flash-image:generateContent` with
  `Authorization: Bearer <key>`.
- Body: `contents` with one user text part, and `generationConfig` with
  `responseModalities: ["IMAGE"]` and `imageConfig.aspectRatio: "5:4"`. The card
  image area is 475:390, so 5:4 is the closest supported ratio.
- Validate the response with `geminiImageResponseSchema` via `safeParse`, then
  take the first `candidates[].content.parts[].inlineData`.
- Gemini returns PNG. `IDEA_IMAGE_MEDIA_TYPE` and `IDEA_IMAGE_FILE_EXTENSION` in
  `lib/config/ideas.ts` are the single source for the image type. Reject any
  other `mimeType`. Never hardcode an image type elsewhere.

## Errors

- A non-2xx response throws with the status and body so server logs show the
  gateway's reason, for example `insufficient_user_quota`.
- Routes map these failures to 502 and invalid input to 400. They never forward
  provider messages or keys to the client.
- Only the image prompt length check throws with a `ZodError` cause. The image
  route relies on that to return 400. Parse gateway responses with `safeParse`
  and throw plain errors, so they are not mistaken for bad input.

## Checklist before changing AI code

1. Model ids come from the constants, env values from the getters.
2. Output is validated by a Zod schema from `lib/config/`.
3. User text is marked as data in the system prompt.
4. The route maps errors to proper status codes.
5. Every `lib/ai/` file starts with `import "server-only"`.
