import { describe, expect, it } from "vitest";
import { filterNotificationLedger } from "./notifications";

describe("notification ledger filters", () => {
  it("shows only unread alerts when requested", () => {
    const notices = [{ unread: true, id: 1 }, { unread: false, id: 2 }, { unread: true, id: 3 }];
    expect(filterNotificationLedger(notices, "Unread only").map((notice) => notice.id)).toEqual([1, 3]);
  });
});
