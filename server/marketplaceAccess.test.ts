import { describe, expect, it } from "vitest";
import { requireCompletedEngagement, requireOwnedProject, requireProposalTarget } from "./marketplaceAccess";

describe("persistent marketplace access rules", () => {
  it("limits project management to the posting client", () => {
    expect(() => requireOwnedProject(4, 4)).not.toThrow();
    expect(() => requireOwnedProject(4, 7)).toThrow("projects posted by your client account");
  });

  it("blocks self-proposals and closed projects", () => {
    expect(() => requireProposalTarget(4, 7, 7, "open")).not.toThrow();
    expect(() => requireProposalTarget(4, 4, 4, "open")).toThrow("own project");
    expect(() => requireProposalTarget(4, 7, 7, "closed")).toThrow("not open");
  });

  it("allows verified feedback only after completion", () => {
    expect(() => requireCompletedEngagement("completed")).not.toThrow();
    expect(() => requireCompletedEngagement("accepted")).toThrow("completed engagement");
  });
});
