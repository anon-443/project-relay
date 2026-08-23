/** Performance-sheet helpers derive visible freelancer metrics from current proposal, project, and payout records. */
export type MetricProject = { value: number };
export type MetricEarning = { value: number };

export function formatCurrency(value: number) { return `$${value.toLocaleString("en-US")}`; }

export function calculateDashboardMetrics(proposals: unknown[], projects: MetricProject[], earnings: MetricEarning[]) {
  const currentEarnings = earnings.at(-1)?.value ?? 0;
  const previousEarnings = earnings.at(-2)?.value ?? 0;
  const earningsChange = previousEarnings ? Math.round(((currentEarnings - previousEarnings) / previousEarnings) * 100) : 0;
  return { activeProposals: proposals.length, ongoingProjects: projects.length, contractedValue: projects.reduce((sum, project) => sum + project.value, 0), currentEarnings, earningsChange };
}
