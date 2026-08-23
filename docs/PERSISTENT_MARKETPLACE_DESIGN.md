# Persistent Marketplace Design

## Record model

| Record | Owner | Purpose | Key lifecycle states |
|---|---|---|---|
| Project | Client | A brief posted by an authenticated client | `open`, `closed`, `completed` |
| Proposal | Freelancer | A submission against an open project | `submitted`, `accepted`, `rejected`, `completed` |
| Review | Client | Verified feedback for a freelancer after completed work | Published only after eligibility checks |

## Authorization rules

An authenticated **client** may create projects, view proposals for their own projects, accept or complete a proposal, and submit one review for an accepted/completed proposal on their own project. An authenticated **freelancer** may browse open projects and submit a proposal only for projects they do not own. They may view only their own proposals and reviews. Existing protected role selection and workspace gates remain the single source of truth for client and freelancer access.

## Review integrity

No review record is seeded or fabricated. Review submission requires a project owned by the client and an accepted/completed proposal belonging to the reviewed freelancer. The review stores the project, client, freelancer, rating, written feedback, and timestamp so the profile can display only evidence-backed feedback.
