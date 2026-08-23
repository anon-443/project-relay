import { TRPCError } from "@trpc/server";

export function requireOwnedProject(projectClientId: number, currentUserId: number) {
  if (projectClientId !== currentUserId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "You can manage only projects posted by your client account." });
  }
}

export function requireProposalTarget(projectClientId: number, freelancerId: number, currentUserId: number, projectStatus: "open" | "closed" | "completed") {
  if (projectClientId === currentUserId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "You cannot submit a proposal to your own project." });
  }
  if (freelancerId !== currentUserId || projectStatus !== "open") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "This project is not open for a proposal from this account." });
  }
}

export function requireCompletedEngagement(proposalStatus: "submitted" | "accepted" | "rejected" | "completed") {
  if (proposalStatus !== "completed") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Verified feedback can be submitted only after a completed engagement." });
  }
}
