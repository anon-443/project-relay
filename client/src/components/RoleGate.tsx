/** Route guard keeps marketplace roles server-backed: unauthenticated users enter OAuth, unassigned users complete onboarding, and mismatches are denied. */
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

type MarketplaceRole = "client" | "freelancer";
export function RoleGate({ role, children }: { role: MarketplaceRole; children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  useEffect(() => { if (user?.role === "user") setLocation("/account/role"); }, [setLocation, user?.role]);
  if (loading || !isAuthenticated || !user || user.role === "user") return <div className="role-gate-loading">Checking secure workspace access…</div>;
  if (user.role !== role) return <main className="role-denied"><ShieldAlert size={28} /><p>ROLE ACCESS</p><h1>This workspace is for <em>{role}</em> accounts.</h1><span>Your signed-in role is <b>{user.role}</b>. Return to your account role page to review available access.</span><a className="primary-button" href="/account/role">Open secure account</a></main>;
  return <>{children}</>;
}
