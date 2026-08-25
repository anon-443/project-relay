/** Secure account entry point: starts the existing OAuth flow only from an explicit user action. */
import { LogIn, UserRound } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { fullAppHref, isStaticMirror } from "@/lib/staticMirror";

export function AccountAccess() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (isStaticMirror()) return <a className="account-access" href={fullAppHref("/")}><LogIn size={14} /> Sign in</a>;
  if (!user) return <button className="account-access" type="button" onClick={() => startLogin()}><LogIn size={14} /> Sign in</button>;
  const label = user.role === "user" ? "Choose role" : user.role;
  return <a className="account-access" href="/account/role"><UserRound size={14} /> {label}</a>;
}
