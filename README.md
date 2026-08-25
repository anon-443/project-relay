# Project Rely — Freelancing Marketplace

> A modern, responsive freelancing marketplace where clients can post projects and freelancers can discover opportunities, submit proposals, manage portfolio details, and track their work.

## Live project

| Version | Link |
| --- | --- |
| GitHub Pages demo | [https://anon-443.github.io/project-rely/](https://anon-443.github.io/project-rely/) |
| Full application | [https://orbitfolio-fbbkuhat.manus.space](https://orbitfolio-fbbkuhat.manus.space) |
| Source repository | [https://github.com/anon-443/project-rely](https://github.com/anon-443/project-rely) |

## Requirement coverage

| Requirement | Implementation in Project Rely |
| --- | --- |
| Attractive homepage | Hero section, platform introduction, popular categories, featured freelancers, featured projects, and clear call-to-action buttons |
| Project listing | Twelve project briefs with title, category, company, budget, description, skills, deadline, and project-detail action |
| Freelancer profiles | Freelancer identity, skill tags, experience level, portfolio evidence, short biography, and verified-review support |
| Project details | Full project scope, required skills, budget, deadline, client/company context, and proposal action in a dedicated detail overlay |
| Proposal form | Freelancer name, email, expected budget, cover letter, required-field validation, and confirmation feedback |
| Search and filters | Project title/skill search, category and budget filters, freelancer skill search, and expertise-level filtering |
| Dashboard | Posted projects, proposals, profile state, saved projects, project status, and a communication preview |
| Responsive design | Desktop, tablet, and phone layouts with responsive navigation, forms, cards, dialogs, and touch targets |
| Navigation and footer | Sticky navigation, smooth in-page movement, contact link, social links, and a responsive footer |

## Main features

Project Rely supports client and freelancer roles. Clients can create projects through a validated multi-step form, review incoming proposals, accept work, complete engagements, and leave a verified review. Freelancers can browse open projects, submit proposals, manage portfolio evidence, and view verified feedback.

Marketplace preferences such as saved projects, notifications, and light or night mode persist in browser storage. The full application also includes protected routes, role-aware workspaces, and database-backed project, proposal, and review records.

## Technology

| Layer | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite, Wouter, Framer Motion |
| Styling | Tailwind CSS, shadcn/ui, Lucide icons, responsive CSS |
| Backend | Express, tRPC, Zod |
| Data and access | Drizzle ORM, MySQL/TiDB, OAuth, role-aware procedures |
| Quality | Vitest, TypeScript checks, production and GitHub Pages builds |

## Run locally

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

For the complete server-backed application, configure your own database and OAuth environment values outside version control. Never commit `.env` files, tokens, database URLs, or session secrets.

## Project structure

```text
client/src/         React pages, components, responsive UI, and browser preferences
server/             tRPC procedures, authorization rules, and database helpers
drizzle/            Database schema and migrations
.github/workflows/  GitHub Pages deployment workflow
```

## Completion status

The required marketplace homepage, project discovery, freelancer profiles, project details, proposal form validation, search and filter controls, dashboard, responsive design, navigation, and footer are complete.
