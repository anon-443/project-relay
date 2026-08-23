/** Atelier Ledger design reminder: notifications are quiet ledger alerts—clear context, one action, brass only for unread state. */
import { Bell, Check, MessageCircle, Send, X } from "lucide-react";
import { useMemo, useState } from "react";
import { filterNotificationLedger } from "@/lib/notifications";

export type Notice = { id: number; type: "message" | "proposal"; title: string; detail: string; time: string; unread: boolean };

export function NotificationCenter({ onOpenWorkboard, notices, onMarkRead, onMarkAllRead, defaultOpen = false }: { onOpenWorkboard: () => void; notices: Notice[]; onMarkRead: (id: number) => void; onMarkAllRead: () => void; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [filter, setFilter] = useState<"All activity" | "Unread only">("All activity");
  const unread = notices.filter((notice) => notice.unread).length;
  const visibleNotices = useMemo(() => filterNotificationLedger(notices, filter), [notices, filter]);

  function openNotice(id: number) { onMarkRead(id); setOpen(false); onOpenWorkboard(); }

  return <div className="notification-center">
    <button className="notification-trigger" type="button" onClick={() => setOpen((current) => !current)} aria-label="Open notifications" aria-expanded={open}><Bell size={16} />{unread > 0 && <span>{unread}</span>}</button>
    {open && <div className="notification-panel" role="status" aria-label="Notifications">
      <div className="notification-panel-header"><div><p>ACTIVITY LEDGER</p><strong>{unread ? `${unread} new updates` : "You're all caught up"}</strong></div><button type="button" onClick={() => setOpen(false)} aria-label="Close notifications"><X size={16} /></button></div>
      <div className="notification-controls"><label>SHOW<select value={filter} onChange={(event) => setFilter(event.target.value as "All activity" | "Unread only")}><option>All activity</option><option>Unread only</option></select></label><span>{visibleNotices.length} item{visibleNotices.length === 1 ? "" : "s"}</span></div>
      <div className="notification-list">{visibleNotices.length ? visibleNotices.map((notice) => <button key={notice.id} type="button" className={`notification-item ${notice.unread ? "unread" : ""}`} onClick={() => openNotice(notice.id)}><span className="notification-symbol">{notice.type === "message" ? <MessageCircle size={15} /> : <Send size={14} />}</span><span><b>{notice.title}</b><small>{notice.detail}</small><time>{notice.time}</time></span>{notice.unread && <i />}</button>) : <div className="notification-empty">No unread alerts in the ledger.</div>}</div>
      <button type="button" className="notification-clear" onClick={onMarkAllRead} disabled={!unread}><Check size={14} /> Mark all as read</button>
    </div>}
  </div>;
}
