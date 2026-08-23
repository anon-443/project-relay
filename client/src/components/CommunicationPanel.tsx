/** Atelier Ledger design reminder: the conversation panel prioritizes readable status, subtle presence, and practical file context. */
import { CheckCheck, FileText, MessageCircle, Paperclip, Send } from "lucide-react";
import { useRef, useState } from "react";
import { canSendMessage, createOutgoingMessage, markOutgoingMessagesRead } from "@/lib/communication";

type ConversationMessage = { id: number; sender: string; initials: string; body: string; time: string; mine?: boolean; attachment?: string; status?: "Delivered" | "Read" };

const starterMessages: ConversationMessage[] = [
  { id: 1, sender: "Mira Nori", initials: "MN", body: "I have mapped the friction points in the mobile flow and added two questions to the project files.", time: "10:14" },
  { id: 2, sender: "Tide & Form", initials: "TF", body: "Thank you. I have also attached the current checkout screen recording for context.", time: "10:17", attachment: "checkout-flow.mov" },
  { id: 3, sender: "Mira Nori", initials: "MN", body: "Perfect. I will share the first prototype direction by Thursday.", time: "10:19" },
];

export function CommunicationPanel({ onIncomingMessage }: { onIncomingMessage?: () => void }) {
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function sendMessage() {
    const text = draft.trim();
    if (!canSendMessage(text, attachment)) return;
    const id = Date.now();
    setMessages((current) => [...current, createOutgoingMessage(id, text, attachment)]);
    setDraft("");
    setAttachment(null);
    setTyping(true);
    window.setTimeout(() => {
      setMessages((current) => markOutgoingMessagesRead(current));
      setTyping(false);
      onIncomingMessage?.();
    }, 900);
  }

  return (
    <section className="communication-section relay-shell" aria-labelledby="communication-title">
      <div className="communication-heading"><div><p className="section-kicker">05 / PROJECT CONVERSATION</p><h2 id="communication-title">Keep the work <em>in the thread.</em></h2></div><p>Typing status, read state, and project files make the working conversation easier to follow.</p></div>
      <div className="communication-panel">
        <aside className="conversation-aside"><span className="conversation-stamp">ACTIVE<br />THREAD</span><div><p className="dash-label">TIDE & FORM</p><h3>Mobile checkout redesign</h3><span className="conversation-presence"><i /> Mira is available</span></div><button type="button" onClick={() => inputRef.current?.focus()}>Message Mira <MessageCircle size={15} /></button></aside>
        <div className="conversation-main">
          <div className="conversation-topbar"><div><b>Mira Nori</b><span>Senior product designer</span></div><span className="project-phase">Discovery / Week 1</span></div>
          <div className="conversation-thread">
            {messages.map((message) => <div className={`conversation-message ${message.mine ? "mine" : ""}`} key={message.id}><span className="conversation-avatar">{message.initials}</span><div><p><b>{message.sender}</b><time>{message.time}</time></p><span>{message.body}</span>{message.attachment && <span className="message-file"><FileText size={14} /> {message.attachment}</span>}{message.mine && <small><CheckCheck size={13} /> {message.status}</small>}</div></div>)}
            {typing && <div className="typing-indicator"><span>Mira is typing</span><i /><i /><i /></div>}
          </div>
          <div className="conversation-compose">
            {attachment && <span className="attachment-draft"><FileText size={13} /> {attachment}<button type="button" onClick={() => setAttachment(null)} aria-label="Remove selected attachment">×</button></span>}
            <div><input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Write a project message…" aria-label="Project message" /><label className="attach-button" title="Attach a file"><Paperclip size={17} /><input type="file" onChange={(event) => setAttachment(event.target.files?.[0]?.name || null)} /></label><button type="button" onClick={sendMessage} aria-label="Send message"><Send size={16} /></button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
