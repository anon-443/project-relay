/** Atelier Ledger design reminder: the conversation panel prioritizes readable status, subtle presence, and practical file context. */
import { CheckCheck, FileText, Image, MessageCircle, Paperclip, Send } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { canSendMessage, createFilePreview, createOutgoingMessage, FilePreview, markOutgoingMessagesRead } from "@/lib/communication";

type ConversationMessage = { id: number; sender: string; initials: string; body: string; time: string; mine?: boolean; attachment?: string; status?: "Delivered" | "Read" };
const starterMessages: ConversationMessage[] = [
  { id: 1, sender: "Mira Nori", initials: "MN", body: "I have mapped the friction points in the mobile flow and added two questions to the project files.", time: "10:14" },
  { id: 2, sender: "Tide & Form", initials: "TF", body: "Thank you. I have also attached the current checkout screen recording for context.", time: "10:17", attachment: "checkout-flow.mov" },
  { id: 3, sender: "Mira Nori", initials: "MN", body: "Perfect. I will share the first prototype direction by Thursday.", time: "10:19" },
];

export function CommunicationPanel({ onIncomingMessage }: { onIncomingMessage?: () => void }) {
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<FilePreview | null>(() => new URLSearchParams(window.location.search).get("previewAttachment") === "1" ? { name: "checkout-flow.pdf", typeLabel: "PDF", sizeLabel: "1.4 MB", isImage: false } : null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if (attachmentUrl) URL.revokeObjectURL(attachmentUrl); }, [attachmentUrl]);
  useEffect(() => { if (new URLSearchParams(window.location.search).get("previewAttachment") === "1") document.getElementById("communication")?.scrollIntoView({ block: "start" }); }, []);

  function clearAttachment() { if (attachmentUrl) URL.revokeObjectURL(attachmentUrl); setAttachment(null); setAttachmentUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }
  function selectAttachment(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; if (attachmentUrl) URL.revokeObjectURL(attachmentUrl); const preview = createFilePreview(file); setAttachment(preview); setAttachmentUrl(preview.isImage ? URL.createObjectURL(file) : null); }
  function sendMessage() {
    const text = draft.trim(); const attachmentName = attachment?.name || null;
    if (!canSendMessage(text, attachmentName)) return;
    setMessages((current) => [...current, createOutgoingMessage(Date.now(), text, attachmentName)]); setDraft(""); clearAttachment(); setTyping(true);
    window.setTimeout(() => { setMessages((current) => markOutgoingMessagesRead(current)); setTyping(false); onIncomingMessage?.(); }, 900);
  }

  return <section id="communication" className="communication-section relay-shell" aria-labelledby="communication-title">
    <div className="communication-heading"><div><p className="section-kicker">05 / PROJECT CONVERSATION</p><h2 id="communication-title">Keep the work <em>in the thread.</em></h2></div><p>Typing status, read state, and project files make the working conversation easier to follow.</p></div>
    <div className="communication-panel"><aside className="conversation-aside"><span className="conversation-stamp">ACTIVE<br />THREAD</span><div><p className="dash-label">TIDE & FORM</p><h3>Mobile checkout redesign</h3><span className="conversation-presence"><i /> Mira is available</span></div><button type="button" onClick={() => inputRef.current?.focus()}>Message Mira <MessageCircle size={15} /></button></aside><div className="conversation-main"><div className="conversation-topbar"><div><b>Mira Nori</b><span>Senior product designer</span></div><span className="project-phase">Discovery / Week 1</span></div><div className="conversation-thread">{messages.map((message) => <div className={`conversation-message ${message.mine ? "mine" : ""}`} key={message.id}><span className="conversation-avatar">{message.initials}</span><div><p><b>{message.sender}</b><time>{message.time}</time></p><span>{message.body}</span>{message.attachment && <span className="message-file"><FileText size={14} /> {message.attachment}</span>}{message.mine && <small><CheckCheck size={13} /> {message.status}</small>}</div></div>)}{typing && <div className="typing-indicator"><span>Mira is typing</span><i /><i /><i /></div>}</div><div className="conversation-compose">{attachment && <div className="attachment-preview">{attachmentUrl ? <img src={attachmentUrl} alt="Selected file preview" /> : <span className="attachment-icon">{attachment.isImage ? <Image size={18} /> : <FileText size={18} />}</span>}<div><strong>{attachment.name}</strong><span>{attachment.typeLabel} · {attachment.sizeLabel}</span></div><button type="button" onClick={clearAttachment} aria-label="Remove selected attachment">×</button></div>}<div><input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Write a project message…" aria-label="Project message" /><label className="attach-button" title="Attach a file"><Paperclip size={17} /><input ref={fileInputRef} type="file" onChange={selectAttachment} /></label><button type="button" onClick={sendMessage} aria-label="Send message"><Send size={16} /></button></div></div></div></div>
  </section>;
}
