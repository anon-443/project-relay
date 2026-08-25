# GitHub Pages Restoration Notes

The deployed GitHub Pages URL was serving the legacy `github-pages.tsx` static layout, which used a different header, hero composition, and limited project presentation from the current Project Relay homepage.

The dedicated static entrypoint has been rebuilt around the current Project Relay public visual system. Its first local artifact preview returned a blank page despite a successful bundle. The generated HTML and both emitted JS/CSS assets resolve successfully under the `/project-rely/` base path, so the remaining fix is a browser-runtime issue rather than an artifact-path or deployment-path issue.

The apparent local runtime issue was isolated to the generic preview server, which returned its HTML fallback for assets nested under the GitHub Pages base path. A base-path-aware local preview rendered the rebuilt artifact correctly. The verified page now uses the current Project Relay navigation, hero card, category set, project discovery, featured talent, workspace, closing section, and footer rather than the prior legacy static layout.

The GitHub Actions Pages workflow completed successfully. The normal public URL can retain the previous HTML briefly in cache, while the cache-bypassed URL using the restoration commit query (`?v=b1937de`) verified the updated current Project Relay experience from the live deployment.

The prior static approximation has now been replaced with the actual managed `Home` component inside a static-safe provider wrapper. Its public assets resolve from the managed host and its account, settings, dashboard, and posting actions redirect to the managed application when an API-backed flow is required.
