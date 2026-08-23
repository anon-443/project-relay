import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM, listLLMModels } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { setMarketplaceRole } from "./db";
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

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
