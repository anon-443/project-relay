import { TRPCError } from "@trpc/server";
import { z } from "zod";

/** Marketplace role primitives are shared by the protected tRPC account procedures and their tests. */
export const marketplaceRoleSchema = z.enum(["client", "freelancer"]);
export type MarketplaceRole = z.infer<typeof marketplaceRoleSchema>;

export function requireMarketplaceRole(actualRole: string, expectedRole: MarketplaceRole) {
  if (actualRole !== expectedRole) throw new TRPCError({ code: "FORBIDDEN", message: `This workspace is available to ${expectedRole} accounts only.` });
  return true;
}
