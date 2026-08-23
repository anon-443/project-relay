/** Marketplace communication helpers keep client-side mock state deterministic and testable. */
export type OutgoingMessage = {
  id: number;
  sender: string;
  initials: string;
  body: string;
  time: string;
  mine: true;
  attachment?: string;
  status: "Delivered" | "Read";
};

export function createOutgoingMessage(id: number, body: string, attachment: string | null): OutgoingMessage {
  return {
    id,
    sender: "You",
    initials: "YOU",
    body: body.trim() || "Shared a project attachment.",
    time: "Now",
    mine: true,
    attachment: attachment || undefined,
    status: "Delivered",
  };
}

export function markOutgoingMessagesRead<T extends { mine?: boolean; status?: "Delivered" | "Read" }>(messages: T[]): T[] {
  return messages.map((message) => message.mine && message.status === "Delivered" ? { ...message, status: "Read" } : message);
}

export function canSendMessage(body: string, attachment: string | null): boolean {
  return Boolean(body.trim() || attachment);
}
