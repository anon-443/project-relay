/** Evidence-index helpers for client-facing freelancer portfolio controls. */
export type PortfolioSort = "Most recent" | "Title A–Z" | "By discipline";

export type PortfolioRecord = { title: string; type: string; year: number };

export function filterAndSortPortfolio<T extends PortfolioRecord>(items: T[], filter: string, sort: PortfolioSort): T[] {
  const filtered = filter === "All evidence" ? items : items.filter((item) => item.type === filter);
  return [...filtered].sort((a, b) => {
    if (sort === "Title A–Z") return a.title.localeCompare(b.title);
    if (sort === "By discipline") return a.type.localeCompare(b.type) || b.year - a.year;
    return b.year - a.year;
  });
}
