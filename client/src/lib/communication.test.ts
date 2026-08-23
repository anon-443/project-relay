import { describe, expect, it } from "vitest";
import { canSendMessage, createFilePreview, createOutgoingMessage, markOutgoingMessagesRead } from "./communication";

describe("marketplace communication helpers", () => {
  it("creates an attachment-only message with a meaningful fallback body", () => {
    const message = createOutgoingMessage(7, "", "flow-recording.mov");
    expect(message).toMatchObject({ attachment: "flow-recording.mov", body: "Shared a project attachment.", status: "Delivered", mine: true });
  });

  it("marks only the current user's delivered messages as read", () => {
    const messages = [
      { mine: true, status: "Delivered" as const },
      { mine: false, status: "Delivered" as const },
      { mine: true, status: "Read" as const },
    ];
    expect(markOutgoingMessagesRead(messages).map((message) => message.status)).toEqual(["Read", "Delivered", "Read"]);
  });

  it("allows a send only when a message body or attachment is supplied", () => {
    expect(canSendMessage("  ", null)).toBe(false);
    expect(canSendMessage("A project update", null)).toBe(true);
    expect(canSendMessage("", "brief.pdf")).toBe(true);
  });

  it("creates useful pre-send metadata for an attached image", () => {
    expect(createFilePreview({ name: "prototype.png", size: 1536, type: "image/png" })).toEqual({ name: "prototype.png", typeLabel: "PNG", sizeLabel: "2 KB", isImage: true });
  });
});
