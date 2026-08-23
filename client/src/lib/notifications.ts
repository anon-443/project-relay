/** Notification-ledger helpers preserve a small, predictable set of alert controls. */
export type NotificationLike = { unread: boolean };

export function filterNotificationLedger<T extends NotificationLike>(items: T[], filter: "All activity" | "Unread only"): T[] {
  return filter === "Unread only" ? items.filter((item) => item.unread) : items;
}
