import { describe, expect, it } from "vitest";
import { calculateDashboardMetrics, formatCurrency } from "./dashboardMetrics";

describe("freelancer performance metrics", () => {
  it("derives proposal, project, contracted-value, and earnings-change summaries", () => {
    expect(calculateDashboardMetrics([{}, {}, {}], [{ value: 3200 }, { value: 4800 }], [{ value: 3200 }, { value: 4100 }])).toEqual({ activeProposals: 3, ongoingProjects: 2, contractedValue: 8000, currentEarnings: 4100, earningsChange: 28 });
  });
  it("formats currency for ledger display", () => expect(formatCurrency(4800)).toBe("$4,800"));
});
