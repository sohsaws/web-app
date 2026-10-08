---
name: deepinfra
description: How this project generates idea text, chooses categories, and generates card images through DeepInfra with the official `openai` client. Use before changing anything in lib/ai/, the /api/ideas/generate or /api/ideas/image routes, prompts, structured output schemas, image generation, or the future For you agent (tool calling).
---

# DeepInfra (all AI since 2026-10-05)

DeepInfra replaced MixRoute and OpenRouter for both text and images. The user
chose it for price and quality: paid prepaid account, `DEEPINFRA_API_KEY`.

## Always read the docs first

APIs and model ids change. Before writing or changing AI code, re-read the
relevant page. The docs moved to `docs.deepinfra.com` (old `deepinfra.com/docs`
URLs redirect or refuse connections).

- Chat / OpenAI-compatible setup: https://docs.deepinfra.com/chat/overview
- Structured outputs: https://docs.deepinfra.com/chat/structured-outputs
- Tool calling: https://docs.deepinfra.com/chat/tool-calling
- Image generation: https://docs.deepinfra.com/apis/image-generation and
  https://docs.deepinfra.com/api-reference/image-generation/openai-images-generations
- Model pages with pricing: `https://deepinfra.com/<model-id>/api`
- Installed client types: `node_modules/openai/helpers/zod.d.ts`,
  `node_modules/openai/resources/images.d.ts`.

## Setup (`lib/ai/deepinfra.ts`)

- `createDeepInfraClient()` returns `new OpenAI({ apiKey, baseURL:
  "https://api.deepinfra.com/v1/openai", maxRetries: 0 })`. Retries multiply
  cost on a paid API.
- The key comes only from `process.env.DEEPINFRA_API_KEY`, with a clear error
  when missing. Never open `.env` files.
- Model ids are constants there: `IDEA_TEXT_MODEL_ID` and
  `IDEA_IMAGE_MODEL_ID`. Change constants, not call sites. The user switches
  models without notice, so read the file for the current values instead of
  trusting this list. As of 2026-10-08: text `deepseek-ai/DeepSeek-V4.1-Flash`,
  image `Qwen/Qwen-Image-Edit-Max`.

## Structured text

- Use `client.chat.completions.parse` with
  `response_format: zodResponseFormat(zodSchema, name)`. DeepInfra documents
  `json_schema` with `strict: true`; `parse` validates the reply with the same
  Zod schema and throws on length or content-filter cut-offs.
- Read `completion.choices[0]?.message.parsed` and throw if it is missing.
  Keep it inline; the user rejected extra helper functions (2026-10-02).
- Reuse schemas from `lib/config/ideas.ts`. Strict mode needs every object to
  be closed; `z.object` does that. Avoid `z.looseObject` and `z.record`.
- Docs warn that forced JSON can make models invent values instead of saying
  "I don't know". Keep prompts explicit and treat user text as data.
- Not yet verified live: whether DeepInfra accepts the `$schema` key that
  `zodResponseFormat` adds, and the 100-value category enum.

## Deck generation flow (`POST /api/ideas/generate`)

A deck is `1 + MAX_IDEAS_PER_PACK × 2` text calls (21 with the current
`MAX_IDEAS_PER_PACK = 10` in `lib/config/ideas.ts`). Derive the count from the
constant; never hardcode 21.

1. `generateIdeas(bio)`: one call returns all titles and descriptions.
2. `assignIdeaCategories(ideas)`: two calls per idea, by the user's choice
   (2026-10-05). Inside one idea the calls are **sequential**, because the
   second call chooses from the categories left after the first
   (`categorizeIdea`). Across ideas they run **in parallel** with
   `Promise.all(ideas.map(categorizeIdea))` (2026-10-08), so the wait is about
   3 calls deep instead of 21. Do not turn it back into a sequential loop.
- `Promise.all` keeps the input order and rejects on the first failure; the
  route then answers 502 and the client shows "Try again". Requests already
  sent still finish and are billed.
- DeepInfra allows **200 concurrent requests per model** per account and
  answers HTTP 429 above that
  (https://docs.deepinfra.com/account/rate-limits.md). One deck opens at most
  `MAX_IDEAS_PER_PACK` concurrent requests, so about 20 users generating at the
  same moment reach the limit. Add a concurrency cap (for example `p-limit`)
  or a retry on 429 before that becomes realistic.
- The route returns one JSON body at the end, so the client cannot show real
  progress. A streamed NDJSON progress bar was discussed and postponed by the
  user (2026-10-08); the UI keeps a spinner.

## Images

- `client.images.generate({ model, prompt, size: "1024x1024", n: 1,
  response_format: "b64_json" })`; read `response.data?.[0]?.b64_json`.
- Only `1024x1024` is documented for FLUX; the card crops with `object-cover`.
- **Never send the idea description to the image model.** FLUX renders prompt
  text as garbled typography on the image (seen 2026-10-05). `generateImages`
  first calls `describeImageScene` (text model, structured `{ scene }`, 40–70
  wordless words), then sends scene + `IDEA_IMAGE_STYLE`. Extra cost per image
  is a fraction of a cent.
- Image model prices on DeepInfra at 1024x1024 (2026-10-05): FLUX-2-klein-4b
  $0.014, FLUX-2-klein-9b $0.015, FLUX-2-pro $0.015, Seedream-4.5 $0.04,
  FLUX-2-max $0.07, PrunaAI p-image $0.005. The user judged FLUX-2-dev and
  klein-4b quality poor. The current model is whatever `IDEA_IMAGE_MODEL_ID`
  says; the user sets it.
- Price for FLUX-2-dev: `$0.01 × (w/1024) × (h/1024) × (iters/28)`, so about
  $0.01 per image. Images cost far more than text; prefer generating only what
  the user will see.

## Tool calling (for the future For you agent)

- OpenAI-compatible `tools` + `tool_choice` (`"auto"` or `"none"`), single and
  parallel calls, multi-turn with `role: "tool"` messages, streaming works,
  nested calls are not supported.
- **No built-in web search.** Implement search as our own tool backed by a
  search API (Tavily, Brave, Exa), which also makes the link grounding check
  easy. Cap the loop rounds.
- Use a capable model (DeepSeek-V4-Flash, Qwen 3, Llama 3.3 70B); small 8B
  models handle multi-step tools poorly. Write detailed tool descriptions.

## Errors

- Routes map AI failures to 502 and invalid input to 400. Only the image prompt
  length check throws with a `ZodError` cause, which the image route maps to
  400. Never forward provider messages or keys to the client.
- Log caught errors with `console.error` and a short context prefix, for
  example `console.error("Idea generation failed:", error)`. Never use
  `console.log` for errors, and never log generated images, prompts with user
  data, or API keys.

## Budget

- The user funds the account with small prepaid amounts ($5 at the start).
  Recommend a spending limit in the DeepInfra dashboard.
- A deck is 21 text calls (~10k in / 2k out tokens): about $0.0013 on
  DeepSeek-V4-Flash at 2026-10-05 prices. Ten FLUX-2-dev images added about
  $0.10. Both models have since been replaced; re-check the current models'
  prices on `https://deepinfra.com/<model-id>/api` before quoting costs.
