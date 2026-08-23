/**
 * Signal Room design reminder: Build the page like a premium product field journal.
 * Use editorial asymmetry, technical captions, quiet graphite space, and rare Signal Lime emphasis.
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Clipboard,
  Code2,
  ExternalLink,
  Layers3,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];

const assets = {
  hero: "/manus-storage/orbitfolio-hero-signal_be388db6.jpg",
  relay: "/manus-storage/orbitfolio-freelance-case_16791865.jpg",
  atlas: "/manus-storage/orbitfolio-market-case_146ffa99.jpg",
  logo: "/manus-storage/orbitfolio-orbit-mark_123dc03a.png",
};

type Project = {
  id: "relay" | "atlas";
  number: string;
  task: string;
  title: string;
  descriptor: string;
  introduction: string;
  image: string;
  imageAlt: string;
  palette: string;
  coreFlow: string;
  scope: string;
  capabilities: string[];
  evidence: string[];
  notes: string[];
  linkedinLine: string;
};

const projects: Project[] = [
  {
    id: "relay",
    number: "01",
    task: "Task 02 / Freelancing Marketplace",
    title: "Project Relay",
    descriptor: "A clearer way to move from opportunity to proposal.",
    introduction:
      "A two-sided marketplace concept that gives clients and independent talent a shared, structured place to discover work, assess fit, and start a proposal conversation.",
    image: assets.relay,
    imageAlt: "Dark premium freelance marketplace interface concept on a laptop",
    palette: "Relay / signal workflow",
    coreFlow: "Discover → filter → shortlist → propose",
    scope: "Client + freelancer journeys",
    capabilities: ["Role-aware listings", "Skill-based discovery", "Proposal form logic", "Status dashboard"],
    evidence: ["Role model", "Skill filter", "Proposal state"],
    notes: [
      "The main experience must let clients publish a clear brief without turning the page into a wall of form fields.",
      "Freelancers need filters that make relevance visible quickly: role, skill cluster, budget, and timeline.",
      "The proposal flow is treated as a decision aid, with a focused cover letter, expected budget, and a concise brief recap.",
      "A compact dashboard brings posted projects, submitted proposals, and profile context into one calm surface.",
    ],
    linkedinLine:
      "Built Project Relay, a freelance marketplace concept focused on making discovery, fit assessment, and proposal submission feel clear for both clients and independent talent.",
  },
  {
    id: "atlas",
    number: "02",
    task: "Task 03 / Multi-Vendor Marketplace",
    title: "Atlas Market",
    descriptor: "A marketplace architecture where vendors stay visible.",
    introduction:
      "A multi-vendor commerce system designed around the complexity that matters: product discovery, seller context, cart state, and a checkout experience that still feels cohesive.",
    image: assets.atlas,
    imageAlt: "Dimensional commerce marketplace product concept with modular vendor and inventory tiles",
    palette: "Atlas / commerce system",
    coreFlow: "Browse → compare → cart → checkout",
    scope: "Customer + vendor journeys",
    capabilities: ["Vendor storefronts", "Product discovery", "Dynamic cart state", "Checkout validation"],
    evidence: ["Vendor context", "Cart state", "Checkout logic"],
    notes: [
      "Product cards must carry enough vendor context to support a confident choice while remaining fast to scan.",
      "Search, category, price, popularity, and availability work as one discovery system rather than isolated controls.",
      "The cart preserves vendor relationships and gives quantity, total, and removal actions immediate feedback.",
      "Individual vendor pages make the seller feel like a real destination inside one connected marketplace.",
    ],
    linkedinLine:
      "Designed Atlas Market, a multi-vendor marketplace concept that brings vendor context, product discovery, cart state, and checkout validation into one cohesive commerce flow.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.55, ease: easeOut },
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const copyLinkedInSummary = () => {
    const copy = `Phase 2 portfolio update — I selected two advanced marketplace builds: Project Relay (a freelancing marketplace) and Atlas Market (a multi-vendor marketplace). Together, they let me practise multi-role user flows, discovery and filtering, proposal and cart state, validation, and dashboard-style information architecture. Built as part of the Sqrock IT Solutions internship.`;
    navigator.clipboard?.writeText(copy);
    toast.success("LinkedIn angle copied — tailor it with your build details before posting.");
  };

  return (
    <div className="orbitfolio-shell" id="top">
      <div className="page-grain" aria-hidden="true" />

      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Orbitfolio home">
          <img src={assets.logo} alt="Orbitfolio split orbit mark" className="brand-mark" />
          <span className="brand-wordmark">ORBITFOLIO</span>
          <span className="brand-slash">/</span>
          <span className="brand-owner">PRODUCT SYSTEMS</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">Selected work</a>
          <a href="#selection">Why these two</a>
          <a href="#profile">Profile</a>
        </nav>

        <button
          type="button"
          className="nav-copy-button"
          onClick={copyLinkedInSummary}
          aria-label="Copy LinkedIn project summary"
        >
          <Clipboard size={15} strokeWidth={1.8} />
          <span>LinkedIn angle</span>
        </button>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: easeOut }}
            >
              {["work", "selection", "profile"].map((section) => (
                <a key={section} href={`#${section}`} onClick={() => setMenuOpen(false)}>
                  {section === "work" ? "Selected work" : section === "selection" ? "Why these two" : "Profile"}
                </a>
              ))}
              <button type="button" onClick={copyLinkedInSummary}>
                Copy LinkedIn angle <ArrowUpRight size={16} />
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <motion.p className="eyebrow" {...reveal}>
              <span className="live-dot" /> Phase 02 / Advanced project selection
            </motion.p>
            <motion.h1 id="hero-title" {...reveal} transition={{ ...reveal.transition, delay: 0.06 }}>
              Two marketplace systems. <em>Built for the complicated part.</em>
            </motion.h1>
            <motion.p className="hero-intro" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
              I selected the freelancing and multi-vendor marketplace briefs to demonstrate a more complete product skill set: multi-role journeys, discovery systems, dynamic state, and intentional information architecture.
            </motion.p>
            <motion.div className="hero-actions" {...reveal} transition={{ ...reveal.transition, delay: 0.18 }}>
              <button type="button" className="signal-button" onClick={() => scrollToSection("work")}>
                Explore the case studies <ArrowDownRight size={18} />
              </button>
              <button type="button" className="quiet-button" onClick={() => scrollToSection("selection")}>
                Why these projects <MoveUpRight size={17} />
              </button>
            </motion.div>
            <motion.div className="hero-metadata" {...reveal} transition={{ ...reveal.transition, delay: 0.24 }}>
              <span>React / Responsive UI</span>
              <span>Product systems / Marketplace flows</span>
              <span>Sqrock IT Solutions / Internship phase 2</span>
            </motion.div>
          </div>

          <motion.div className="hero-art" {...reveal} transition={{ ...reveal.transition, delay: 0.08 }}>
            <img src={assets.hero} alt="Abstract graphite orbital sculpture with a lime signal point" />
            <div className="hero-system-proof" aria-label="Marketplace system focus">
              <div><span>01</span><p>ROLE<br />MODEL</p></div>
              <div><span>02</span><p>DISCOVERY<br />LOGIC</p></div>
              <div><span>03</span><p>STATE<br />FLOW</p></div>
            </div>
            <div className="hero-path" aria-hidden="true"><i /><b /><i /></div>
            <div className="hero-art-caption">
              <span>System field / 01—02</span>
              <span>Marketplace workflow study</span>
            </div>
            <div className="orbit-ring orbit-ring-one" aria-hidden="true" />
            <div className="orbit-ring orbit-ring-two" aria-hidden="true" />
          </motion.div>
        </section>

        <section className="signal-marquee" aria-label="Core capabilities">
          <div className="marquee-track">
            <span>DISCOVERY SYSTEMS</span><i />
            <span>MULTI-ROLE FLOWS</span><i />
            <span>STATE MANAGEMENT</span><i />
            <span>PRODUCT CLARITY</span><i />
            <span>DISCOVERY SYSTEMS</span><i />
            <span>MULTI-ROLE FLOWS</span><i />
            <span>STATE MANAGEMENT</span><i />
            <span>PRODUCT CLARITY</span><i />
          </div>
        </section>

        <section id="work" className="work-section section-shell" aria-labelledby="work-title">
          <motion.div className="section-heading work-heading" {...reveal}>
            <div>
              <p className="section-index">01 / SELECTED WORK</p>
              <h2 id="work-title">Marketplace products where the flow <em>is</em> the feature.</h2>
            </div>
            <p>
              These aren’t simply listing pages. Each concept is shaped around the difficult handoff between people, decisions, and live application state.
            </p>
          </motion.div>

          <div className="case-study-list">
            {projects.map((project, index) => (
              <motion.article
                className={`case-study ${index % 2 === 1 ? "case-study-reversed" : ""}`}
                key={project.id}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
              >
                <div className="case-copy">
                  <div className="case-meta">
                    <span className="case-number">{project.number}</span>
                    <span>{project.task}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="case-descriptor">{project.descriptor}</p>
                  <p className="case-introduction">{project.introduction}</p>

                  <dl className="case-facts">
                    <div>
                      <dt>Core flow</dt>
                      <dd>{project.coreFlow}</dd>
                    </div>
                    <div>
                      <dt>Perspective</dt>
                      <dd>{project.scope}</dd>
                    </div>
                  </dl>

                  <div className="capability-list" aria-label={`${project.title} capabilities`}>
                    {project.capabilities.map((capability) => (
                      <span key={capability}><Check size={13} /> {capability}</span>
                    ))}
                  </div>

                  <button type="button" className="case-link" onClick={() => setActiveProject(project)}>
                    Open build notes <ArrowUpRight size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  className="case-visual"
                  onClick={() => setActiveProject(project)}
                  aria-label={`Open ${project.title} build notes`}
                >
                  <img src={project.image} alt={project.imageAlt} />
                  <span className="case-evidence" aria-label="Product system evidence">
                    {project.evidence.map((item, evidenceIndex) => <span key={item}><b>{String(evidenceIndex + 1).padStart(2, "0")}</b>{item}</span>)}
                  </span>
                  <span className="visual-corner visual-corner-top">{project.palette}</span>
                  <span className="visual-corner visual-corner-bottom">Open notes <ExternalLink size={14} /></span>
                  <span className="visual-orbit" aria-hidden="true" />
                </button>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="selection" className="selection-section section-shell" aria-labelledby="selection-title">
          <motion.div className="selection-intro" {...reveal}>
            <p className="section-index">02 / SELECTION LOGIC</p>
            <h2 id="selection-title">Why these two make a <em>stronger</em> portfolio pair.</h2>
          </motion.div>

          <motion.div className="selection-table-wrap" {...reveal}>
            <table className="selection-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Advanced product work</th>
                  <th>Portfolio signal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="table-project-id">01</span> Freelancing Marketplace</td>
                  <td>Two-sided roles, project detail structure, proposals, filters, profile context, dashboard thinking.</td>
                  <td>Shows you can design for ambiguity, matching, and decision-making—not only visual presentation.</td>
                </tr>
                <tr>
                  <td><span className="table-project-id">02</span> Multi-Vendor Marketplace</td>
                  <td>Vendor identity, commerce discovery, product detail, cart calculations, checkout validation, store pages.</td>
                  <td>Shows systems thinking across a bigger e-commerce surface with many connected states.</td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          <motion.div className="selection-note" {...reveal}>
            <Sparkles size={20} />
            <p>
              The Personal Portfolio brief is still valuable—but this site already fulfills that role. Selecting these two marketplaces gives your LinkedIn post and portfolio more product depth and a more distinctive story.
            </p>
          </motion.div>
        </section>

        <section id="profile" className="profile-section section-shell" aria-labelledby="profile-title">
          <motion.div className="profile-card" {...reveal}>
            <div className="profile-left">
              <p className="section-index">03 / BUILDER PROFILE</p>
              <h2 id="profile-title">A frontend portfolio that makes <em>thinking</em> visible.</h2>
              <p>
                Built around interface logic, visual hierarchy, and responsive execution—then documented as concise, shareable product case studies.
              </p>
              <div className="tool-tags">
                <span><Code2 size={14} /> React</span>
                <span><Layers3 size={14} /> UI systems</span>
                <span><ArrowUpRight size={14} /> Responsive layouts</span>
              </div>
            </div>
            <div className="profile-right">
              <p className="profile-label">NEXT UPDATE</p>
              <p className="profile-statement">From a brief to a working system: <strong>design the flow, build the state, document the decisions.</strong></p>
              <button type="button" className="signal-button profile-button" onClick={copyLinkedInSummary}>
                Copy LinkedIn angle <Clipboard size={17} />
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="footer section-shell">
        <a className="footer-brand" href="#top"><img src={assets.logo} alt="" /> ORBITFOLIO</a>
        <p>Two advanced marketplace case studies, documented as product systems.</p>
        <a href="#top">Back to top <ArrowUpRight size={15} /></a>
      </footer>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="project-dialog-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setActiveProject(null)}
          >
            <motion.div
              className="project-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: easeOut }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="dialog-topline">
                <span>{activeProject.task}</span>
                <button type="button" onClick={() => setActiveProject(null)} aria-label="Close build notes"><X size={18} /></button>
              </div>
              <div className="dialog-grid">
                <div>
                  <p className="section-index">BUILD NOTES / {activeProject.number}</p>
                  <h2 id="dialog-title">{activeProject.title}</h2>
                  <p className="dialog-introduction">{activeProject.introduction}</p>
                  <button
                    type="button"
                    className="copy-project-button"
                    onClick={() => {
                      navigator.clipboard?.writeText(activeProject.linkedinLine);
                      toast.success("Project summary copied for your LinkedIn draft.");
                    }}
                  >
                    Copy project summary <Clipboard size={15} />
                  </button>
                </div>
                <ol className="build-notes">
                  {activeProject.notes.map((note, index) => (
                    <li key={note}><span>{String(index + 1).padStart(2, "0")}</span><p>{note}</p></li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
