---
name: mixroute
description: Image generation through MixRoute's Gemini-native API, currently disconnected. Use only before touching generateImages in lib/ai/generate-ideas.ts, lib/ai/mixroute.ts, or the /api/ideas/image route. Text generation lives in the openrouter skill.
---

# MixRoute (images only, disconnected)

Status (2026-10-01): text generation moved to OpenRouter. MixRoute code remains
only for `generateImages`, which is expected to fail until the user moves image
generation to a new provider. Dive cards show the icon fallback meanwhile. Do
not change image code until the user resumes that work.

## What is left

- `lib/ai/mixroute.ts`: `IDEA_IMAGE_MODEL_ID` (`gemini-2.5-flash-image`) and the
  `getMixrouteBaseUrl()` / `getMixrouteApiKey()` env getters for
  `MIXROUTE_API_BASE_URL` and `MIXROUTE_API_KEY`.
- `generateImages` in `lib/ai/generate-ideas.ts`: `fetch` POST to
  `{base}/models/{id}:generateContent` with `Authorization: Bearer`,
  `responseModalities: ["IMAGE"]` and `imageConfig.aspectRatio: "5:4"`.

## History

- MixRoute structured output returned `400 'additionalProperties' is required
  ... In context=()` even though the schema had the flag at the root.
- A valid request also returned `403 insufficient_user_quota`.

## Image rules that still apply

- Images are PNG end to end. `IDEA_IMAGE_MEDIA_TYPE` and
  `IDEA_IMAGE_FILE_EXTENSION` in `lib/config/ideas.ts` are the single source.
- Only the image prompt length check throws with a `ZodError` cause; the image
  route maps that to 400. Everything else maps to 502.
