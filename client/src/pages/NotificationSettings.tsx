/** Atelier Ledger design reminder: settings are an operations sheet—calm rows, clear choices, one deliberate save. */
import { ArrowLeft, BellRing, Check, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { defaultNotificationPreferences, normalizeNotificationPreferences, NotificationPreferences } from "@/lib/notificationPreferences";

const preferenceKey = "relay-notification-preferences";
const rows = [
  { key: "proposals" as const, icon: Send, label: "Proposal activity", detail: "Updates when a new proposal arrives or its review status changes." },
  { key: "messages" as const, icon: MessageCircle, label: "Project messages", detail: "Conversation updates and replies in active project threads." },
  { key: "system" as const, icon: ShieldCheck, label: "System alerts", detail: "Account, verification, and project workspace notices." },
];

function initialPreferences(): NotificationPreferences { try { return normalizeNotificationPreferences(JSON.parse(window.localStorage.getItem(preferenceKey) || "null")); } catch { return defaultNotificationPreferences; } }

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences);
  function save() { window.localStorage.setItem(preferenceKey, JSON.stringify(preferences)); toast.success("Notification preferences saved."); }
  return <div className="settings-page"><header className="profile-nav"><a href="/" className="relay-brand"><img src="/manus-storage/project-relay-mark_fe132e43.png" alt="Project Relay mark" /><span>PROJECT RELAY</span></a><a className="profile-back" href="/"><ArrowLeft size={16} /> Back to marketplace</a></header><main className="settings-shell"><section className="settings-intro"><p className="section-kicker">ACCOUNT OPERATIONS / 06</p><h1>Choose what gets your <em>attention.</em></h1><p>Set the in-app alerts that keep your marketplace work moving without turning the ledger into noise.</p></section><section className="settings-sheet"><div className="settings-sheet-head"><div><span className="settings-stamp"><BellRing size={18} /></span><p>NOTIFICATION DELIVERY</p><h2>Alert preferences</h2></div><span>Browser saved</span></div><div className="settings-list">{rows.map((row) => { const Icon = row.icon; return <div className="settings-row" key={row.key}><span className="settings-row-icon"><Icon size={17} /></span><div><strong>{row.label}</strong><p>{row.detail}</p></div><label className="preference-select"><span>DELIVERY</span><select value={preferences[row.key]} onChange={(event) => setPreferences((current) => ({ ...current, [row.key]: event.target.value as "In-app" | "Muted" }))}><option>In-app</option><option>Muted</option></select></label></div>; })}</div><div className="settings-save"><p><Check size={15} /> Changes apply to this browser.</p><button type="button" className="primary-button" onClick={save}>Save preferences <Check size={16} /></button></div></section></main><footer className="profile-footer">Project Relay · Notification operations</footer></div>;
}
