import { ArrowLeft, ArrowUpRight, BadgeCheck, BriefcaseBusiness, FileText, Star } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const emptyProposal = { contact: "", expectedBudget: "", coverLetter: "" };

export default function FreelancerWorkspace() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const projects = trpc.marketplace.listOpenProjects.useQuery();
  const proposals = trpc.marketplace.listFreelancerProposals.useQuery();
  const reviews = trpc.marketplace.listMyFreelancerReviews.useQuery();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [proposal, setProposal] = useState(emptyProposal);
  const submitProposal = trpc.marketplace.submitProposal.useMutation({
    onSuccess: () => {
      toast.success("Your proposal is saved and visible in your workspace.");
      setProposal(emptyProposal);
      setSelectedProjectId(null);
      void utils.marketplace.listFreelancerProposals.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  function chooseProject(projectId: number) {
    setSelectedProjectId(projectId);
    setProposal((current) => ({ ...current, contact: current.contact || user?.email || "" }));
    requestAnimationFrame(() => document.getElementById("proposal-form")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProjectId) return toast.error("Select an open project first.");
    submitProposal.mutate({ projectId: selectedProjectId, ...proposal });
  }

  return <div className="account-page"><header className="profile-nav"><a href="/" className="relay-brand"><img src="/manus-storage/project-relay-mark_fe132e43.png" alt="Project Relay mark" /><span>PROJECT RELAY</span></a><div className="profile-nav-actions"><ThemeToggle /><a className="profile-back" href="/account/role"><ArrowLeft size={16} /> Account</a></div></header><main className="account-shell persistent-workspace"><section className="account-intro"><p className="section-kicker">FREELANCER WORKSPACE / 11</p><h1>Submit thoughtful proposals. Build <em>verified trust.</em></h1><p>Open projects, proposal history, and only feedback tied to completed marketplace work appear here.</p></section><section className="workspace-overview"><article><BriefcaseBusiness size={21} /><span>OPEN OPPORTUNITIES</span><strong>{projects.data?.length ?? "—"}</strong></article><article><FileText size={21} /><span>YOUR PROPOSALS</span><strong>{proposals.data?.length ?? "—"}</strong></article><article><BadgeCheck size={21} /><span>VERIFIED REVIEWS</span><strong>{reviews.data?.length ?? "—"}</strong></article></section><section className="workspace-ledger"><div className="workspace-ledger-head"><div><p>OPEN PROJECTS</p><h2>Find an opportunity with a clear brief.</h2></div></div>{projects.isLoading ? <p className="workspace-loading">Loading live opportunities…</p> : (projects.data?.length ? <div className="workspace-records">{projects.data.map((project) => <article className="workspace-record" key={project.id}><div><span>{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><div className="workspace-tags">{project.skills.map((skill) => <i key={skill}>{skill}</i>)}</div></div><aside><strong>{project.budget}</strong><span>{project.deadline}</span><small>Posted by {project.clientName}</small><button type="button" className="outline-button" onClick={() => chooseProject(project.id)}>Propose <ArrowUpRight size={14} /></button></aside></article>)}</div> : <p className="workspace-empty">No live projects have been posted yet. Check back after a client posts a brief.</p>)}</section><section id="proposal-form" className="workspace-split"><form className="persistent-form" onSubmit={handleSubmit}><div className="workspace-ledger-head"><div><p>PROPOSAL FORM</p><h2>{selectedProjectId ? "Write a focused response." : "Select an open project to begin."}</h2></div></div><label>CONTACT EMAIL<input required type="email" value={proposal.contact} onChange={(event) => setProposal({ ...proposal, contact: event.target.value })} placeholder="you@example.com" /></label><label>EXPECTED BUDGET<input required value={proposal.expectedBudget} onChange={(event) => setProposal({ ...proposal, expectedBudget: event.target.value })} placeholder="$2,500–$3,000" /></label><label>COVER LETTER<textarea required minLength={30} value={proposal.coverLetter} onChange={(event) => setProposal({ ...proposal, coverLetter: event.target.value })} placeholder="Explain your relevant approach, evidence, and next step." /></label><button className="primary-button" type="submit" disabled={!selectedProjectId || submitProposal.isPending}>{submitProposal.isPending ? "Saving…" : "Submit proposal"} <ArrowUpRight size={15} /></button></form><aside className="workspace-side-ledger"><p>YOUR SUBMISSIONS</p>{proposals.data?.length ? proposals.data.map(({ proposal: item, project }) => <div key={item.id}><strong>{project.title}</strong><span>{item.status} · {new Date(item.createdAt).toLocaleDateString()}</span></div>) : <span>No proposals submitted yet.</span>}</aside></section><section className="workspace-ledger verified-ledger"><div className="workspace-ledger-head"><div><p>VERIFIED FEEDBACK</p><h2>Feedback earned through completed engagements.</h2></div><Star size={20} /></div>{reviews.data?.length ? <div className="workspace-review-list">{reviews.data.map((review) => <article key={review.id}><b>{"★".repeat(review.rating)}<em>{"★".repeat(5 - review.rating)}</em></b><p>{review.feedback}</p><span><BadgeCheck size={14} /> Verified marketplace review · {new Date(review.createdAt).toLocaleDateString()}</span></article>)}</div> : <p className="workspace-empty">No verified feedback has been published yet. A client can submit it only after marking an accepted project complete.</p>}</section></main><footer className="profile-footer">Project Relay · Protected freelancer workspace</footer></div>;
}
