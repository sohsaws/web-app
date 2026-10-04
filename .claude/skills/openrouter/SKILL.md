---
name: openrouter
description: How this project generates idea text and chooses categories through OpenRouter with `@openrouter/sdk` and structured outputs. Use before changing lib/ai/generate-ideas.ts, lib/ai/openrouter.ts, lib/ai/structured-output.ts, the /api/ideas/generate route, prompts, or the Zod schemas sent as response formats.
---

# OpenRouter text generation

Decision (2026-10-01): idea text and category choice go through OpenRouter.
Image generation is not on OpenRouter yet; see the mixroute skill.

## Docs

- SDK: https://openrouter.ai/docs/client-sdks/typescript/overview
- Structured outputs: https://openrouter.ai/docs/guides/features/structured-outputs
- Installed types: `node_modules/@openrouter/sdk/esm/models/chatrequest.d.ts`,
  `chatjsonschemaconfig.d.ts`, `providerpreferences.d.ts`, and
  `operations/sendchatcompletionrequest.d.ts`.

## Rules

- Use the SDK types. Do not hand-write Request or Response types; the user
  decided this on 2026-10-01.
- Client: `createOpenRouterClient()` in `lib/ai/openrouter.ts`, key from
  `OPENROUTER_API_KEY`, which throws a clear error when missing. Never open
  `.env` files.
- Model: `IDEA_TEXT_MODEL_ID` (`qwen/qwen3.8-27b:free`). Change the constant,
  not call sites.
- Call shape: `openRouter.chat.send({ chatRequest: { ... } })`. The SDK uses
  camelCase (`responseFormat`, `jsonSchema`, `requireParameters`) and converts
  to the API's snake_case itself.
- Always pass `provider: { requireParameters: true }` so OpenRouter only routes
  to providers that honor `responseFormat`.
- No `httpReferer` or `appTitle` until production.

## Structured output

- Keep it inline and minimal; the user rejected helper functions for this on
  2026-10-02. Pass `responseFormat: { type: "json_schema", jsonSchema: { name,
  strict: true, schema: z.toJSONSchema(zodSchema) } }`.
- `z.object` emits `additionalProperties: false`, which strict mode requires.
  Avoid `z.looseObject` and `z.record` in response schemas.
- Read the reply: narrow with `"choices" in response` (the SDK types it as a
  union with streams), take `choices[0]?.message.content`, require a string,
  then `zodSchema.parse(JSON.parse(content))`. Keep the Zod check; model output
  is untrusted data.
- Reuse schemas from `lib/config/ideas.ts`; never redefine shapes in `lib/ai/`.
- System rules go in the system message, user data in the user message, and
  the system prompt says to treat user data as data.

## Errors

- The generate route maps every failure to 502 and never forwards provider
  messages to the client.
