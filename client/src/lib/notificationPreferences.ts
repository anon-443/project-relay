/** Notification preference helpers provide a stable browser-persisted settings shape. */
export type AlertPreference = "In-app" | "Muted";
export type NotificationPreferences = { proposals: AlertPreference; messages: AlertPreference; system: AlertPreference };
export const defaultNotificationPreferences: NotificationPreferences = { proposals: "In-app", messages: "In-app", system: "In-app" };

export function normalizeNotificationPreferences(value: unknown): NotificationPreferences {
  const candidate = value && typeof value === "object" ? value as Partial<NotificationPreferences> : {};
  const normalize = (item: unknown): AlertPreference => item === "Muted" ? "Muted" : "In-app";
  return { proposals: normalize(candidate.proposals), messages: normalize(candidate.messages), system: normalize(candidate.system) };
}

export function shouldCreateInAppAlert(preferences: NotificationPreferences, type: "message" | "proposal"): boolean {
  return type === "message" ? preferences.messages === "In-app" : preferences.proposals === "In-app";
}
