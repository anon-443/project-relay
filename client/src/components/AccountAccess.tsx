/** Secure account entry point: starts the existing OAuth flow only from an explicit user action. */
import { LogIn, UserRound } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export function AccountAccess() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <button className="account-access" type="button" onClick={() => startLogin()}><LogIn size={14} /> Sign in</button>;
  const label = user.role === "user" ? "Choose role" : user.role;
  return <a className="account-access" href="/account/role"><UserRound size={14} /> {label}</a>;
}
