/** Server-side prompt and validation helpers for profile skill suggestions grounded in portfolio evidence. */
export type PortfolioEvidenceInput = { title: string; type: string; detail: string };
export type GeneratedSkillTags = { tags: string[] };

export function buildSkillTagPrompt(evidence: PortfolioEvidenceInput[]) {
  const compactEvidence = evidence.map((item, index) => `${index + 1}. ${item.title} — ${item.type}: ${item.detail}`).join("\n");
  return `Suggest focused professional skill tags for a freelancer profile from the portfolio evidence below.\n\n${compactEvidence}\n\nReturn 4 to 8 concise, market-relevant skill tags. Every tag must be supported by the evidence. Do not invent credentials, certifications, client names, ratings, reviews, employers, tools not mentioned, or unsupported expertise. Return only the requested JSON schema.`;
}

export function parseGeneratedSkillTags(content: string): GeneratedSkillTags {
  const parsed: unknown = JSON.parse(content);
  if (!parsed || typeof parsed !== "object") throw new Error("The AI response was not a valid object.");
  const tags = Array.isArray((parsed as { tags?: unknown }).tags) ? (parsed as { tags: unknown[] }).tags : [];
  const clean = Array.from(new Set(tags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter((tag) => tag.length >= 2 && tag.length <= 42))).slice(0, 8);
  if (clean.length < 3) throw new Error("The AI response did not include enough usable skill tags. Please try again.");
  return { tags: clean };
}
