import { renderHook } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { useCategoryLabel } from "./use-category-label";

// A Russian message set proves the label is translated, not just echoed back
// as the English key.
function RussianCategories({ children }: { children: ReactNode }): ReactNode {
  return (
    <NextIntlClientProvider
      locale="ru"
      messages={{
        Categories: { Science: "Наука", "Self-Care": "Забота о себе" },
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}

function categoryLabel(): (category: string) => string {
  return renderHook(useCategoryLabel, { wrapper: RussianCategories }).result
    .current;
}

describe("useCategoryLabel", () => {
  it.each([
    ["Science", "Наука"],
    ["Self-Care", "Забота о себе"],
  ])("translates the stored key %s", (category, expected) => {
    expect(categoryLabel()(category)).toBe(expected);
  });

  it("shows a category without a message as stored", () => {
    expect(categoryLabel()("Retired Category")).toBe("Retired Category");
  });
});
