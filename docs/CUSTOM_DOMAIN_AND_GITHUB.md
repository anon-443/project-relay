# Custom Domain and GitHub Handoff

## Custom domain mapping

Project Relay can remain on the managed hosting platform while using a domain you purchased elsewhere. In the management area, open **Settings → Domains**, then choose **Bind existing domain**. Enter the domain you own and copy the exact DNS records displayed there.

> Do not guess the target value. DNS targets and verification records are project-specific, so use the values shown in the Domains panel.

At your registrar, add the requested record exactly. Apex domains commonly use an **A/ALIAS/ANAME** record, while subdomains commonly use a **CNAME** record; the Domains panel determines which option applies. Remove any competing record for the same hostname, wait for DNS propagation, then return to the Domains panel to verify and assign the domain.

| Information to collect | Why it matters |
| --- | --- |
| Purchased domain, e.g. `yourdomain.com` | Identifies the hostname to bind. |
| DNS registrar, e.g. Cloudflare, Namecheap, GoDaddy | Determines where to add the record. |
| Whether you want `www`, apex, or both | Determines the host values and redirect plan. |
| Existing email/DNS services | Prevents accidental removal of MX, TXT, or other unrelated records. |

Once you provide the domain and registrar, use the Domains panel’s exact record values. Do not change MX, SPF, DKIM, or other email records unless the registrar specifically identifies a conflict with the requested host.

## Exporting the source to GitHub

Use the managed project export rather than manually copying files. It creates a repository from the saved project source, while keeping the production marketplace on its existing full-stack host.

| Step | Exact action | Expected result |
| --- | --- | --- |
| 1 | Save a project checkpoint. | The export has a stable, reviewable source revision. |
| 2 | Open the project management area and select **Settings → GitHub**. | The GitHub export panel opens. |
| 3 | If prompted, select **Connect GitHub** and complete GitHub’s authorization in the opened window. | Your GitHub account is available as an export owner. |
| 4 | Choose the account or organization that should own the repository. | The correct GitHub owner is selected. |
| 5 | Enter `project-relay` as the repository name and choose **Public** for portfolio visibility. | The new public repository details are ready. |
| 6 | Select the export action and wait for it to finish. | The complete project source is created in the new GitHub repository. |
| 7 | Open the repository from the confirmation link and inspect the root. | `README.md`, `docs/`, `client/`, `server/`, `drizzle/`, `package.json`, and `pnpm-lock.yaml` are present. |
| 8 | In GitHub, add the description and topics below, then copy the repository URL for LinkedIn and your portfolio. | The repository is discoverable and presentation-ready. |

Use this repository description:

> **Full-stack freelancing marketplace with AI-assisted briefs, role-aware onboarding, protected workspaces, and responsive freelancer tooling.**

Use these topics: `react`, `typescript`, `trpc`, `marketplace`, `freelance`, `ai`, `portfolio`.

If the GitHub panel is not connected yet, do not create a separate empty repository first. Complete the managed connection and export flow above; it creates the repository under the owner and name you choose. If a repository with the same name already exists, select a new unused name or rename the existing repository before exporting.

## Portfolio presentation checklist

Add two to four screenshots showing the marketplace discovery page, the project-posting flow, the freelancer dossier/workbench, and the Night Ledger dashboard. In the repository description and pinned project text, lead with the product problem solved, then name the main technical decisions: protected tRPC procedures, role-aware onboarding, server-side AI calls, URL-shareable portfolio filters, and responsive dark mode.

## Before publishing

Keep `.env` files, API keys, session cookies, database URLs, and any personal access tokens out of the repository. Use the platform’s managed secrets or GitHub repository secrets for future deployment configuration.
