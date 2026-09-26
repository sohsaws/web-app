import { z } from "zod";

export const categoryDistributionSchema = z.array(
  z.object({
    category: z.string().trim().min(1),
    percentage: z.number().positive().max(100),
  }),
);

export type CategoryDistribution = z.infer<typeof categoryDistributionSchema>;
