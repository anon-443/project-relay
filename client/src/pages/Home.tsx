/**
 * Atelier Ledger design reminder: Project Relay should now feel like a composed professional service.
 * Use mineral surfaces, charcoal structure, slate operational states, and brass only for decisive actions.
 */
import { trpc } from "@/lib/trpc";
import "../signalStudio.css";
import { CommunicationPanel } from "@/components/CommunicationPanel";
import { NotificationCenter, type Notice } from "@/components/NotificationCenter";
import { AccountAccess } from "@/components/AccountAccess";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fullAppHref, isStaticMirror, publicAsset } from "@/lib/staticMirror";
import { normalizeNotificationPreferences, shouldCreateInAppAlert } from "@/lib/notificationPreferences";
import { getNextHeroDemoStep, heroDemoSteps } from "@/lib/heroDemo";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Play,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Command,
  ExternalLink,
  FileCheck2,
  Filter,
  Heart,
  ListChecks,
  Menu,
  MessageCircle,
  MessageSquareText,
  Plus,
  Search,
  Send,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const assets = {
  hero: publicAsset("/manus-storage/project-relay-hero-workroom_d5d6ef3d.jpg"),
  talent: publicAsset("/manus-storage/project-relay-talent-collage_d0fc082c.jpg"),
  board: publicAsset("/manus-storage/project-relay-brief-board_b04c809a.jpg"),
  logo: publicAsset("/manus-storage/project-relay-mark_fe132e43.png"),
};

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];
const reveal = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.16 }, transition: { duration: 0.48, ease: easeOut } };

type Project = { id: number; title: string; company: string; category: string; budget: string; budgetValue: number; deadline: string; description: string; skills: string[]; format: string; accent: "blue" | "orange" | "ink"; scope: string; };
type Freelancer = { id: number; initials: string; name: string; role: string; level: "Emerging" | "Mid-level" | "Senior"; skills: string[]; bio: string; accent: "blue" | "orange" | "cream"; portfolio: string; };
type PostForm = { title: string; category: string; budget: string; deadline: string; goal: string; skills: string; tone: string; description: string; deliverables: string[]; };
type ChatMessage = { id: number; sender: string; initials: string; time: string; body: string; mine?: boolean; };

const projects: Project[] = [
  { id: 1, title: "Design a mobile checkout that does less, better", company: "Tide & Form", category: "Product design", budget: "$2,400–$3,200", budgetValue: 3200, deadline: "Apply by 18 Jun", description: "Reframe a premium commerce checkout around calm decisions, one-handed use, and a clearer payment handoff", skills: ["Figma", "Mobile UX", "Systems"], format: "Remote / 3 weeks", accent: "blue", scope: "Map the current checkout flow, create a concise component strategy, and deliver a tested mobile prototype for an existing commerce product" },
  { id: 2, title: "Build a launch narrative for a climate data platform", company: "Morrow Grid", category: "Copywriting", budget: "$1,600–$2,100", budgetValue: 2100, deadline: "Apply by 21 Jun", description: "Turn technical capability into a landing-page story that makes the first customer conversation simpler", skills: ["Brand writing", "SaaS", "Research"], format: "Remote / 2 weeks", accent: "orange", scope: "Develop page hierarchy, long-form messaging, product proof points, and a concise set of launch assets for a B2B climate analytics platform" },
  { id: 3, title: "Create an identity kit for a local food publisher", company: "Common Table", category: "Brand & identity", budget: "$3,500–$4,500", budgetValue: 4500, deadline: "Apply by 25 Jun", description: "Build an expressive visual system for a new editorial platform covering independent food culture", skills: ["Identity", "Art direction", "Editorial"], format: "Hybrid / 4 weeks", accent: "ink", scope: "Explore naming applications, logo use, color, type, social templates, and lightweight editorial guidelines for a small publication team" },
  { id: 4, title: "Prototype a creator onboarding flow", company: "Ripple Studio", category: "Web development", budget: "$2,800–$3,800", budgetValue: 3800, deadline: "Apply by 27 Jun", description: "Design and build a browser onboarding sequence that gives new creators a confident first session", skills: ["React", "UX", "Animation"], format: "Remote / 3 weeks", accent: "blue", scope: "Define the interaction model, prototype core screens, and deliver a responsive front-end sequence with accessible validation states" },
  { id: 5, title: "Plan a short-form campaign for an independent hotel", company: "Field Notes Hotel", category: "Digital marketing", budget: "$1,200–$1,800", budgetValue: 1800, deadline: "Apply by 29 Jun", description: "Create a focused campaign plan for a quiet, design-led hotel opening in a coastal town", skills: ["Strategy", "Social", "Content"], format: "On-site / 2 weeks", accent: "orange", scope: "Shape channel strategy, messaging, a content calendar, and production direction around a three-week opening campaign" },
  { id: 6, title: "Run discovery interviews for member onboarding", company: "Harbour & Co", category: "UX research", budget: "$2,000–$2,700", budgetValue: 2700, deadline: "Apply by 02 Jul", description: "Turn member interviews into clear evidence for the next onboarding decisions", skills: ["Interviews", "Synthesis", "Journey maps"], format: "Remote / 2 weeks", accent: "ink", scope: "Recruit interview participants, facilitate six sessions, synthesize themes, and deliver an evidence-backed onboarding opportunity map" },
  { id: 7, title: "Refresh an arts venue membership dashboard", company: "Assembly Hall", category: "Product design", budget: "$3,000–$4,000", budgetValue: 4000, deadline: "Apply by 05 Jul", description: "Make event access, member benefits, and renewal decisions easier to understand at a glance", skills: ["Dashboards", "UI systems", "Prototyping"], format: "Remote / 4 weeks", accent: "orange", scope: "Audit the current member experience, redesign key dashboard journeys, and hand over a responsive component-ready interface" },
  { id: 8, title: "Build a resource finder for a community clinic", company: "Northline Care", category: "Web development", budget: "$3,200–$4,200", budgetValue: 4200, deadline: "Apply by 08 Jul", description: "Create a fast, accessible finder that helps visitors reach the right support without friction", skills: ["React", "Accessibility", "Search"], format: "Hybrid / 4 weeks", accent: "ink", scope: "Build an accessible search experience, responsive content templates, and a maintainable front-end foundation for service teams" },
  { id: 9, title: "Create a launch toolkit for reusable packaging", company: "Loop Standard", category: "Brand & identity", budget: "$2,600–$3,600", budgetValue: 3600, deadline: "Apply by 10 Jul", description: "Shape a flexible launch toolkit that makes a circular packaging idea easy to recognise and share", skills: ["Identity", "Campaigns", "Guidelines"], format: "Remote / 3 weeks", accent: "blue", scope: "Create visual foundations, campaign templates, social assets, and a concise set of usage guidelines for early launch partners" },
  { id: 10, title: "Write a sales story for logistics software", company: "Routewell", category: "Copywriting", budget: "$1,900–$2,500", budgetValue: 2500, deadline: "Apply by 12 Jul", description: "Translate complex delivery operations into a sales story that feels clear, credible, and human", skills: ["Messaging", "B2B", "Web copy"], format: "Remote / 2 weeks", accent: "orange", scope: "Develop messaging architecture, homepage copy, product proof points, and a sales-ready narrative for a growing software team" },
  { id: 11, title: "Run paid social tests for a ceramic studio", company: "Clay Current", category: "Digital marketing", budget: "$1,400–$2,000", budgetValue: 2000, deadline: "Apply by 15 Jul", description: "Test a focused paid-social system that turns seasonal collections into measurable audience learning", skills: ["Paid social", "Creative tests", "Analytics"], format: "Remote / 2 weeks", accent: "blue", scope: "Plan creative test sets, launch paid social experiments, report learnings, and recommend the next audience and format priorities" },
  { id: 12, title: "Research an upgrade path for an indie publisher", company: "Margin Press", category: "UX research", budget: "$2,200–$3,000", budgetValue: 3000, deadline: "Apply by 18 Jul", description: "Understand why readers hesitate at upgrade and turn their feedback into practical membership opportunities", skills: ["Interviews", "Service design", "Insights"], format: "Remote / 3 weeks", accent: "ink", scope: "Plan participant recruitment, conduct remote interviews, synthesize themes, and map the highest-value upgrade opportunities" },
];

