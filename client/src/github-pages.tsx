import { createRoot } from "react-dom/client";
import { githubPagesAsset, githubPagesConfig } from "./lib/githubPages";
import "./index.css";

const assets = {
  hero: githubPagesAsset("project-relay-hero-workroom_d5d6ef3d.jpg"),
  board: githubPagesAsset("project-relay-brief-board_b04c809a.jpg"),
  talent: githubPagesAsset("project-relay-talent-collage_d0fc082c.jpg"),
};

const disciplines = ["Product design", "Web development", "Brand & identity", "Copywriting", "Digital marketing"];
const briefs = [
  ["Design a mobile checkout that does less, better", "Tide & Form", "$2.4k–$3.2k", "Product design"],
  ["Build a launch narrative for a climate data platform", "Morrow Grid", "$1.6k–$2.1k", "Copywriting"],
  ["Create an identity kit for a local food publisher", "Common Table", "$3.5k–$4.5k", "Brand & identity"],
] as const;
const specialists = [
  ["MN", "Mira Nori", "Product designer", "Figma · Design systems · Research"],
  ["AJ", "Ari James", "Frontend developer", "React · Motion · Accessibility"],
  ["RK", "Rina Kade", "Brand writer", "Messaging · B2B · Editorial"],
] as const;

function PagesDemo() {
  return (
    <div className="static-demo">
      <header className="static-header">
        <a className="static-brand" href="#top" aria-label="Project Relay demo home"><i /> <span>PROJECT RELAY</span></a>
        <nav aria-label="Demo navigation"><a href="#briefs">Briefs</a><a href="#talent">Talent</a><a href="#method">Method</a></nav>
        <a className="static-source" href={githubPagesConfig.sourceUrl} target="_blank" rel="noreferrer">SOURCE ↗</a>
      </header>

      <main id="top">
        <section className="static-hero static-shell">
          <div className="static-hero-copy">
            <p className="static-kicker"><i /> FREELANCING MARKETPLACE / PORTFOLIO DEMO</p>
            <h1>Find work worth <em>showing</em></h1>
            <p>Project Relay brings clear briefs, credible specialist evidence, and considered working conversations into one focused marketplace</p>
            <div className="static-actions"><a className="static-primary" href="#briefs">Explore the demo <span>↓</span></a><a className="static-secondary" href={githubPagesConfig.fullAppUrl}>Open full application ↗</a></div>
            <small>This GitHub Pages edition is a static portfolio demo. Authentication, AI, and live workspaces run in the full application</small>
          </div>
          <div className="static-hero-image"><img src={assets.hero} alt="Editorial creative studio worktable with project planning materials" /><div className="static-evidence"><span>PROJECT RELAY / 01</span><b>Briefs built for decisive work</b></div><div className="static-stamp">MATCH<br />THE<br />WORK</div><div className="static-brief"><span>OPEN BRIEF</span><b>Mobile checkout redesign</b><p>Product design <strong>$2.4k–$3.2k</strong></p></div></div>
        </section>

        <section className="static-disciplines static-shell" aria-labelledby="disciplines-title">
          <p className="static-kicker">01 / EXPLORE BY CRAFT</p><h2 id="disciplines-title">A good brief starts with the right <em>discipline</em></h2>
          <div className="static-discipline-grid">{disciplines.map((discipline, index) => <article key={discipline}><span>0{index + 1} / LEDGER</span><b>{discipline}</b><small>Focused briefs →</small></article>)}</div>
        </section>

        <section id="method" className="static-method"><div className="static-shell static-method-grid"><img src={assets.board} alt="Creative project brief planning board" /><div><p className="static-kicker">THE RELAY METHOD</p><h2>A brief with a <em>point of view</em></h2><p>Every demonstration brief carries the context, constraints, and practical next move a specialist needs to decide with confidence</p><ol><li><b>01</b> Scope before surface</li><li><b>02</b> Skills with context</li><li><b>03</b> A proposal in one focused thread</li></ol></div></div></section>

        <section id="briefs" className="static-briefs static-shell"><div className="static-section-head"><div><p className="static-kicker">02 / OPEN PROJECTS</p><h2>Show me what needs <em>making</em></h2></div><span>STATIC PORTFOLIO PREVIEW</span></div><div className="static-ledger">{briefs.map(([title, client, budget, discipline]) => <article key={title}><div><span>{client}</span><h3>{title}</h3><p>Clear context, deliberate constraints, and a focused next move for the right specialist</p><small>{discipline}</small></div><aside><span>BUDGET</span><b>{budget}</b><span>FORMAT</span><b>Remote / 3 weeks</b><a href={githubPagesConfig.fullAppUrl}>View in full app ↗</a></aside></article>)}</div></section>

        <section id="talent" className="static-talent"><div className="static-shell static-talent-grid"><div><p className="static-kicker">03 / FEATURED TALENT</p><h2>Specialists with a clear <em>way of working</em></h2><p>Explore focused profiles by craft and evidence in the complete application</p><img src={assets.talent} alt="Editorial collage of creative professionals" /></div><div className="static-specialists">{specialists.map(([initials, name, role, skills]) => <article key={name}><i>{initials}</i><div><h3>{name}</h3><p>{role}</p><small>{skills}</small></div><a href={githubPagesConfig.fullAppUrl}>PROFILE ↗</a></article>)}</div></div></section>

        <section className="static-closing"><div className="static-shell"><p className="static-kicker">FULL-STACK PRODUCT BUILD</p><h2>Explore the working <em>marketplace</em></h2><p>This portfolio demo highlights the interface direction. Open the hosted application to use role-based access, AI-assisted writing, notifications, workspaces, and profile tools</p><a className="static-primary" href={githubPagesConfig.fullAppUrl}>Open full Project Relay ↗</a></div></section>
      </main>

      <footer className="static-footer static-shell"><a className="static-brand" href="#top"><i /> <span>PROJECT RELAY</span></a><span>© 2026 · Portfolio demo</span><a href={githubPagesConfig.sourceUrl} target="_blank" rel="noreferrer">View source ↗</a></footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<PagesDemo />);
