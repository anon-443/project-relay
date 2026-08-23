import { describe, expect, it } from "vitest";
import { githubPagesAsset, githubPagesConfig } from "./githubPages";

describe("GitHub Pages static-demo configuration", () => {
  it("uses the expected public GitHub Pages path", () => {
    expect(githubPagesConfig.pagesUrl).toBe("https://anon-443.github.io/project-rely/");
  });

  it("resolves portfolio artwork through the hosted application", () => {
    expect(githubPagesAsset("project-relay-hero-workroom_d5d6ef3d.jpg")).toBe(
      "https://orbitfolio-fbbkuhat.manus.space/manus-storage/project-relay-hero-workroom_d5d6ef3d.jpg",
    );
  });
});
