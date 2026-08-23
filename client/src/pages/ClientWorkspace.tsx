/** Protected client operations: create owned briefs, choose a proposal, complete work, then submit verified feedback. */
import { ArrowLeft, ArrowUpRight, ClipboardPlus, MessageSquareText, ShieldCheck, Star } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { trpc } from "@/lib/trpc";

const initialBrief = { title: "", category: "Product design", budget: "", deadline: "", description: "", skills: "" };

export default function ClientWorkspace() {
  const workspace = trpc.account.clientWorkspace.useQuery();
  const utils = trpc.useUtils();
  const projects = trpc.marketplace.listClientProjects.useQuery();
  const proposals = trpc.marketplace.listClientProposals.useQuery();
  const [brief, setBrief] = useState(initialBrief);
  const [reviewTarget, setReviewTarget] = useState<number | null>(null);
  const [review, setReview] = useState({ rating: 5, feedback: "" });
  const refresh = () => {
    void utils.marketplace.listClientProjects.invalidate();
    void utils.marketplace.listClientProposals.invalidate();
  };
  const createProject = trpc.marketplace.createProject.useMutation({
    onSuccess: () => { toast.success("Your project brief is published."); setBrief(initialBrief); refresh(); },
    onError: (error) => toast.error(error.message),
  });
  const acceptProposal = trpc.marketplace.acceptProposal.useMutation({
    onSuccess: () => { toast.success("Proposal accepted. You can mark it complete when the engagement ends."); refresh(); },
    onError: (error) => toast.error(error.message),
  });
  const completeProposal = trpc.marketplace.completeProposal.useMutation({
    onSuccess: () => { toast.success("Engagement completed. Verified feedback is now available."); refresh(); },
    onError: (error) => toast.error(error.message),
  });
  const submitReview = trpc.marketplace.submitVerifiedReview.useMutation({
    onSuccess: () => { toast.success("Verified feedback is published for the freelancer."); setReviewTarget(null); setReview({ rating: 5, feedback: "" }); refresh(); },
    onError: (error) => toast.error(error.message),
  });

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createProject.mutate({ ...brief, skills: brief.skills.split(",").map((skill) => skill.trim()).filter(Boolean) });
  }

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reviewTarget) submitReview.mutate({ proposalId: reviewTarget, ...review });
  }

  return <div className="account-page">
    <header className="profile-nav"><a href="/" className="relay-brand"><img src="/manus-storage/project-relay-mark_fe132e43.png" alt="Project Relay mark" /><span>PROJECT RELAY</span></a><div className="profile-nav-actions"><ThemeToggle /><a className="profile-back" href="/account/role"><ArrowLeft size={16} /> Account</a></div></header>
    <main className="account-shell persistent-workspace">
      <section className="account-intro"><p className="section-kicker">CLIENT WORKSPACE / 10</p><h1>Keep every project decision <em>in view.</em></h1><p>{workspace.data?.nextAction || "Loading your protected client workspace…"}</p></section>
      <section className="workspace-overview">
        <article><ClipboardPlus size={21} /><span>YOUR PROJECTS</span><strong>{projects.data?.length ?? "—"}</strong></article>
        <article><MessageSquareText size={21} /><span>INCOMING PROPOSALS</span><strong>{proposals.data?.length ?? "—"}</strong></article>
        <article><ShieldCheck size={21} /><span>ROLE STATUS</span><strong>Client</strong></article>
      </section>
      <section className="workspace-split">
        <form className="persistent-form" onSubmit={handleCreate}>
          <div className="workspace-ledger-head"><div><p>POST A BRIEF</p><h2>Save a clear project brief to the marketplace.</h2></div></div>
          <label>PROJECT TITLE<input required minLength={5} value={brief.title} onChange={(event) => setBrief({ ...brief, title: event.target.value })} /></label>
          <div className="form-two-up"><label>CATEGORY<select value={brief.category} onChange={(event) => setBrief({ ...brief, category: event.target.value })}>{["Product design", "Web development", "Brand & identity", "Copywriting", "Digital marketing", "UX research"].map((category) => <option key={category}>{category}</option>)}</select></label><label>BUDGET<input required value={brief.budget} onChange={(event) => setBrief({ ...brief, budget: event.target.value })} placeholder="$2,500–$3,000" /></label></div>
          <div className="form-two-up"><label>DEADLINE<input required value={brief.deadline} onChange={(event) => setBrief({ ...brief, deadline: event.target.value })} placeholder="Within 3 weeks" /></label><label>REQUIRED SKILLS<input required value={brief.skills} onChange={(event) => setBrief({ ...brief, skills: event.target.value })} placeholder="Figma, Research, UX" /></label></div>
          <label>PROJECT DESCRIPTION<textarea required minLength={30} value={brief.description} onChange={(event) => setBrief({ ...brief, description: event.target.value })} placeholder="Describe the problem, outcome, and working context." /></label>
          <button className="primary-button" type="submit" disabled={createProject.isPending}>{createProject.isPending ? "Publishing…" : "Publish project"} <ArrowUpRight size={15} /></button>
        </form>
        <aside className="workspace-side-ledger"><p>YOUR LIVE BRIEFS</p>{projects.data?.length ? projects.data.map((project) => <div key={project.id}><strong>{project.title}</strong><span>{project.status} · {project.category}</span></div>) : <span>Your saved briefs will appear here.</span>}</aside>
      </section>
      <section className="workspace-ledger">
        <div className="workspace-ledger-head"><div><p>INCOMING PROPOSALS</p><h2>Choose, complete, then publish honest feedback.</h2></div></div>
        {proposals.data?.length ? <div className="workspace-proposal-list">{proposals.data.map((proposal) => <article key={proposal.id}><div><span>{proposal.project.title}</span><h3>{proposal.freelancerName}</h3><p>{proposal.coverLetter}</p><small>{proposal.expectedBudget} · {proposal.contact}</small></div><aside><b>{proposal.status}</b>{proposal.status === "submitted" && <button type="button" className="outline-button" onClick={() => acceptProposal.mutate({ proposalId: proposal.id })}>Accept</button>}{proposal.status === "accepted" && <button type="button" className="outline-button" onClick={() => completeProposal.mutate({ proposalId: proposal.id })}>Mark complete</button>}{proposal.status === "completed" && <button type="button" className="outline-button" onClick={() => setReviewTarget(proposal.id)}>Write review <Star size={14} /></button>}</aside></article>)}</div> : <p className="workspace-empty">No proposals are attached to your published projects yet.</p>}
      </section>
      {reviewTarget && <section className="workspace-ledger review-composer"><div className="workspace-ledger-head"><div><p>VERIFIED REVIEW</p><h2>Publish evidence after completed work.</h2></div></div><form className="persistent-form" onSubmit={handleReview}><label>RATING<select value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label><label>FEEDBACK<textarea required minLength={20} value={review.feedback} onChange={(event) => setReview({ ...review, feedback: event.target.value })} placeholder="Describe the completed work and collaboration fairly." /></label><div className="form-actions"><button className="primary-button" type="submit" disabled={submitReview.isPending}>{submitReview.isPending ? "Publishing…" : "Publish verified review"}</button><button type="button" className="outline-button" onClick={() => setReviewTarget(null)}>Cancel</button></div></form></section>}
    </main>
    <footer className="profile-footer">Project Relay · Protected client workspace</footer>
  </div>;
}
