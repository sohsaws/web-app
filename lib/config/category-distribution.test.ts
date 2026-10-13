import { describe, expect, it } from "vitest";
import { categoryDistributionSchema } from "./category-distribution";

describe("categoryDistributionSchema", () => {
  it("accepts rows from the distribution query", () => {
    const rows = [
      { category: "Travel", percentage: 62.5 },
      { category: "Hiking", percentage: 37.5 },
    ];

    expect(categoryDistributionSchema.parse(rows)).toEqual(rows);
  });

  it("accepts no rows for a user without saved cards", () => {
    expect(categoryDistributionSchema.parse([])).toEqual([]);
  });

  it("accepts a single category at exactly 100 percent", () => {
    expect(
      categoryDistributionSchema.safeParse([
        { category: "Travel", percentage: 100 },
      ]).success,
    ).toBe(true);
  });

  it("trims the category name", () => {
    expect(
      categoryDistributionSchema.parse([
        { category: " Travel ", percentage: 100 },
      ]),
    ).toEqual([{ category: "Travel", percentage: 100 }]);
  });

  it.each([
    ["a blank category", { category: "   ", percentage: 50 }],
    ["a zero percentage", { category: "Travel", percentage: 0 }],
    ["a negative percentage", { category: "Travel", percentage: -5 }],
    ["a percentage over 100", { category: "Travel", percentage: 100.01 }],
    // Postgres numeric values arrive as strings unless cast in SQL.
    ["a percentage as a string", { category: "Travel", percentage: "50" }],
  ])("rejects %s", (_case, row) => {
    expect(categoryDistributionSchema.safeParse([row]).success).toBe(false);
  });
});
