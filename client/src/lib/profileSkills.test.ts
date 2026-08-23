import { describe, expect, it } from "vitest";
import { acceptSuggestedSkill } from "./profileSkills";

describe("AI profile-skill acceptance", () => {
  it("moves an accepted suggestion into the profile skill list and removes it from review", () => {
    expect(acceptSuggestedSkill(["Figma"], ["Interaction design", "Information architecture"], "Interaction design")).toEqual({ profileSkills: ["Figma", "Interaction design"], suggestedSkills: ["Information architecture"] });
  });
});
