import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({ setMarketplaceRole: vi.fn() }));
vi.mock("./db", () => ({ setMarketplaceRole: mocks.setMarketplaceRole }));
import { appRouter } from "./routers";

function context(role: "user" | "client" | "freelancer" | "admin" | null): TrpcContext {
  return { user: role ? { id: 7, openId: "role-test", name: "Role Test", email: "role@test.example", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } : null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("account role procedures", () => {
  it("exposes no account for signed-out callers and the expected role for authenticated callers", async () => {
    await expect(appRouter.createCaller(context(null)).auth.me()).resolves.toBeNull();
    await expect(appRouter.createCaller(context("client")).auth.me()).resolves.toMatchObject({ role: "client", openId: "role-test" });
  });
  it("persists an authenticated user’s client/freelancer selection through the protected procedure", async () => {
    mocks.setMarketplaceRole.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.account.selectMarketplaceRole("freelancer")).resolves.toEqual({ role: "freelancer" });
    expect(mocks.setMarketplaceRole).toHaveBeenCalledWith(7, "freelancer");
  });
  it("allows matching role workspaces and blocks mismatched roles", async () => {
    const freelancer = appRouter.createCaller(context("freelancer"));
    await expect(freelancer.account.freelancerWorkspace()).resolves.toMatchObject({ role: "freelancer" });
    await expect(freelancer.account.clientWorkspace()).rejects.toThrow("client accounts only");
  });
  it("denies an unauthenticated role-selection request", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.account.selectMarketplaceRole("client")).rejects.toThrow("Please login");
  });
});
