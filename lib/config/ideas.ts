import { z } from "zod";

export const MAX_IDEAS_PER_PACK = 10;

export const generatedIdeaSchema = z.object({
  title: z.string().trim().min(1).describe("Short title of the idea."),
  description: z
    .string()
    .trim()
    .min(1)
    .describe("Concise, actionable description of the idea."),
});

export const generatedIdeasSchema = z.object({
  ideas: z.array(generatedIdeaSchema).min(1).max(MAX_IDEAS_PER_PACK),
});

export const generatedImageSchema = z.object({
  image: z.base64().min(1),
});

export const ideaResponseSchema = generatedIdeaSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime().transform((value) => new Date(value)),
});

export const ideasResponseSchema = z.object({
  ideas: z.array(ideaResponseSchema).min(1).max(MAX_IDEAS_PER_PACK),
});
