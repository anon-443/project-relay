import { describe, expect, it } from "vitest";
import { getNextHeroDemoStep, heroDemoSteps } from "./heroDemo";

describe("hero interaction demo", () => {
  it("cycles through each capability stage and returns to the opening stage", () => {
    expect(heroDemoSteps).toHaveLength(3);
    expect(getNextHeroDemoStep(0)).toBe(1);
    expect(getNextHeroDemoStep(1)).toBe(2);
    expect(getNextHeroDemoStep(2)).toBe(0);
  });
});
