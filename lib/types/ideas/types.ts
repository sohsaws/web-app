import type { z } from "zod";
import type {
  generatedIdeasSchema,
  generatedImageSchema,
  ideaResponseSchema,
  ideaSaveRequestSchema,
} from "@/lib/config/ideas";

export type IdeaGeneratedResponse = z.infer<typeof ideaResponseSchema>;

export type GeneratedIdeasType = z.infer<typeof generatedIdeasSchema>;

export type GeneratedImage = z.infer<typeof generatedImageSchema>;

export type IdeaSaveRequest = z.infer<typeof ideaSaveRequestSchema>;
