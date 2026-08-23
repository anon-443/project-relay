/** Shareable profile-view state is encoded in the query string without coupling it to the page component. */
import type { PortfolioSort } from "./portfolio";

export type PortfolioViewState = { filter: string; sort: PortfolioSort };
const validSorts: PortfolioSort[] = ["Most recent", "Title A–Z", "By discipline"];

export function readPortfolioView(search: string, allowedFilters: string[]): PortfolioViewState {
  const params = new URLSearchParams(search);
  const filter = params.get("discipline") || "All evidence";
  const rawSort = params.get("sort") as PortfolioSort | null;
  return { filter: allowedFilters.includes(filter) ? filter : "All evidence", sort: rawSort && validSorts.includes(rawSort) ? rawSort : "Most recent" };
}

export function buildPortfolioViewSearch(state: PortfolioViewState): string {
  const params = new URLSearchParams();
  if (state.filter !== "All evidence") params.set("discipline", state.filter);
  if (state.sort !== "Most recent") params.set("sort", state.sort);
  const value = params.toString();
  return value ? `?${value}` : "";
}
