# GitHub Pages Static Demo

The repository includes a dedicated static portfolio build for GitHub Pages at `https://anon-443.github.io/project-rely/`. It demonstrates the Project Rely marketplace’s visual system, representative briefs, talent directory, and product positioning without attempting to replicate server-backed behavior in a static host.

| Capability | GitHub Pages demo | Managed full application |
| --- | --- | --- |
| Marketplace presentation | Included | Included |
| Representative briefs and specialist profiles | Included as static portfolio content | Included with interaction states |
| OAuth, role onboarding, AI tools, database-backed workspaces | Not available on a static host | Available in the hosted application |
| Source code | Public in this repository | Same source, plus the managed runtime |

The `deploy-github-pages.yml` workflow builds the separate `github-pages.html` entry with the `github-pages` Vite mode and deploys the resulting static artifact through GitHub Pages.

## Local Artifact Verification

The static build is configured for the intended `/project-rely/` subpath. The root `index.html` entry, repository-relative JavaScript and CSS paths, hosted editorial imagery, navigation anchors, source link, and full-application handoff are validated in the GitHub Pages build.

## Public Deployment Verification

After the renamed repository workflow completes, the public static demo is available at `https://anon-443.github.io/project-rely/`. The deployed page renders the Project Rely hero, discipline ledger, project briefs, specialist directory, editorial imagery, repository source link, and full hosted-application handoff.
