import { describe, expect, it } from "vitest";
import { buildProjectDescriptionPrompt, parseGeneratedProjectDescription } from "./projectDescription";

describe("project description helper", () => {
  it("builds a prompt with all of the client-provided brief context", () => {
    const prompt = buildProjectDescriptionPrompt({
      title: "Redesign a supplier portal",
      category: "Product design",
      goal: "Make complex orders easier to manage.",
      skills: "Figma, research",
      tone: "Clear and practical",
    });

    expect(prompt).toContain("Redesign a supplier portal");
    expect(prompt).toContain("Make complex orders easier to manage.");
    expect(prompt).toContain("Figma, research");
  });

  it("parses a complete structured response and limits deliverables", () => {
    const result = parseGeneratedProjectDescription(JSON.stringify({
      description: "Create a focused supplier portal redesign that makes order visibility and account management easier for operational teams.",
      deliverables: ["Flow map", "Responsive prototype", "UI kit", "Handoff notes", "Extra", "Ignored"],
    }));

    expect(result.description).toContain("supplier portal");
    expect(result.deliverables).toHaveLength(5);
  });

  it("rejects incomplete responses", () => {
    expect(() => parseGeneratedProjectDescription(JSON.stringify({ description: "Too short", deliverables: [] }))).toThrow("incomplete");
  });
});
