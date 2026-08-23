import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM, listLLMModels } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createMarketplaceProject, createMarketplaceProposal, createMarketplaceReview, getMarketplaceProject, getMarketplaceProposal, getMarketplaceReviewForProposal, listClientMarketplaceProjects, listClientMarketplaceProposals, listFreelancerMarketplaceProposals, listFreelancerMarketplaceReviews, listOpenMarketplaceProjects, setMarketplaceProjectStatus, setMarketplaceProposalStatus, setMarketplaceRole } from "./db";
import { requireCompletedEngagement, requireOwnedProject, requireProposalTarget } from "./marketplaceAccess";
import { buildProjectDescriptionPrompt, parseGeneratedProjectDescription } from "./projectDescription";
import { marketplaceRoleSchema, requireMarketplaceRole } from "./roleAccess";
import { buildSkillTagPrompt, parseGeneratedSkillTags } from "./skillTags";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  account: router({
    selectMarketplaceRole: protectedProcedure.input(marketplaceRoleSchema).mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "admin") throw new Error("Administrator roles are managed separately and cannot be changed from this screen.");
      await setMarketplaceRole(ctx.user.id, input);
      return { role: input };
    }),
    clientWorkspace: protectedProcedure.query(({ ctx }) => {
      requireMarketplaceRole(ctx.user.role, "client");
      return { role: "client" as const, title: "Client workspace", nextAction: "Post a brief or review incoming proposals." };
    }),
    freelancerWorkspace: protectedProcedure.query(({ ctx }) => {
      requireMarketplaceRole(ctx.user.role, "freelancer");
      return { role: "freelancer" as const, title: "Freelancer workspace", nextAction: "Review opportunities, proposals, and your performance sheet." };
    }),
  }),

  projectAssistant: router({
    generateDescription: publicProcedure
      .input(z.object({
        title: z.string().trim().min(3).max(120),
        category: z.string().trim().min(2).max(80),
        goal: z.string().trim().min(12).max(1000),
        skills: z.string().trim().max(300),
        tone: z.string().trim().min(2).max(80),
      }))
      .mutation(async ({ input }) => {
        const { data: models } = await listLLMModels();
        const model = models.find((candidate) => candidate.id === "gpt-5-mini")?.id ?? models[0]?.id;
        if (!model) throw new Error("No AI model is currently available. Please try again shortly.");

        const response = await invokeLLM({
          model,
          messages: [
            { role: "system", content: "You are a careful marketplace copywriter. Return JSON only, matching the requested schema." },
            { role: "user", content: buildProjectDescriptionPrompt(input) },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "project_description",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  description: { type: "string" },
                  deliverables: { type: "array", items: { type: "string" } },
                },
                required: ["description", "deliverables"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message.content;
        if (typeof content !== "string") throw new Error("The AI assistant did not return a usable description. Please try again.");
        return parseGeneratedProjectDescription(content);
      }),
  }),

  profileAssistant: router({
    generateSkillTags: publicProcedure
      .input(z.object({ evidence: z.array(z.object({ title: z.string().trim().min(3).max(120), type: z.string().trim().min(2).max(80), detail: z.string().trim().min(12).max(600) })).min(1).max(8) }))
      .mutation(async ({ input }) => {
        const { data: models } = await listLLMModels();
        const model = models.find((candidate) => candidate.id === "gpt-5-mini")?.id ?? models[0]?.id;
        if (!model) throw new Error("No AI model is currently available. Please try again shortly.");
        const response = await invokeLLM({
          model,
          messages: [{ role: "system", content: "You are a careful portfolio analyst. Return JSON only, matching the requested schema." }, { role: "user", content: buildSkillTagPrompt(input.evidence) }],
          response_format: { type: "json_schema", json_schema: { name: "profile_skill_tags", strict: true, schema: { type: "object", properties: { tags: { type: "array", items: { type: "string" } } }, required: ["tags"], additionalProperties: false } } },
        });
        const content = response.choices[0]?.message.content;
        if (typeof content !== "string") throw new Error("The AI assistant did not return usable skill tags. Please try again.");
        return parseGeneratedSkillTags(content);
      }),
  }),

  marketplace: router({
    listOpenProjects: publicProcedure.query(() => listOpenMarketplaceProjects()),
    listClientProjects: protectedProcedure.query(({ ctx }) => {
      requireMarketplaceRole(ctx.user.role, "client");
      return listClientMarketplaceProjects(ctx.user.id);
    }),
    createProject: protectedProcedure.input(z.object({
      title: z.string().trim().min(5).max(160), category: z.string().trim().min(2).max(80), budget: z.string().trim().min(2).max(80), deadline: z.string().trim().min(2).max(80), description: z.string().trim().min(30).max(5000), skills: z.array(z.string().trim().min(2).max(40)).min(1).max(12),
    })).mutation(({ ctx, input }) => {
      requireMarketplaceRole(ctx.user.role, "client");
      return createMarketplaceProject({ ...input, clientId: ctx.user.id, clientName: ctx.user.name || ctx.user.email || "Client" });
    }),
    listClientProposals: protectedProcedure.query(({ ctx }) => {
      requireMarketplaceRole(ctx.user.role, "client");
      return listClientMarketplaceProposals(ctx.user.id);
    }),
    submitProposal: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), contact: z.string().trim().email().max(320), expectedBudget: z.string().trim().min(2).max(80), coverLetter: z.string().trim().min(30).max(5000) })).mutation(async ({ ctx, input }) => {
      requireMarketplaceRole(ctx.user.role, "freelancer");
      const project = await getMarketplaceProject(input.projectId);
      if (!project) throw new Error("This project is no longer available.");
      requireProposalTarget(project.clientId, ctx.user.id, ctx.user.id, project.status);
      return createMarketplaceProposal({ ...input, freelancerId: ctx.user.id, freelancerName: ctx.user.name || ctx.user.email || "Freelancer" });
    }),
    listFreelancerProposals: protectedProcedure.query(({ ctx }) => {
      requireMarketplaceRole(ctx.user.role, "freelancer");
      return listFreelancerMarketplaceProposals(ctx.user.id);
    }),
    acceptProposal: protectedProcedure.input(z.object({ proposalId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      requireMarketplaceRole(ctx.user.role, "client");
      const proposal = await getMarketplaceProposal(input.proposalId);
      if (!proposal) throw new Error("Proposal not found.");
      const project = await getMarketplaceProject(proposal.projectId);
      if (!project) throw new Error("Project not found.");
      requireOwnedProject(project.clientId, ctx.user.id);
      await setMarketplaceProposalStatus(proposal.id, "accepted");
      await setMarketplaceProjectStatus(project.id, "closed");
      return { success: true };
    }),
    completeProposal: protectedProcedure.input(z.object({ proposalId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      requireMarketplaceRole(ctx.user.role, "client");
      const proposal = await getMarketplaceProposal(input.proposalId);
      if (!proposal) throw new Error("Proposal not found.");
      const project = await getMarketplaceProject(proposal.projectId);
      if (!project) throw new Error("Project not found.");
      requireOwnedProject(project.clientId, ctx.user.id);
      if (proposal.status !== "accepted") throw new Error("Only accepted proposals can be marked complete.");
      await setMarketplaceProposalStatus(proposal.id, "completed");
      await setMarketplaceProjectStatus(project.id, "completed");
      return { success: true };
    }),
    submitVerifiedReview: protectedProcedure.input(z.object({ proposalId: z.number().int().positive(), rating: z.number().int().min(1).max(5), feedback: z.string().trim().min(20).max(2000) })).mutation(async ({ ctx, input }) => {
      requireMarketplaceRole(ctx.user.role, "client");
      const proposal = await getMarketplaceProposal(input.proposalId);
      if (!proposal) throw new Error("Proposal not found.");
      const project = await getMarketplaceProject(proposal.projectId);
      if (!project) throw new Error("Project not found.");
      requireOwnedProject(project.clientId, ctx.user.id);
      requireCompletedEngagement(proposal.status);
      if (await getMarketplaceReviewForProposal(proposal.id)) throw new Error("A verified review has already been submitted for this engagement.");
      return createMarketplaceReview({ projectId: project.id, proposalId: proposal.id, clientId: ctx.user.id, freelancerId: proposal.freelancerId, rating: input.rating, feedback: input.feedback });
    }),
    listMyFreelancerReviews: protectedProcedure.query(({ ctx }) => {
      requireMarketplaceRole(ctx.user.role, "freelancer");
      return listFreelancerMarketplaceReviews(ctx.user.id);
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
