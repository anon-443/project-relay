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

1. Create an empty GitHub repository or decide its owner and name.
2. In the project management area, choose **Settings → GitHub**.
3. Select the GitHub owner, enter the repository name, and use the export action.
4. Confirm `README.md`, `docs/`, source code, and dependency files are present in GitHub.
5. Add a repository description such as: `Full-stack freelancing marketplace with AI-assisted briefs, role-aware onboarding, and responsive freelancer tooling.`
6. Add relevant topics: `react`, `typescript`, `trpc`, `marketplace`, `freelance`, `ai`, `portfolio`.

## Portfolio presentation checklist

Add two to four screenshots showing the marketplace discovery page, the project-posting flow, the freelancer dossier/workbench, and the Night Ledger dashboard. In the repository description and pinned project text, lead with the product problem solved, then name the main technical decisions: protected tRPC procedures, role-aware onboarding, server-side AI calls, URL-shareable portfolio filters, and responsive dark mode.

## Before publishing

Keep `.env` files, API keys, session cookies, database URLs, and any personal access tokens out of the repository. Use the platform’s managed secrets or GitHub repository secrets for future deployment configuration.
