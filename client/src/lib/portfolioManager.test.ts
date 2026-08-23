import { describe, expect, it } from "vitest";
import { movePortfolioItem, removePortfolioItem } from "./portfolioManager";

const records = [{ id: "one" }, { id: "two" }, { id: "three" }];
describe("portfolio workbench ordering", () => {
  it("moves a dragged item to its selected target", () => expect(movePortfolioItem(records, "one", "three").map((item) => item.id)).toEqual(["two", "three", "one"]));
  it("removes an evidence item by id", () => expect(removePortfolioItem(records, "two").map((item) => item.id)).toEqual(["one", "three"]));
});
