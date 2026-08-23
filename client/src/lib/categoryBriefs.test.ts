import { describe, expect, it } from "vitest";
import { countCategoryBriefs, formatBriefCount } from "./categoryBriefs";

describe("category brief counts", () => {
  it("derives the visible count from the actual category data", () => {
    const briefs = [
      { category: "Product design" },
      { category: "Web development" },
      { category: "Product design" },
    ];

    expect(countCategoryBriefs(briefs, "Product design")).toBe(2);
    expect(countCategoryBriefs(briefs, "UX research")).toBe(0);
  });

  it("uses the singular brief label for one matching project", () => {
    expect(formatBriefCount(1)).toBe("1 brief");
    expect(formatBriefCount(2)).toBe("2 briefs");
  });
});
