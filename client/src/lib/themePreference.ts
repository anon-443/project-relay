/** Theme preference helper validates a browser-persisted color-mode value. */
export type StoredTheme = "light" | "dark";
export function normalizeThemePreference(value: unknown): StoredTheme { return value === "dark" ? "dark" : "light"; }
