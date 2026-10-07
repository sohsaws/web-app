import "server-only";

import {
  type CategoryDistribution,
  categoryDistributionSchema,
} from "@/lib/config/category-distribution";
import prisma from "@/lib/prisma";

export async function getCategoryDistribution(
  userId: string,
): Promise<CategoryDistribution> {
  const rows: unknown = await prisma.$queryRaw`
    WITH category_counts AS (
      SELECT
        item.category,
        COUNT(*) AS occurrences
      FROM "card" AS card
      CROSS JOIN LATERAL unnest(card."category") AS item(category)
      WHERE card."userId" = ${userId}
        AND card."isFavorited" = true
        AND btrim(item.category) <> ''
      GROUP BY item.category
    )
    SELECT
      category,
      (
        100.0 * occurrences / SUM(occurrences) OVER ()
      )::double precision AS percentage
    FROM category_counts
    ORDER BY percentage DESC, category ASC
  `;

  return categoryDistributionSchema.parse(rows);
}
