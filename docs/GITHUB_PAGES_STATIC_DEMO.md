# GitHub Pages Static Demo

The repository includes a dedicated static portfolio build for GitHub Pages at `https://anon-443.github.io/project-relay/`. It demonstrates the Project Relay marketplace’s visual system, representative briefs, talent directory, and product positioning without attempting to replicate server-backed behavior in a static host.

| Capability | GitHub Pages demo | Managed full application |
| --- | --- | --- |
| Marketplace presentation | Included | Included |
| Representative briefs and specialist profiles | Included as static portfolio content | Included with interaction states |
| OAuth, role onboarding, AI tools, database-backed workspaces | Not available on a static host | Available in the hosted application |
| Source code | Public in this repository | Same source, plus the managed runtime |

The `deploy-github-pages.yml` workflow builds the separate `github-pages.html` entry with the `github-pages` Vite mode and deploys the resulting static artifact through GitHub Pages.

## Local Artifact Verification

The static build was checked at the intended `/project-relay/` subpath before publication. The root `index.html` entry, repository-relative JavaScript and CSS paths, hosted editorial imagery, navigation anchors, source link, and full-application handoff all loaded successfully in a browser preview.
