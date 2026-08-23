/** Portfolio workbench helpers keep drag/drop ordering and local item management deterministic. */
export type ManagedPortfolioItem = { id: string; title: string; type: string; preview: string; local?: boolean };

export function movePortfolioItem<T extends { id: string }>(items: T[], sourceId: string, targetId: string): T[] {
  const sourceIndex = items.findIndex((item) => item.id === sourceId);
  const targetIndex = items.findIndex((item) => item.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return items;
  const next = [...items];
  const [source] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, source);
  return next;
}

export function removePortfolioItem<T extends { id: string }>(items: T[], id: string): T[] { return items.filter((item) => item.id !== id); }