const freelancers: Freelancer[] = [
  { id: 1, initials: "MN", name: "Mira Nori", role: "Product designer", level: "Senior", skills: ["Figma", "Design systems", "Research"], bio: "Turns complex product decisions into clear, usable flows for ambitious teams.", accent: "blue", portfolio: "Fintech & commerce systems" },
  { id: 2, initials: "AJ", name: "Ari James", role: "Frontend developer", level: "Mid-level", skills: ["React", "Motion", "Accessibility"], bio: "Builds responsive interfaces with careful interaction, strong structure, and durable component logic.", accent: "orange", portfolio: "SaaS onboarding & product sites" },
  { id: 3, initials: "RK", name: "Rina Kade", role: "Brand writer", level: "Senior", skills: ["Messaging", "B2B", "Editorial"], bio: "Makes technical products easier to understand, choose, and talk about.", accent: "cream", portfolio: "Climate & developer tools" },
  { id: 4, initials: "DS", name: "Dara Sun", role: "Growth strategist", level: "Emerging", skills: ["Campaigns", "Audience", "Analytics"], bio: "Pairs sharp creative planning with practical launch experiments for small teams.", accent: "blue", portfolio: "Hospitality & cultural brands" },
];

const categories = [
  { label: "Product design", icon: "✦", tone: "blue" }, { label: "Web development", icon: "⌘", tone: "ink" }, { label: "Brand & identity", icon: "◒", tone: "orange" }, { label: "Copywriting", icon: "Aa", tone: "cream" }, { label: "Digital marketing", icon: "↗", tone: "blue" }, { label: "UX research", icon: "◌", tone: "cream" },
];

const emptyPost: PostForm = { title: "", category: "", budget: "", deadline: "", goal: "", skills: "", tone: "Clear and professional", description: "", deliverables: [] };
const starterChat: ChatMessage[] = [
  { id: 1, sender: "Mira Nori", initials: "MN", time: "10:14", body: "Thanks for sharing the brief. I have two questions about the current checkout flow before I outline an approach." },
  { id: 2, sender: "Tide & Form", initials: "TF", time: "10:17", body: "Of course. The key issue is the shipping and payment handoff on mobile. I have added the existing screens to the project files." },
  { id: 3, sender: "Mira Nori", initials: "MN", time: "10:19", body: "That helps. I will map the decision points first, then share a prototype direction by Thursday." },
];

const featuredProjectStatuses = ["Accepting proposals", "3 proposals received", "Shortlist in review"];

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

