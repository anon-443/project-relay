export const fullAppUrl = "https://orbitfolio-fbbkuhat.manus.space";

export function isStaticMirror(): boolean {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/project-rely");
}

export function fullAppHref(path = "/"): string {
  return isStaticMirror() ? new URL(path, fullAppUrl).toString() : path;
}

export function publicAsset(path: string): string {
  return isStaticMirror() ? new URL(path, fullAppUrl).toString() : path;
}
