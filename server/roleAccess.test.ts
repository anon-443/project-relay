import { describe, expect, it } from "vitest";
import { marketplaceRoleSchema, requireMarketplaceRole } from "./roleAccess";

describe("marketplace role access", () => {
  it("accepts only client and freelancer selection values", () => {
    expect(marketplaceRoleSchema.parse("client")).toBe("client");
    expect(() => marketplaceRoleSchema.parse("admin")).toThrow();
  });
  it("blocks a mismatched role from a role-specific workspace", () => {
    expect(requireMarketplaceRole("freelancer", "freelancer")).toBe(true);
    expect(() => requireMarketplaceRole("client", "freelancer")).toThrow("freelancer accounts only");
  });
});