function isInAppAlertEnabled(type: Notice["type"]): boolean {
  try {
    const stored = JSON.parse(window.localStorage.getItem("relay-notification-preferences") || "null");
    const preferences = normalizeNotificationPreferences(stored);
    return shouldCreateInAppAlert(preferences, type);
  } catch { return true; }
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(() => new URLSearchParams(window.location.search).get("previewMenu") === "1");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All categories");
  const [budget, setBudget] = useState("Any budget");
  const [sort, setSort] = useState("Newest");
  const [freelancerTerm, setFreelancerTerm] = useState("");
  const [experience, setExperience] = useState("All levels");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [proposalProject, setProposalProject] = useState<Project | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [proposals, setProposals] = useState<{ title: string; status: string }[]>([]);
  const [formError, setFormError] = useState("");
  const [postingOpen, setPostingOpen] = useState(false);
  const [postStep, setPostStep] = useState(1);
  const [postForm, setPostForm] = useState<PostForm>(emptyPost);
  const [postError, setPostError] = useState("");
  const [postedProjects, setPostedProjects] = useState<{ title: string; status: string }[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(starterChat);
  const [chatDraft, setChatDraft] = useState("");
  const [notifications, setNotifications] = useState<Notice[]>([]);
  const notificationPreview = new URLSearchParams(window.location.search).get("previewNotification") === "1";
  const [featuredStatusIndex, setFeaturedStatusIndex] = useState(0);
  const [heroDemoStepIndex, setHeroDemoStepIndex] = useState(0);
  const [heroDemoPlaying, setHeroDemoPlaying] = useState(false);
  const heroDemoStep = heroDemoSteps[heroDemoStepIndex];

  const descriptionAssistant = trpc.projectAssistant.generateDescription.useMutation({
    onSuccess: (result) => {
      setPostForm((current) => ({ ...current, description: result.description, deliverables: result.deliverables }));
      setPostError("");
      toast.success("A structured description is ready to refine.");
    },
    onError: (error) => toast.error(error.message || "The writing assistant could not complete that request."),
  });

  useEffect(() => { const persisted = window.localStorage.getItem("relay-saved-projects"); if (persisted) setSaved(JSON.parse(persisted)); }, []);
  useEffect(() => {
    if (!notificationPreview) return;
    setNotifications([{ id: 1, type: "message", title: "New message from Tide & Form", detail: "Mobile checkout redesign", time: "Just now", unread: true }]);
  }, [notificationPreview]);
  useEffect(() => { const ticker = window.setInterval(() => setFeaturedStatusIndex((index) => (index + 1) % featuredProjectStatuses.length), 4200); return () => window.clearInterval(ticker); }, []);
  useEffect(() => {
    if (!heroDemoPlaying) return;
    const progressTimer = window.setInterval(() => setHeroDemoStepIndex((index) => getNextHeroDemoStep(index)), 1350);
    const finishTimer = window.setTimeout(() => setHeroDemoPlaying(false), 4400);
    return () => { window.clearInterval(progressTimer); window.clearTimeout(finishTimer); };
  }, [heroDemoPlaying]);
  useEffect(() => {
    const requestedProject = Number(new URLSearchParams(window.location.search).get("previewProject"));
    if (!Number.isInteger(requestedProject)) return;
    setSelectedProject(projects.find((project) => project.id === requestedProject) ?? null);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("previewClientPost") !== "1") return;
    const requestedStep = Number(params.get("postStep"));
    if (![1, 2, 3].includes(requestedStep)) return;
    setPostForm({
      title: "Improve our supplier ordering portal",
      category: "Product design",
      budget: "$3,000–$4,000",
      deadline: "2026-07-12",
      goal: "Make recurring supplier orders easier to monitor, approve, and resolve for busy operations teams.",
      skills: "Figma, user research, systems thinking",
      tone: "Clear and professional",
      description: "Create a focused redesign for the supplier ordering portal that clarifies order visibility, reduces approval friction, and gives operations teams a more dependable path from request to resolution.",
      deliverables: ["Current-flow review", "Responsive prototype", "Component recommendations"],
    });
    setPostStep(requestedStep);
    setPostingOpen(true);
  }, []);

  const filteredProjects = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();
    const list = projects.filter((project) => {
      const matchesSearch = !value || [project.title, project.company, project.category, ...project.skills].join(" ").toLowerCase().includes(value);
      const matchesCategory = category === "All categories" || project.category === category;
      const matchesBudget = budget === "Any budget" || (budget === "Under $2k" ? project.budgetValue < 2000 : budget === "$2k–$3.5k" ? project.budgetValue >= 2000 && project.budgetValue <= 3500 : project.budgetValue > 3500);
      return matchesSearch && matchesCategory && matchesBudget;
    });
    return [...list].sort((a, b) => sort === "Budget: high" ? b.budgetValue - a.budgetValue : sort === "Budget: low" ? a.budgetValue - b.budgetValue : a.id - b.id);
  }, [searchTerm, category, budget, sort]);

  const filteredFreelancers = useMemo(() => {
    const term = freelancerTerm.toLowerCase().trim();
    return freelancers.filter((freelancer) => (!term || [freelancer.name, freelancer.role, freelancer.bio, ...freelancer.skills].join(" ").toLowerCase().includes(term)) && (experience === "All levels" || freelancer.level === experience));
  }, [freelancerTerm, experience]);

  function toggleSaved(id: number) {
    setSaved((current) => { const next = current.includes(id) ? current.filter((projectId) => projectId !== id) : [...current, id]; window.localStorage.setItem("relay-saved-projects", JSON.stringify(next)); toast.success(next.includes(id) ? "Project saved to your workboard." : "Project removed from your workboard."); return next; });
  }

  function addNotification(type: Notice["type"], title: string, detail: string) { if (isInAppAlertEnabled(type)) setNotifications((current) => [{ id: Date.now(), type, title, detail, time: "Just now", unread: true }, ...current]); }
  function markNotificationRead(id: number) { setNotifications((current) => current.map((notice) => notice.id === id ? { ...notice, unread: false } : notice)); }
  function markAllNotificationsRead() { setNotifications((current) => current.map((notice) => ({ ...notice, unread: false }))); }

  function submitProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const required = ["name", "email", "budget", "message"]; const missing = required.some((field) => !String(form.get(field) || "").trim());
    if (missing) { setFormError("Please add your name, email, expected budget, and a short proposal before sending."); return; }
    const proposalTitle = proposalProject?.title || "Project";
    setProposals((current) => [{ title: proposalTitle, status: "Sent for review" }, ...current]); addNotification("proposal", "New proposal activity", proposalTitle); setFormError(""); event.currentTarget.reset(); toast.success("Proposal sent. It now appears in your workboard."); setProposalProject(null);
  }

  function updatePost(field: keyof PostForm, value: string) { setPostForm((current) => ({ ...current, [field]: value })); setPostError(""); }
  function openPosting() { setPostStep(1); setPostError(""); setPostingOpen(true); }
  function advancePosting() {
    if (postStep === 1 && (postForm.title.trim().length < 5 || !postForm.category || !postForm.budget.trim() || !postForm.deadline)) { setPostError("Add a clear project title, category, budget, and deadline to continue."); return; }
    if (postStep === 2 && (postForm.goal.trim().length < 12 || postForm.description.trim().length < 30)) { setPostError("Describe the goal and add a project description before previewing the brief."); return; }
    setPostError(""); setPostStep((current) => current + 1);
  }
  function generateDescription() {
    if (postForm.title.trim().length < 3 || !postForm.category || postForm.goal.trim().length < 12) { setPostError("Add a title, category, and a meaningful project goal before using the writing assistant."); return; }
    descriptionAssistant.mutate({ title: postForm.title, category: postForm.category, goal: postForm.goal, skills: postForm.skills, tone: postForm.tone });
  }
  function submitPostedProject() {
    setPostedProjects((current) => [{ title: postForm.title, status: "Open for proposals" }, ...current]); setPostingOpen(false); setPostForm(emptyPost); setPostStep(1); toast.success("Project posted. It is now visible in your client workboard.");
  }
  function sendChat() {
    const text = chatDraft.trim(); if (!text) return;
    setChatMessages((current) => [...current, { id: Date.now(), sender: "You", initials: "YOU", time: "Now", body: text, mine: true }]); setChatDraft("");
    window.setTimeout(() => setChatMessages((current) => [...current, { id: Date.now() + 1, sender: "Tide & Form", initials: "TF", time: "Now", body: "Thanks — I have seen that. I will review it with the project context and reply shortly." }]), 550);
  }
  function playHeroDemo() { setHeroDemoStepIndex(0); setHeroDemoPlaying(true); }

  return (
    <div className="relay-app" id="top">
      <header className="relay-header">
        <a href="#top" className="relay-brand" aria-label="Project Relay home"><img src={assets.logo} alt="Project Relay mark" /><span>PROJECT RELAY</span></a>
        <nav className="relay-nav" aria-label="Primary navigation"><a href="#projects">Find work</a><a href="#talent">Find talent</a><a href="#dashboard">Workboard</a><a href={fullAppHref("/settings/notifications")}>Settings</a></nav>
        <div className="header-actions"><ThemeToggle /><NotificationCenter onOpenWorkboard={() => scrollTo("dashboard")} notices={notifications} onMarkRead={markNotificationRead} onMarkAllRead={markAllNotificationsRead} defaultOpen={notificationPreview} /><a className="header-login header-dashboard" href={fullAppHref("/dashboard/freelancer")}>Dashboard</a><AccountAccess /><button className="header-cta" type="button" onClick={openPosting}>Post a project <ArrowUpRight size={16} /></button></div>
        <div className="mobile-notification"><NotificationCenter onOpenWorkboard={() => scrollTo("dashboard")} notices={notifications} onMarkRead={markNotificationRead} onMarkAllRead={markAllNotificationsRead} defaultOpen={notificationPreview} /></div><button className="mobile-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 22 }} transition={{ duration: .26, ease: easeOut }}><a href="#projects" onClick={() => setMenuOpen(false)}>Find work</a><a href="#talent" onClick={() => setMenuOpen(false)}>Find talent</a><a href={fullAppHref("/dashboard/freelancer")}>Dashboard</a><a href="#dashboard" onClick={() => setMenuOpen(false)}>My workboard</a><a href={fullAppHref("/settings/notifications")}>Settings</a><ThemeToggle /><AccountAccess /><button onClick={() => { setMenuOpen(false); openPosting(); }}>Post a project <ArrowUpRight size={15} /></button></motion.nav>}</AnimatePresence>
      </header>

      <main>
        <nav className="hero-project-rail" aria-label="Featured project media">
          <span>FEATURED PROJECTS</span>
          {projects.slice(0, 3).map((project, index) => <button key={project.id} type="button" onClick={() => { setCategory(project.category); scrollTo("projects"); }}><b>{String(index + 1).padStart(2, "0")}</b> {project.company}</button>)}
          <button className="hero-rail-demo-trigger" type="button" onClick={playHeroDemo} aria-expanded={heroDemoPlaying} aria-controls="hero-capability-demo"><Play size={11} fill="currentColor" /> Demo</button>
          <AnimatePresence>{heroDemoPlaying && <motion.div id="hero-capability-demo" className="hero-demo-popover" role="status" aria-live="polite" initial={{ opacity: 0, y: 8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: .98 }} transition={{ duration: .2, ease: easeOut }}><div><span>CAPABILITY WALKTHROUGH</span><b>{heroDemoStep.label}</b></div><strong>{heroDemoStep.title}</strong><p>{heroDemoStep.detail}</p><i><b style={{ width: `${((heroDemoStepIndex + 1) / heroDemoSteps.length) * 100}%` }} /></i></motion.div>}</AnimatePresence>
        </nav>
        <section className="relay-hero" aria-labelledby="hero-title" onPointerMove={(event) => { if (event.pointerType === "touch") return; const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--hero-pointer-x", `${((event.clientX - rect.left) / rect.width - .5) * 12}px`); event.currentTarget.style.setProperty("--hero-pointer-y", `${((event.clientY - rect.top) / rect.height - .5) * 10}px`); }} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--hero-pointer-x", "0px"); event.currentTarget.style.setProperty("--hero-pointer-y", "0px"); }}><div className="hero-copy"><motion.p className="section-kicker" {...reveal}><i /> A creative marketplace for ambitious work</motion.p><motion.h1 id="hero-title" {...reveal} transition={{ ...reveal.transition, delay: .04 }}><span>Find talent</span><span>Get hired</span><em>Build the future</em></motion.h1><motion.p className="hero-description" {...reveal} transition={{ ...reveal.transition, delay: .08 }}>Project Relay brings well-scoped projects and capable independent specialists into one energetic working space</motion.p><motion.form className="hero-search" {...reveal} transition={{ ...reveal.transition, delay: .1 }} onSubmit={(event) => { event.preventDefault(); scrollTo("projects"); }}><Search size={19} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search projects or skills" aria-label="Search projects or skills" /><button type="submit">Explore <ArrowRight size={16} /></button></motion.form><motion.div className="hero-stats" {...reveal} transition={{ ...reveal.transition, delay: .16 }}><span><b>12</b> featured projects</span><span><b>6</b> creative disciplines</span><span><b>3</b> role-aware workspaces</span></motion.div></div><motion.div className="hero-visual" {...reveal} transition={{ ...reveal.transition, delay: .1 }}><img src={assets.hero} alt="Editorial creative studio worktable with project planning materials" /><div className="hero-evidence"><span>LIVE MATCH</span><b>Briefs with better context</b></div><div className="hero-brief-card"><p>FEATURED PROJECT</p><span className="hero-project-status" aria-live="polite"><i /> {featuredProjectStatuses[featuredStatusIndex]}</span><strong>Mobile checkout redesign</strong><div><span>Product design</span><b>$2.4k–$3.2k</b></div></div><div className="hero-stamp">NOW<br />OPEN</div></motion.div><div className="hero-reel" aria-label="Project Relay project reel preview"><div className="hero-reel-head"><span><i /> PROJECT REEL</span><b>00:18</b></div><div className="hero-reel-frame"><span>TIDE &amp; FORM</span><strong>Mobile checkout<br />in motion</strong><p>Research → prototype → handoff</p></div><div className="hero-reel-foot"><Play size={12} fill="currentColor" /><span>Previewing project flow</span><i><b /></i></div></div></section>

        <section className="category-section relay-shell" aria-labelledby="category-title"><motion.div className="section-title-row" {...reveal}><div><p className="section-kicker">01 / POPULAR CATEGORIES</p><h2 id="category-title">Find work in the craft you <em>love</em></h2></div><button type="button" className="mini-link" onClick={() => scrollTo("projects")}>Explore projects <ArrowUpRight size={16} /></button></motion.div><div className="category-grid">{categories.map((item, index) => <motion.button key={item.label} className={`category-card tone-${item.tone}`} type="button" {...reveal} transition={{ ...reveal.transition, delay: index * .045 }} onClick={() => { setCategory(item.label); scrollTo("projects"); }}><span className="category-icon">{item.icon}</span><span className="category-label">{item.label}</span><span className="category-action">Explore <ArrowUpRight size={14} /></span></motion.button>)}</div></section>

        <section className="featured-section" aria-labelledby="featured-title"><div className="relay-shell featured-layout"><motion.div className="featured-image" {...reveal}><img src={assets.board} alt="Creative project brief planning board" /><span className="image-caption">HOW IT WORKS</span></motion.div><motion.div className="featured-copy" {...reveal} transition={{ ...reveal.transition, delay: .08 }}><p className="section-kicker">THE RELAY METHOD</p><h2 id="featured-title">A better way to <em>work together</em></h2><p>Clear projects, relevant people, and a calm path from first message to completed work.</p><div className="method-list"><span><b>01</b> Discover a brief with context</span><span><b>02</b> Connect around the right fit</span><span><b>03</b> Move work forward with clarity</span></div></motion.div></div></section>

        <section id="projects" className="projects-section relay-shell" aria-labelledby="projects-title"><motion.div className="section-title-row project-heading" {...reveal}><div><p className="section-kicker">02 / FEATURED PROJECTS</p><h2 id="projects-title">Projects with real <em>momentum</em></h2></div><p>Search by title, skill, or client. Then find a brief that fits the way you work.</p></motion.div><motion.div className="project-search-bar" {...reveal}><label className="search-field"><Search size={18} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search projects, clients, or skills" aria-label="Search projects" /></label><div className="select-group"><Filter size={16} /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option>All categories</option>{categories.map((item) => <option key={item.label}>{item.label}</option>)}</select></div><div className="select-group"><select value={budget} onChange={(event) => setBudget(event.target.value)} aria-label="Filter by budget"><option>Any budget</option><option>Under $2k</option><option>$2k–$3.5k</option><option>Over $3.5k</option></select><ChevronDown size={15} /></div></motion.div><div className="project-list-toolbar"><span><b>{filteredProjects.length}</b> matching projects</span><label>Sort <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest</option><option>Budget: high</option><option>Budget: low</option></select></label></div><div className="project-list"><AnimatePresence mode="popLayout">{filteredProjects.map((project) => <motion.article layout key={project.id} className={`project-card accent-${project.accent}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .28, ease: easeOut }}><div className="project-card-main"><div className="project-card-top"><span className="company-mark">{project.company.slice(0, 1)}</span><span>{project.company}</span><button className={`save-button ${saved.includes(project.id) ? "saved" : ""}`} type="button" onClick={() => toggleSaved(project.id)} aria-label="Save project"><Heart size={16} fill={saved.includes(project.id) ? "currentColor" : "none"} /></button></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-tags">{project.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="project-card-side"><div><p>BUDGET</p><strong>{project.budget}</strong></div><div><p>FORMAT</p><span>{project.format}</span></div><div><p>DEADLINE</p><span>{project.deadline}</span></div><button type="button" onClick={() => setSelectedProject(project)}>View project <ArrowUpRight size={16} /></button></div></motion.article>)}</AnimatePresence>{filteredProjects.length === 0 && <div className="empty-state"><Search size={24} /><p>No projects match those filters yet.</p><button type="button" onClick={() => { setSearchTerm(""); setCategory("All categories"); setBudget("Any budget"); }}>Reset filters</button></div>}</div></section>

        <section id="talent" className="talent-section" aria-labelledby="talent-title"><div className="relay-shell talent-layout"><motion.div className="talent-intro" {...reveal}><p className="section-kicker">03 / FEATURED TALENT</p><h2 id="talent-title">Meet people who make <em>ideas move</em></h2><p>Explore creative specialists by craft and experience, then connect around the work that matters.</p><img src={assets.talent} alt="Editorial collage of creative professionals" /></motion.div><motion.div className="talent-directory" {...reveal} transition={{ ...reveal.transition, delay: .08 }}><div className="talent-filter"><label><Search size={16} /><input value={freelancerTerm} onChange={(event) => setFreelancerTerm(event.target.value)} placeholder="Search skills" aria-label="Search freelancer skills" /></label><select value={experience} onChange={(event) => setExperience(event.target.value)} aria-label="Filter freelancers by expertise level"><option>All levels</option><option>Emerging</option><option>Mid-level</option><option>Senior</option></select></div><div className="talent-list">{filteredFreelancers.map((freelancer) => <article className="freelancer-card" key={freelancer.id}><div className={`avatar avatar-${freelancer.accent}`}>{freelancer.initials}</div><div className="freelancer-core"><div className="freelancer-heading"><h3>{freelancer.name}</h3><span>{freelancer.level}</span></div><p className="freelancer-role">{freelancer.role}</p><p className="freelancer-bio">{freelancer.bio}</p><div className="project-tags">{freelancer.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="portfolio-note"><span>WORK SAMPLES</span><p>{freelancer.portfolio}</p><button type="button" onClick={() => toast.message("Profile workspace opened — sample portfolio links can be connected here.")}>View profile <ExternalLink size={14} /></button></div></article>)}{filteredFreelancers.length === 0 && <div className="empty-state talent-empty"><CircleUserRound size={24} /><p>No specialists match that search.</p></div>}</div></motion.div></div></section>

        <section id="dashboard" className="dashboard-section relay-shell" aria-labelledby="dashboard-title"><motion.div className="section-title-row dashboard-heading" {...reveal}><div><p className="section-kicker">04 / YOUR WORKSPACE</p><h2 id="dashboard-title">Keep your creative work <em>moving</em></h2></div><button type="button" className="mini-link" onClick={openPosting}>Post a project <ArrowUpRight size={16} /></button></motion.div><motion.div className="dashboard-grid" {...reveal}><article className="dashboard-profile"><div className="profile-avatar">YOU</div><p className="dash-label">YOUR PROFILE</p><h3>Creative specialist</h3><button type="button" onClick={() => toast.message("Profile editing can be connected to your account backend when you are ready.")}>Edit profile <ArrowUpRight size={15} /></button></article><article className="dashboard-card"><div className="dash-title"><span><MessageSquareText size={17} /> PROPOSALS</span><b>{proposals.length}</b></div>{proposals.length ? <div className="dash-items">{proposals.map((proposal, index) => <div key={`${proposal.title}-${index}`}><span>{proposal.title}</span><b>{proposal.status}</b></div>)}</div> : <div className="dash-empty"><Send size={20} /><p>Proposals you send appear here</p></div>}</article><article className="dashboard-card"><div className="dash-title"><span><Heart size={17} /> SAVED PROJECTS</span><b>{saved.length}</b></div>{saved.length ? <div className="dash-items">{projects.filter((project) => saved.includes(project.id)).map((project) => <div key={project.id}><span>{project.title}</span><button type="button" onClick={() => setSelectedProject(project)}>Open</button></div>)}</div> : <div className="dash-empty"><BriefcaseBusiness size={20} /><p>Save projects to compare them here</p></div>}</article><article className="dashboard-card status-card"><div className="dash-title"><span><Clock3 size={17} /> PROJECT STATUS</span><span className="status-live"><i /> AVAILABLE</span></div><div className="status-list"><div><span>Profile readiness</span><b><CheckCircle2 size={15} /> Ready</b></div><div><span>Posted projects</span><b>{postedProjects.length ? `${postedProjects.length} active` : "Not started"}</b></div><div><span>Proposal activity</span><b>{proposals.length ? "Active" : "Waiting"}</b></div></div></article><article className="dashboard-chat"><div className="chat-heading"><div><p className="dash-label">CONVERSATION PREVIEW</p><h3><MessageCircle size={17} /> Tide & Form</h3></div><span><i /> Online</span></div><div className="chat-context"><span>Mobile checkout redesign</span><button type="button" onClick={() => setSelectedProject(projects[0])}>Open project <ArrowUpRight size={13} /></button></div><div className="chat-thread">{chatMessages.map((message) => <div className={`chat-message ${message.mine ? "mine" : ""}`} key={message.id}><span className="chat-avatar">{message.initials}</span><div><p><b>{message.sender}</b><time>{message.time}</time></p><span>{message.body}</span></div></div>)}</div><div className="chat-compose"><input value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendChat(); }} placeholder="Write a message…" aria-label="Chat message" /><button type="button" onClick={sendChat} aria-label="Send message"><Send size={16} /></button></div></article></motion.div></section>

        <CommunicationPanel onIncomingMessage={() => addNotification("message", "New message from Tide & Form", "Mobile checkout redesign")} />
        <section className="closing-section"><div className="relay-shell closing-wrap"><motion.div {...reveal}><p className="section-kicker">READY TO START?</p><h2><span>Bring the right people together</span><span>and build what matters.</span></h2></motion.div><motion.div className="closing-actions" {...reveal} transition={{ ...reveal.transition, delay: .07 }}><button type="button" className="primary-button" onClick={() => scrollTo("projects")}>Explore projects <ArrowRight size={18} /></button><button type="button" className="outline-button" onClick={openPosting}>Post a project <Command size={16} /></button></motion.div></div></section>
      </main>

      <footer className="relay-footer relay-shell"><div><a href="#top" className="relay-brand"><img src={assets.logo} alt="" /><span>PROJECT RELAY</span></a><p>A deliberate marketplace for independent work and the teams that value it.</p></div><div className="footer-links"><div><span>EXPLORE</span><a href="#projects">Open briefs</a><a href="#talent">Featured talent</a><a href="#dashboard">My workboard</a></div><div><span>CONNECT</span><a href="mailto:hello@projectrelay.example">hello@projectrelay.example</a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></div></div><p className="footer-bottom">© 2026 Project Relay. Built for the freelance marketplace brief.</p></footer>

      <AnimatePresence>{selectedProject && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSelectedProject(null)}><motion.section className="brief-modal" role="dialog" aria-modal="true" aria-labelledby="brief-title" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 22 }} transition={{ duration: .28, ease: easeOut }} onMouseDown={(event) => event.stopPropagation()}><header><span>PROJECT BRIEF / 0{selectedProject.id}</span><button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project brief"><X size={19} /></button></header><div className="brief-modal-body"><div className={`brief-accent accent-${selectedProject.accent}`}><span>{selectedProject.company.slice(0, 1)}</span><p>{selectedProject.company}</p></div><p className="brief-category">{selectedProject.category} <i /> {selectedProject.format}</p><h2 id="brief-title">{selectedProject.title}</h2><p className="brief-description">{selectedProject.description}</p><div className="brief-details"><div><span>BUDGET</span><b>{selectedProject.budget}</b></div><div><span>APPLICATION</span><b>{selectedProject.deadline}</b></div></div><div className="brief-scope"><span>THE WORK</span><p>{selectedProject.scope}</p></div><div className="brief-skills"><span>REQUIRED SKILLS</span><div className="project-tags">{selectedProject.skills.map((skill) => <b key={skill}>{skill}</b>)}</div></div><div className="brief-modal-actions"><button type="button" className="primary-button" onClick={() => { setProposalProject(selectedProject); setSelectedProject(null); }}>Send a proposal <Send size={16} /></button><button type="button" className={`save-button big-save ${saved.includes(selectedProject.id) ? "saved" : ""}`} onClick={() => toggleSaved(selectedProject.id)}><Heart size={16} fill={saved.includes(selectedProject.id) ? "currentColor" : "none"} /> {saved.includes(selectedProject.id) ? "Saved" : "Save brief"}</button></div></div></motion.section></motion.div>}</AnimatePresence>
      <AnimatePresence>{proposalProject && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setProposalProject(null)}><motion.section className="proposal-modal" role="dialog" aria-modal="true" aria-labelledby="proposal-title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: .25, ease: easeOut }} onMouseDown={(event) => event.stopPropagation()}><header><div><span>NEW PROPOSAL</span><h2 id="proposal-title">{proposalProject.title}</h2></div><button type="button" onClick={() => setProposalProject(null)} aria-label="Close proposal form"><X size={19} /></button></header><form onSubmit={submitProposal}><div className="proposal-grid"><label>Your name<input name="name" placeholder="How should the client know you?" /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" /></label></div><label>Expected budget<input name="budget" placeholder="For example: $2,800" /></label><label>Proposal / cover letter<textarea name="message" rows={6} placeholder="Introduce your approach, the relevant work you have done, and the next step you would take." /></label>{formError && <p className="form-error">{formError}</p>}<div className="proposal-footer"><p>By sending, this proposal will appear in your workboard.</p><button type="submit" className="primary-button">Send proposal <Send size={16} /></button></div></form></motion.section></motion.div>}</AnimatePresence>
      <AnimatePresence>{postingOpen && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setPostingOpen(false)}><motion.section className="post-modal" role="dialog" aria-modal="true" aria-labelledby="post-title" initial={{ opacity: 0, y: 20, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .985 }} transition={{ duration: .26, ease: easeOut }} onMouseDown={(event) => event.stopPropagation()}><header><div><span>CLIENT INTAKE / STEP {postStep} OF 3</span><h2 id="post-title">{postStep === 1 ? "Set the project foundation" : postStep === 2 ? "Shape the brief" : "Review before it goes live"}</h2></div><button type="button" onClick={() => setPostingOpen(false)} aria-label="Close project posting"><X size={19} /></button></header><div className="post-progress"><i className={postStep >= 1 ? "active" : ""} /><i className={postStep >= 2 ? "active" : ""} /><i className={postStep >= 3 ? "active" : ""} /></div><div className="post-modal-body">{postStep === 1 && <div className="post-fields"><p className="post-intro">Start with enough context for the right people to spot a fit quickly.</p><label>Project title<input value={postForm.title} onChange={(event) => updatePost("title", event.target.value)} placeholder="For example: Redesign our supplier portal" /></label><div className="post-two-col"><label>Category<select value={postForm.category} onChange={(event) => updatePost("category", event.target.value)}><option value="">Choose a category</option>{categories.map((item) => <option key={item.label}>{item.label}</option>)}</select></label><label>Expected budget<input value={postForm.budget} onChange={(event) => updatePost("budget", event.target.value)} placeholder="For example: $3,000–$4,000" /></label></div><label>Application deadline<input value={postForm.deadline} onChange={(event) => updatePost("deadline", event.target.value)} type="date" /></label></div>}{postStep === 2 && <div className="post-fields"><div className="post-ai-header"><div><span><Bot size={15} /> WRITING ASSISTANT</span><p>Start with your project goal. The assistant will turn it into a clear marketplace description you can edit.</p></div><button type="button" className="ai-button" onClick={generateDescription} disabled={descriptionAssistant.isPending}>{descriptionAssistant.isPending ? "Writing…" : <><WandSparkles size={15} /> Generate description</>}</button></div><label>What are you trying to achieve?<textarea value={postForm.goal} onChange={(event) => updatePost("goal", event.target.value)} rows={3} placeholder="Describe the outcome you need, the user problem, and the context a specialist should understand." /></label><div className="post-two-col"><label>Key skills<input value={postForm.skills} onChange={(event) => updatePost("skills", event.target.value)} placeholder="Figma, research, React…" /></label><label>Writing tone<select value={postForm.tone} onChange={(event) => updatePost("tone", event.target.value)}><option>Clear and professional</option><option>Direct and concise</option><option>Warm and collaborative</option></select></label></div><label>Project description<textarea value={postForm.description} onChange={(event) => updatePost("description", event.target.value)} rows={6} placeholder="Add your own draft or use the writing assistant once the goal is clear." /></label>{postForm.deliverables.length > 0 && <div className="generated-deliverables"><span><ListChecks size={15} /> SUGGESTED DELIVERABLES</span><div>{postForm.deliverables.map((item) => <b key={item}>{item}</b>)}</div></div>}</div>}{postStep === 3 && <div className="post-preview"><div className="preview-status"><FileCheck2 size={17} /> Ready to publish</div><p className="preview-category">{postForm.category} <i /> Deadline: {postForm.deadline}</p><h3>{postForm.title}</h3><p>{postForm.description}</p><div className="preview-facts"><div><span>BUDGET</span><b>{postForm.budget}</b></div><div><span>SKILLS</span><b>{postForm.skills || "To be confirmed"}</b></div></div>{postForm.deliverables.length > 0 && <div className="preview-deliverables"><span>DELIVERABLES</span>{postForm.deliverables.map((item) => <p key={item}><CheckCircle2 size={15} /> {item}</p>)}</div>}</div>}{postError && <p className="form-error">{postError}</p>}<div className="post-footer">{postStep > 1 ? <button type="button" className="text-button" onClick={() => { setPostError(""); setPostStep((current) => current - 1); }}>Back</button> : <span />} {postStep < 3 ? <button type="button" className="primary-button" onClick={advancePosting}>Continue <ArrowRight size={16} /></button> : <button type="button" className="primary-button" onClick={submitPostedProject}>Post project <Send size={16} /></button>}</div></div></motion.section></motion.div>}</AnimatePresence>
    </div>
  );
}
