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

export type FilePreview = { name: string; typeLabel: string; sizeLabel: string; isImage: boolean };

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function createFilePreview(file: { name: string; size: number; type: string }): FilePreview {
  const inferredType = file.type || file.name.split(".").pop()?.toUpperCase() || "FILE";
  return { name: file.name, typeLabel: inferredType.replace("application/", "").replace("image/", "").toUpperCase(), sizeLabel: formatFileSize(file.size), isImage: file.type.startsWith("image/") };
}

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
