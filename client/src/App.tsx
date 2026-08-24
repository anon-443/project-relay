/**
 * The Workroom design reminder: Project Relay should feel like a well-run creative studio.
 * Keep paper surfaces, cobalt structure, and orange action signals purposeful and information-led.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RoleGate } from "@/components/RoleGate";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useTheme } from "./contexts/ThemeContext";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerWorkspace from "./pages/FreelancerWorkspace";
import AccountRole from "./pages/AccountRole";
import ClientWorkspace from "./pages/ClientWorkspace";
import FreelancerProfile from "./pages/FreelancerProfile";
import Home from "./pages/Home";
import NotificationSettings from "./pages/NotificationSettings";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/freelancer/mira-nori" component={FreelancerProfile} />
      <Route path="/account/role" component={AccountRole} />
      <Route path="/freelancer/mira-nori/manage">{() => <RoleGate role="freelancer"><PortfolioManager /></RoleGate>}</Route>
      <Route path="/dashboard/freelancer">{() => <RoleGate role="freelancer"><FreelancerDashboard /></RoleGate>}</Route>
      <Route path="/workspace/freelancer">{() => <RoleGate role="freelancer"><FreelancerWorkspace /></RoleGate>}</Route>
      <Route path="/workspace/client">{() => <RoleGate role="client"><ClientWorkspace /></RoleGate>}</Route>
      <Route path="/settings/notifications" component={NotificationSettings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

import PortfolioManager from "./pages/PortfolioManager";

function AppContent() {
  const { theme } = useTheme();
  const [location, setLocation] = useLocation();
  const { user, loading } = useAuth();
  useEffect(() => { if (!loading && user?.role === "user" && location !== "/account/role") setLocation("/account/role"); }, [loading, location, setLocation, user?.role]);
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Project Rely — Find talent. Get hired. Build the future.",
      "/freelancer/mira-nori": "Mira Nori — Product Designer | Project Rely",
      "/account/role": "Choose your role | Project Rely",
      "/freelancer/mira-nori/manage": "Portfolio manager | Project Rely",
      "/dashboard/freelancer": "Freelancer dashboard | Project Rely",
      "/workspace/freelancer": "Freelancer workspace | Project Rely",
      "/workspace/client": "Client workspace | Project Rely",
      "/settings/notifications": "Notification settings | Project Rely",
    };
    document.title = titles[location] || "Project Rely — Freelancing marketplace";
  }, [location]);
  const needsThemeDock = location === "/freelancer/mira-nori" || location === "/settings/notifications";
  return <TooltipProvider><Toaster theme={theme} position="bottom-right" />{needsThemeDock && <div className="route-theme-dock"><ThemeToggle /></div>}<Router /></TooltipProvider>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
