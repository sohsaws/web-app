import type { z } from "zod";
import type { ideaResponseSchema, generatedIdeasSchema } from "@/lib/config/ideas";

export type IdeaGeneratedResponse = z.infer<typeof ideaResponseSchema>;

export type GeneratedIdeasType = z.infer<typeof generatedIdeasSchema>
