import { describe, expect, it } from "vitest";
import { filterAndSortPortfolio } from "./portfolio";

const samples = [
  { title: "Zeta", type: "Design system", year: 2024 },
  { title: "Alpha", type: "Product experience", year: 2026 },
  { title: "Beta", type: "Product experience", year: 2025 },
];

describe("portfolio evidence index", () => {
  it("filters artifacts by client-selected discipline", () => {
    expect(filterAndSortPortfolio(samples, "Product experience", "Most recent").map((item) => item.title)).toEqual(["Alpha", "Beta"]);
  });

  it("sorts the visible evidence alphabetically", () => {
    expect(filterAndSortPortfolio(samples, "All evidence", "Title A–Z").map((item) => item.title)).toEqual(["Alpha", "Beta", "Zeta"]);
  });
});
