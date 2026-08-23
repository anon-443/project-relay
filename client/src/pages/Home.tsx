/**
 * The Workroom design reminder: clarity is the interface. Use Swiss-editorial hierarchy,
 * paper-like space, cobalt framing, and orange only for actions, live signals, and statuses.
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Command,
  ExternalLink,
  Filter,
  Heart,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Search,
  Send,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const assets = {
  hero: "/manus-storage/project-relay-hero-workroom_d5d6ef3d.jpg",
  talent: "/manus-storage/project-relay-talent-collage_d0fc082c.jpg",
  board: "/manus-storage/project-relay-brief-board_b04c809a.jpg",
  logo: "/manus-storage/project-relay-mark_fe132e43.png",
};

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];
const reveal = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.16 }, transition: { duration: 0.48, ease: easeOut } };

type Project = {
  id: number;
  title: string;
  company: string;
  category: string;
  budget: string;
  budgetValue: number;
  deadline: string;
  description: string;
  skills: string[];
  format: string;
  accent: "blue" | "orange" | "ink";
  scope: string;
};

type Freelancer = {
  id: number;
  initials: string;
  name: string;
  role: string;
  level: "Emerging" | "Mid-level" | "Senior";
  skills: string[];
  bio: string;
  accent: "blue" | "orange" | "cream";
  portfolio: string;
};

const projects: Project[] = [
  { id: 1, title: "Design a mobile checkout that does less, better", company: "Tide & Form", category: "Product design", budget: "$2,400–$3,200", budgetValue: 3200, deadline: "Apply by 18 Jun", description: "Reframe a premium commerce checkout around calm decision making, one-handed use, and a clearer handoff to payment.", skills: ["Figma", "Mobile UX", "Systems"], format: "Remote / 3 weeks", accent: "blue", scope: "Map the current checkout flow, create a concise component strategy, and deliver a tested mobile prototype for an existing commerce product." },
  { id: 2, title: "Build a launch narrative for a climate data platform", company: "Morrow Grid", category: "Copywriting", budget: "$1,600–$2,100", budgetValue: 2100, deadline: "Apply by 21 Jun", description: "Turn technical product capability into a landing-page story that makes the first customer conversation simpler.", skills: ["Brand writing", "SaaS", "Research"], format: "Remote / 2 weeks", accent: "orange", scope: "Develop page hierarchy, long-form messaging, product proof points, and a concise set of launch assets for a B2B climate analytics platform." },
  { id: 3, title: "Create an identity kit for a local food publisher", company: "Common Table", category: "Brand & identity", budget: "$3,500–$4,500", budgetValue: 4500, deadline: "Apply by 25 Jun", description: "Build an expressive, practical visual system for a new editorial platform covering independent food culture.", skills: ["Identity", "Art direction", "Editorial"], format: "Hybrid / 4 weeks", accent: "ink", scope: "Explore naming applications, logo use, color, type, social templates, and lightweight editorial guidelines for a small publication team." },
  { id: 4, title: "Prototype a frictionless creator onboarding flow", company: "Ripple Studio", category: "Web development", budget: "$2,800–$3,800", budgetValue: 3800, deadline: "Apply by 27 Jun", description: "Design and build a browser onboarding sequence that converts a complex creator setup into a confident first session.", skills: ["React", "UX", "Animation"], format: "Remote / 3 weeks", accent: "blue", scope: "Define the interaction model, prototype core screens, and deliver a responsive front-end sequence with accessible validation states." },
  { id: 5, title: "Plan a short-form campaign for an independent hotel", company: "Field Notes Hotel", category: "Digital marketing", budget: "$1,200–$1,800", budgetValue: 1800, deadline: "Apply by 29 Jun", description: "Create a focused campaign plan for a quiet, design-led hotel opening in a coastal town.", skills: ["Strategy", "Social", "Content"], format: "On-site / 2 weeks", accent: "orange", scope: "Shape channel strategy, messaging, a content calendar, and production direction around a three-week opening campaign." },
];

const freelancers: Freelancer[] = [
  { id: 1, initials: "MN", name: "Mira Nori", role: "Product designer", level: "Senior", skills: ["Figma", "Design systems", "Research"], bio: "Turns complex product decisions into clear, usable flows for ambitious teams.", accent: "blue", portfolio: "Fintech & commerce systems" },
  { id: 2, initials: "AJ", name: "Ari James", role: "Frontend developer", level: "Mid-level", skills: ["React", "Motion", "Accessibility"], bio: "Builds responsive interfaces with careful interaction, strong structure, and durable component logic.", accent: "orange", portfolio: "SaaS onboarding & product sites" },
  { id: 3, initials: "RK", name: "Rina Kade", role: "Brand writer", level: "Senior", skills: ["Messaging", "B2B", "Editorial"], bio: "Makes technical products easier to understand, choose, and talk about.", accent: "cream", portfolio: "Climate & developer tools" },
  { id: 4, initials: "DS", name: "Dara Sun", role: "Growth strategist", level: "Emerging", skills: ["Campaigns", "Audience", "Analytics"], bio: "Pairs sharp creative planning with practical launch experiments for small teams.", accent: "blue", portfolio: "Hospitality & cultural brands" },
];

const categories = [
  { label: "Product design", count: 42, icon: "✦", tone: "blue" },
  { label: "Web development", count: 38, icon: "⌘", tone: "ink" },
  { label: "Brand & identity", count: 27, icon: "◒", tone: "orange" },
  { label: "Copywriting", count: 21, icon: "Aa", tone: "cream" },
  { label: "Digital marketing", count: 18, icon: "↗", tone: "blue" },
];

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    const persisted = window.localStorage.getItem("relay-saved-projects");
    if (persisted) setSaved(JSON.parse(persisted));
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
    return freelancers.filter((freelancer) => {
      const matchesTerm = !term || [freelancer.name, freelancer.role, freelancer.bio, ...freelancer.skills].join(" ").toLowerCase().includes(term);
      return matchesTerm && (experience === "All levels" || freelancer.level === experience);
    });
  }, [freelancerTerm, experience]);

  function toggleSaved(id: number) {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((projectId) => projectId !== id) : [...current, id];
      window.localStorage.setItem("relay-saved-projects", JSON.stringify(next));
      toast.success(next.includes(id) ? "Project saved to your workboard." : "Project removed from your workboard.");
      return next;
    });
  }

  function submitProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const required = ["name", "email", "budget", "message"];
    const missing = required.some((field) => !String(form.get(field) || "").trim());
    if (missing) { setFormError("Please add your name, email, expected budget, and a short proposal before sending."); return; }
    setProposals((current) => [{ title: proposalProject?.title || "Project", status: "Sent for review" }, ...current]);
    setFormError("");
    event.currentTarget.reset();
    toast.success("Proposal sent. It now appears in your workboard.");
    setProposalProject(null);
  }

  return (
    <div className="relay-app" id="top">
      <header className="relay-header">
        <a href="#top" className="relay-brand" aria-label="Project Relay home"><img src={assets.logo} alt="Project Relay mark" /><span>PROJECT RELAY</span></a>
        <nav className="relay-nav" aria-label="Primary navigation">
          <a href="#projects">Find work</a><a href="#talent">Find talent</a><a href="#dashboard">Workboard</a>
        </nav>
        <div className="header-actions">
          <button className="header-login" type="button" onClick={() => scrollTo("dashboard")}>My workboard</button>
          <button className="header-cta" type="button" onClick={() => scrollTo("projects")}>Post a project <ArrowUpRight size={15} /></button>
        </div>
        <button className="mobile-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Open menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .2, ease: easeOut }}>
          <a href="#projects" onClick={() => setMenuOpen(false)}>Find work</a><a href="#talent" onClick={() => setMenuOpen(false)}>Find talent</a><a href="#dashboard" onClick={() => setMenuOpen(false)}>My workboard</a><button onClick={() => { setMenuOpen(false); scrollTo("projects"); }}>Post a project <ArrowUpRight size={15} /></button>
        </motion.nav>}</AnimatePresence>
      </header>

      <main>
        <section className="relay-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <motion.p className="section-kicker" {...reveal}><i /> Independent work, better connected</motion.p>
            <motion.h1 id="hero-title" {...reveal} transition={{ ...reveal.transition, delay: .04 }}>Good work <em>finds</em> its way.</motion.h1>
            <motion.p className="hero-description" {...reveal} transition={{ ...reveal.transition, delay: .08 }}>A focused marketplace for specialists and thoughtful teams. Discover clear briefs, make a case for your craft, and keep every opportunity in one place.</motion.p>
            <motion.div className="hero-actions" {...reveal} transition={{ ...reveal.transition, delay: .12 }}>
              <button className="primary-button" type="button" onClick={() => scrollTo("projects")}>Explore open briefs <ArrowDownRight size={18} /></button>
              <button className="text-button" type="button" onClick={() => scrollTo("talent")}>Browse specialist profiles <ArrowRight size={17} /></button>
            </motion.div>
            <motion.div className="hero-trustline" {...reveal} transition={{ ...reveal.transition, delay: .16 }}><span><b>146</b> active briefs</span><span><b>24h</b> typical response window</span><span><b>One place</b> for the full thread</span></motion.div>
          </div>
          <motion.div className="hero-visual" {...reveal} transition={{ ...reveal.transition, delay: .1 }}>
            <img src={assets.hero} alt="Editorial creative studio worktable with project planning materials" />
            <div className="hero-brief-card"><p>OPEN BRIEF <span>⌁</span></p><strong>Mobile checkout redesign</strong><div><span>Product design</span><b>$2.4k–$3.2k</b></div></div>
            <div className="hero-stamp">MATCH<br />THE<br />WORK</div>
            <div className="hero-index">01 / START HERE</div>
          </motion.div>
        </section>

        <section className="category-section relay-shell" aria-labelledby="category-title">
          <motion.div className="section-title-row" {...reveal}><div><p className="section-kicker">01 / EXPLORE BY CRAFT</p><h2 id="category-title">A good brief starts with the right <em>discipline.</em></h2></div><button type="button" className="mini-link" onClick={() => scrollTo("projects")}>All open briefs <ArrowUpRight size={16} /></button></motion.div>
          <div className="category-grid">
            {categories.map((item, index) => <motion.button key={item.label} className={`category-card tone-${item.tone}`} type="button" {...reveal} transition={{ ...reveal.transition, delay: index * .045 }} onClick={() => { setCategory(item.label); scrollTo("projects"); }}><span className="category-icon">{item.icon}</span><span className="category-label">{item.label}</span><span className="category-count">{item.count} briefs <ArrowUpRight size={14} /></span></motion.button>)}
          </div>
        </section>

        <section className="featured-section" aria-labelledby="featured-title">
          <div className="relay-shell featured-layout">
            <motion.div className="featured-image" {...reveal}><img src={assets.board} alt="Creative project brief planning board" /><span className="image-caption">BRIEF, THEN BUILD / 02</span></motion.div>
            <motion.div className="featured-copy" {...reveal} transition={{ ...reveal.transition, delay: .08 }}><p className="section-kicker">THE RELAY METHOD</p><h2 id="featured-title">A brief with a <em>point of view.</em></h2><p>Project Relay is made for work that deserves more than a vague description. Every brief carries the context, constraints, and practical next move a specialist needs to decide with confidence.</p><div className="method-list"><span><b>01</b> Scope before surface</span><span><b>02</b> Skills with context</span><span><b>03</b> A proposal in one focused thread</span></div></motion.div>
          </div>
        </section>

        <section id="projects" className="projects-section relay-shell" aria-labelledby="projects-title">
          <motion.div className="section-title-row project-heading" {...reveal}><div><p className="section-kicker">02 / OPEN PROJECTS</p><h2 id="projects-title">Show me what needs <em>making.</em></h2></div><p>Search by title, skill, or client. Then narrow the list without losing the useful parts.</p></motion.div>
          <motion.div className="project-search-bar" {...reveal}><label className="search-field"><Search size={18} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search projects, clients, or skills" aria-label="Search projects" /></label><div className="select-group"><Filter size={16} /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category"><option>All categories</option>{categories.map((item) => <option key={item.label}>{item.label}</option>)}</select></div><div className="select-group"><select value={budget} onChange={(event) => setBudget(event.target.value)} aria-label="Filter by budget"><option>Any budget</option><option>Under $2k</option><option>$2k–$3.5k</option><option>Over $3.5k</option></select><ChevronDown size={15} /></div></motion.div>
          <div className="project-list-toolbar"><span><b>{filteredProjects.length}</b> matching briefs</span><label>Sort <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest</option><option>Budget: high</option><option>Budget: low</option></select></label></div>
          <div className="project-list">
            <AnimatePresence mode="popLayout">{filteredProjects.map((project) => <motion.article layout key={project.id} className={`project-card accent-${project.accent}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .28, ease: easeOut }}><div className="project-card-main"><div className="project-card-top"><span className="company-mark">{project.company.slice(0, 1)}</span><span>{project.company}</span><button className={`save-button ${saved.includes(project.id) ? "saved" : ""}`} type="button" onClick={() => toggleSaved(project.id)} aria-label="Save project"><Heart size={16} fill={saved.includes(project.id) ? "currentColor" : "none"} /></button></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-tags">{project.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="project-card-side"><div><p>BUDGET</p><strong>{project.budget}</strong></div><div><p>FORMAT</p><span>{project.format}</span></div><div><p>DEADLINE</p><span>{project.deadline}</span></div><button type="button" onClick={() => setSelectedProject(project)}>View brief <ArrowUpRight size={16} /></button></div></motion.article>)}</AnimatePresence>
            {filteredProjects.length === 0 && <div className="empty-state"><Search size={24} /><p>No briefs match those filters yet.</p><button type="button" onClick={() => { setSearchTerm(""); setCategory("All categories"); setBudget("Any budget"); }}>Reset filters</button></div>}
          </div>
        </section>

        <section id="talent" className="talent-section" aria-labelledby="talent-title">
          <div className="relay-shell talent-layout">
            <motion.div className="talent-intro" {...reveal}><p className="section-kicker">03 / FEATURED TALENT</p><h2 id="talent-title">Specialists with a clear <em>way of working.</em></h2><p>Explore focused profiles by craft and experience level. Look for a match in the way they think as much as the tools they use.</p><img src={assets.talent} alt="Editorial collage of creative professionals" /></motion.div>
            <motion.div className="talent-directory" {...reveal} transition={{ ...reveal.transition, delay: .08 }}><div className="talent-filter"><label><Search size={16} /><input value={freelancerTerm} onChange={(event) => setFreelancerTerm(event.target.value)} placeholder="Search skills" aria-label="Search freelancer skills" /></label><select value={experience} onChange={(event) => setExperience(event.target.value)} aria-label="Filter freelancers by expertise level"><option>All levels</option><option>Emerging</option><option>Mid-level</option><option>Senior</option></select></div><div className="talent-list">{filteredFreelancers.map((freelancer) => <article className="freelancer-card" key={freelancer.id}><div className={`avatar avatar-${freelancer.accent}`}>{freelancer.initials}</div><div className="freelancer-core"><div className="freelancer-heading"><h3>{freelancer.name}</h3><span>{freelancer.level}</span></div><p className="freelancer-role">{freelancer.role}</p><p className="freelancer-bio">{freelancer.bio}</p><div className="project-tags">{freelancer.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="portfolio-note"><span>WORK SAMPLES</span><p>{freelancer.portfolio}</p><button type="button" onClick={() => toast.message("Profile workspace opened — sample portfolio links can be connected here.")}>View profile <ExternalLink size={14} /></button></div></article>)}{filteredFreelancers.length === 0 && <div className="empty-state talent-empty"><CircleUserRound size={24} /><p>No specialists match that search.</p></div>}</div></motion.div>
          </div>
        </section>

        <section id="dashboard" className="dashboard-section relay-shell" aria-labelledby="dashboard-title">
          <motion.div className="section-title-row dashboard-heading" {...reveal}><div><p className="section-kicker">04 / YOUR WORKBOARD</p><h2 id="dashboard-title">Keep the next move <em>visible.</em></h2></div><button type="button" className="mini-link" onClick={() => scrollTo("projects")}>Find another brief <ArrowUpRight size={16} /></button></motion.div>
          <motion.div className="dashboard-grid" {...reveal}><article className="dashboard-profile"><div className="profile-avatar">YOU</div><p className="dash-label">YOUR PROFILE</p><h3>Creative specialist</h3><p>Set your availability and keep your strongest work close to the next opportunity.</p><button type="button" onClick={() => toast.message("Profile editing can be connected to your account backend when you are ready.")}>Edit profile <ArrowUpRight size={15} /></button></article><article className="dashboard-card"><div className="dash-title"><span><MessageSquareText size={17} /> PROPOSALS</span><b>{proposals.length}</b></div>{proposals.length ? <div className="dash-items">{proposals.map((proposal, index) => <div key={`${proposal.title}-${index}`}><span>{proposal.title}</span><b>{proposal.status}</b></div>)}</div> : <div className="dash-empty"><Send size={20} /><p>Your sent proposals will appear here.</p></div>}</article><article className="dashboard-card"><div className="dash-title"><span><Heart size={17} /> SAVED BRIEFS</span><b>{saved.length}</b></div>{saved.length ? <div className="dash-items">{projects.filter((project) => saved.includes(project.id)).map((project) => <div key={project.id}><span>{project.title}</span><button type="button" onClick={() => setSelectedProject(project)}>Open</button></div>)}</div> : <div className="dash-empty"><BriefcaseBusiness size={20} /><p>Save briefs to compare them here.</p></div>}</article><article className="dashboard-card status-card"><div className="dash-title"><span><Clock3 size={17} /> PROJECT STATUS</span><span className="status-live"><i /> AVAILABLE</span></div><div className="status-list"><div><span>Profile readiness</span><b><CheckCircle2 size={15} /> Ready</b></div><div><span>Saved opportunity review</span><b>{saved.length ? "In progress" : "Not started"}</b></div><div><span>Proposal activity</span><b>{proposals.length ? "Active" : "Waiting"}</b></div></div></article></motion.div>
        </section>

        <section className="closing-section"><div className="relay-shell closing-wrap"><motion.div {...reveal}><p className="section-kicker">READY WHEN THE BRIEF IS</p><h2>Make the next working relationship a good one.</h2></motion.div><motion.div className="closing-actions" {...reveal} transition={{ ...reveal.transition, delay: .07 }}><button type="button" className="primary-button" onClick={() => scrollTo("projects")}>Find a project <ArrowRight size={18} /></button><button type="button" className="outline-button" onClick={() => toast.message("A client posting flow would start with scope, budget, deadline, and required skills.")}>Post a project <Command size={16} /></button></motion.div></div></section>
      </main>

      <footer className="relay-footer relay-shell"><div><a href="#top" className="relay-brand"><img src={assets.logo} alt="" /><span>PROJECT RELAY</span></a><p>A deliberate marketplace for independent work and the teams that value it.</p></div><div className="footer-links"><div><span>EXPLORE</span><a href="#projects">Open briefs</a><a href="#talent">Featured talent</a><a href="#dashboard">My workboard</a></div><div><span>CONNECT</span><a href="mailto:hello@projectrelay.example">hello@projectrelay.example</a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></div></div><p className="footer-bottom">© 2026 Project Relay. Built for the freelance marketplace brief.</p></footer>

      <AnimatePresence>{selectedProject && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setSelectedProject(null)}><motion.section className="brief-modal" role="dialog" aria-modal="true" aria-labelledby="brief-title" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 22 }} transition={{ duration: .28, ease: easeOut }} onMouseDown={(event) => event.stopPropagation()}><header><span>PROJECT BRIEF / 0{selectedProject.id}</span><button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project brief"><X size={19} /></button></header><div className="brief-modal-body"><div className={`brief-accent accent-${selectedProject.accent}`}><span>{selectedProject.company.slice(0, 1)}</span><p>{selectedProject.company}</p></div><p className="brief-category">{selectedProject.category} <i /> {selectedProject.format}</p><h2 id="brief-title">{selectedProject.title}</h2><p className="brief-description">{selectedProject.description}</p><div className="brief-details"><div><span>BUDGET</span><b>{selectedProject.budget}</b></div><div><span>APPLICATION</span><b>{selectedProject.deadline}</b></div></div><div className="brief-scope"><span>THE WORK</span><p>{selectedProject.scope}</p></div><div className="brief-skills"><span>REQUIRED SKILLS</span><div className="project-tags">{selectedProject.skills.map((skill) => <b key={skill}>{skill}</b>)}</div></div><div className="brief-modal-actions"><button type="button" className="primary-button" onClick={() => { setProposalProject(selectedProject); setSelectedProject(null); }}>Send a proposal <Send size={16} /></button><button type="button" className={`save-button big-save ${saved.includes(selectedProject.id) ? "saved" : ""}`} onClick={() => toggleSaved(selectedProject.id)}><Heart size={16} fill={saved.includes(selectedProject.id) ? "currentColor" : "none"} /> {saved.includes(selectedProject.id) ? "Saved" : "Save brief"}</button></div></div></motion.section></motion.div>}</AnimatePresence>
      <AnimatePresence>{proposalProject && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setProposalProject(null)}><motion.section className="proposal-modal" role="dialog" aria-modal="true" aria-labelledby="proposal-title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: .25, ease: easeOut }} onMouseDown={(event) => event.stopPropagation()}><header><div><span>NEW PROPOSAL</span><h2 id="proposal-title">{proposalProject.title}</h2></div><button type="button" onClick={() => setProposalProject(null)} aria-label="Close proposal form"><X size={19} /></button></header><form onSubmit={submitProposal}><div className="proposal-grid"><label>Your name<input name="name" placeholder="How should the client know you?" /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" /></label></div><label>Expected budget<input name="budget" placeholder="For example: $2,800" /></label><label>Proposal / cover letter<textarea name="message" rows={6} placeholder="Introduce your approach, the relevant work you have done, and the next step you would take." /></label>{formError && <p className="form-error">{formError}</p>}<div className="proposal-footer"><p>By sending, this proposal will appear in your workboard.</p><button type="submit" className="primary-button">Send proposal <Send size={16} /></button></div></form></motion.section></motion.div>}</AnimatePresence>
    </div>
  );
}
