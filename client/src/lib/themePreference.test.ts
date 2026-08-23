import { describe, expect, it } from "vitest";
import { normalizeThemePreference } from "./themePreference";
describe("theme preference", () => { it("allows only the supported theme values", () => { expect(normalizeThemePreference("dark")).toBe("dark"); expect(normalizeThemePreference("system")).toBe("light"); }); });
