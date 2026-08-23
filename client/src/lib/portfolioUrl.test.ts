import { describe, expect, it } from "vitest";
import { buildPortfolioViewSearch, readPortfolioView } from "./portfolioUrl";

describe("shareable portfolio views", () => {
  const filters = ["All evidence", "Product experience", "Design system"];
  it("reads valid filter and sort values from a URL", () => {
    expect(readPortfolioView("?discipline=Design+system&sort=Title+A%E2%80%93Z", filters)).toEqual({ filter: "Design system", sort: "Title A–Z" });
  });
  it("writes only non-default view state", () => {
    expect(buildPortfolioViewSearch({ filter: "Product experience", sort: "Most recent" })).toBe("?discipline=Product+experience");
  });
});
