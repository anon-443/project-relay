export type CategorizedBrief = { category: string };

export function countCategoryBriefs<T extends CategorizedBrief>(briefs: readonly T[], category: string): number {
  return briefs.filter((brief) => brief.category === category).length;
}

export function formatBriefCount(count: number): string {
  return `${count} ${count === 1 ? "brief" : "briefs"}`;
}
