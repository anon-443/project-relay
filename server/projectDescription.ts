export type ProjectDescriptionInput = {
  title: string;
  category: string;
  goal: string;
  skills: string;
  tone: string;
};

export type GeneratedProjectDescription = {
  description: string;
  deliverables: string[];
};

export function buildProjectDescriptionPrompt(input: ProjectDescriptionInput) {
  return `Write a concise, professional freelance project description for a marketplace listing.

Project title: ${input.title}
Category: ${input.category}
Client goal: ${input.goal}
Required skills: ${input.skills || "Not specified"}
Tone: ${input.tone}

The description must be concrete, specific, and suitable for independent specialists. Explain the outcome, intended scope, and what success looks like. Do not invent metrics, a client name, credentials, customer reviews, or confidential details. Return only the requested JSON schema.`;
}

export function parseGeneratedProjectDescription(content: string): GeneratedProjectDescription {
  const parsed: unknown = JSON.parse(content);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("The AI response was not a valid object.");
  }

  const value = parsed as { description?: unknown; deliverables?: unknown };
  const description = typeof value.description === "string" ? value.description.trim() : "";
  const deliverables = Array.isArray(value.deliverables)
    ? value.deliverables.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 5)
    : [];

  if (description.length < 30 || deliverables.length === 0) {
    throw new Error("The AI response was incomplete. Please try again.");
  }

  return { description, deliverables };
}
