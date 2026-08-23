export const githubPagesConfig = {
  fullAppUrl: "https://orbitfolio-fbbkuhat.manus.space",
  sourceUrl: "https://github.com/anon-443/project-rely",
  pagesUrl: "https://anon-443.github.io/project-rely/",
} as const;

export function githubPagesAsset(filename: string): string {
  return new URL(`/manus-storage/${filename}`, githubPagesConfig.fullAppUrl).toString();
}
