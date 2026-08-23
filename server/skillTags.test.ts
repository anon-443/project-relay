import { describe, expect, it } from "vitest";
import { buildSkillTagPrompt, parseGeneratedSkillTags } from "./skillTags";

describe("profile skill-tag assistant", () => {
  it("creates an evidence-grounded prompt", () => {
    expect(buildSkillTagPrompt([{ title: "Checkout", type: "Product experience", detail: "Simplified payment confirmation." }])).toContain("Checkout");
  });

  it("deduplicates and validates returned tags", () => {
    expect(parseGeneratedSkillTags('{"tags":["Mobile UX","Mobile UX","Interface design","User research"]}')).toEqual({ tags: ["Mobile UX", "Interface design", "User research"] });
  });
});
