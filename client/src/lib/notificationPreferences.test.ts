import { describe, expect, it } from "vitest";
import { normalizeNotificationPreferences, shouldCreateInAppAlert } from "./notificationPreferences";

describe("notification preference normalization", () => {
  it("keeps valid choices and falls back to in-app delivery", () => {
    expect(normalizeNotificationPreferences({ proposals: "Muted", messages: "Other" })).toEqual({ proposals: "Muted", messages: "In-app", system: "In-app" });
  });

  it("does not create in-app activity for a muted alert type", () => {
    const preferences = normalizeNotificationPreferences({ messages: "Muted", proposals: "In-app" });
    expect(shouldCreateInAppAlert(preferences, "message")).toBe(false);
    expect(shouldCreateInAppAlert(preferences, "proposal")).toBe(true);
  });
});
