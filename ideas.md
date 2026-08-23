# Project Relay Marketplace Design Direction

## Three initial approaches

| Theme Name | Very Brief Intro | Probability |
| --- | --- | --- |
| The Workroom | An editorial marketplace that feels like a well-run creative studio: paper-white surfaces, cobalt structure, and vibrant orange moments of action. It makes finding work feel focused, capable, and human. | 0.08 |
| Open Ledger | A quiet, transparent marketplace with stone paper, charcoal typography, and ledger-style data tables. It would emphasize trust, clarity, and well-documented decisions. | 0.04 |
| Night Shift | A high-contrast after-hours job board using ink, chrome, and a small electric-blue signal. It would feel energetic and technical, aimed at product and engineering talent. | 0.06 |

## Chosen approach — The Workroom

### Design Movement

**Swiss editorial systems meets contemporary creative-studio tooling.** The design uses confident type, strong rules, emphatic color blocks, and meticulous information hierarchy so a marketplace with many choices still feels composed and easy to scan.

### Core Principles

1. **Make opportunity legible.** Budget, deadline, skills, and client intent are visible before a visitor needs to work for them.
2. **Human work has texture.** The interface uses portrait-like editorial imagery, tactile surfaces, and conversational language to avoid a cold job-board feel.
3. **Color marks a decision.** Cobalt anchors structure; orange marks momentum and the key next action.
4. **Information is staged.** Listings, profiles, filters, proposal forms, and dashboard context appear in a deliberately paced sequence rather than a wall of cards.

### Color Philosophy

Warm paper white and near-black ink establish a professional reading surface. **Cobalt Blue** creates trust and directional structure; **Workshop Orange** is deliberately reserved for important actions, live availability, and status changes. Together the colors create a marketplace that is fresh, optimistic, and credible without leaning on generic tech gradients.

### Layout Paradigm

The site behaves like a **digital studio bulletin board**. A generous hero combines a large editorial statement with a working visual scene. The discovery section is organized as a pinned search rail and an offset results canvas. The dashboard is a compressed workboard of active projects, proposals, and availability—not a generic admin table.

### Signature Elements

1. **Pinned index tabs**: cobalt number blocks that label sections and states.
2. **Workshop stamps**: small circular “open”, “shortlist”, and “match” markers applied to active system areas.
3. **Split sheets**: project and profile cards use strong vertical dividers to separate opportunity information from next actions.

### Interaction Philosophy

Search and filters should feel instant and forgiving. Every result update is visible, while proposal actions open a focused sheet rather than navigating away. Buttons use a compact press response; cards shift only enough to clarify that they are interactive.

### Animation

Sections lift into view with short opacity and 14px translation transitions. A subtle dot-field moves in the hero while static layout stays calm. Filter updates cross-fade results; dialog sheets enter from the right with a 250ms custom ease-out. All nonessential motion respects reduced-motion settings.

### Typography System

**Archivo** is the confident, compact display and interface face. **Fraunces** is used for one expressive italic phrase in major headings, giving the marketplace a cultivated editorial character. **DM Mono** handles budgets, dates, filter labels, and operational metadata. Hierarchy favors big compact headlines paired with quiet, precise supporting detail.

### Brand Essence

**Project Relay is a freelance marketplace that turns scattered creative work into clear, confident matches.**

Personality: **resourceful, direct, optimistic**.

### Brand Voice

Headlines are active and specific. Interface microcopy is helpful, operational, and never exaggerated.

> “Good work finds its way.”

> “Show me what needs making.”

### Wordmark & Logo

The Project Relay mark is a cobalt square that contains an offset orange relay baton: two rounded line segments that almost meet, representing a brief passing cleanly between a client and a specialist. The standalone mark reads at small favicon size and works as a section stamp.

### Signature Brand Color

**Relay Cobalt — #1F4BFF.**

## Professional Palette Reset

| Theme Name | Very Brief Intro | Probability |
| --- | --- | --- |
| Atelier Ledger | Mineral paper, charcoal ink, soft slate, and quiet brass. This turns Project Relay into a composed professional service rather than a bright campaign page. | 0.09 |
| Graphite Office | Cool graphite, cloud gray, and a muted blue ink. This would feel precise and enterprise-adjacent, with a more technical tone. | 0.05 |
| Library Desk | Warm parchment, deep oxblood, and antique gold. This would be literary and premium, but slightly less universal for a modern marketplace. | 0.03 |

### Chosen refinement — Atelier Ledger

The revised visual system uses **soft mineral gray (#EEF0ED)** for the canvas, **near-black charcoal (#1E252B)** for typography and structure, **slate blue (#486070)** for calm operational states, and **restrained brass (#B88642)** only for actions and live markers. Saturated color blocks are removed. Photography is desaturated slightly and set within darker, more architectural frames. The hierarchy stays editorial, but the emotional register becomes measured, premium, and dependable.

The new client workflow is treated as a focused studio intake: three steps—project foundations, scope and AI assistance, then review—shown in a composed side-sheet. The workboard chat is explicitly labelled a **conversation mockup**, retaining a clear visual distinction from real-time production messaging while demonstrating the intended exchange pattern.

### Accepted visual-review amendments

Saturated cobalt is retired from all user-interface elements. Slate, charcoal, mineral gray, and restrained brass now form the visible operating palette; the existing mark is deliberately desaturated to integrate with this system. Brass becomes the sole momentum color for primary actions, live availability, workshop stamps, and critical completion states. Numbered ledger labels, small circular brass status marks, and split-sheet card structures are carried through discovery, talent, and the workboard so Project Relay reads as one consistent professional service.

## Profile & Communication Extension

The freelancer profile follows a **dossier** pattern: a disciplined identity header, clearly grouped skills, select portfolio evidence, availability, and a transparent verification area. It avoids generic profile clutter and uses split sheets to distinguish published work from operational information. Because reviews are trust-sensitive user-generated content, the review module is intentionally an empty **verified feedback** framework until authentic reviews are connected; no ratings, review quotes, or testimonials are seeded.

Notifications adopt a compact **ledger alert** treatment. Brass dots and numbered labels mark unread items; each alert links to a clear next action such as opening a conversation or viewing a proposal. The chat panel distinguishes delivery, read state, typing, and attachments through quiet metadata rather than overly animated bubbles. This keeps the interface professional while making the important conversation states immediately scannable.

### Profile evidence refinements

The freelancer dossier now requires **credible work artifacts** rather than abstract color swatches: desaturated product interface crops, process sketches, and studio documentation treated like exhibits in a professional file. The Project Relay mark is kept in the restrained charcoal/brass treatment, while circular brass workshop stamps and numbered dossier labels recur across profile status, portfolio entries, and conversation panels. Brass remains the only momentum color.

## Discovery & Attachment Controls

Portfolio browsing uses a slim **evidence index** above the work cards: one compact category selector and one sort control, rather than a heavy filter sidebar. The result count stays visible so clients can understand the scope of the dossier at a glance. Notifications gain an **all / unread** ledger switch while preserving the batch read action only when it has work to do.

The chat attachment experience becomes a compact **file slip** before send. It shows a document or image thumbnail, filename, human-readable size, file type, and a removal action. This confirms what will be shared without implying that an attachment has already been uploaded or stored.

## Preferences & Shareable Dossier State

Notification settings follow a **quiet operations sheet**: three alert categories, one delivery control per category, a single save action, and a succinct confirmation state. Shareable portfolio views preserve their discipline and sort state in the query string, while a small copy-link control keeps the focused view easy to share.

The AI skill assistant sits beside the evidence index rather than presenting itself as a detached chat tool. It is explicitly grounded in the visible portfolio titles, disciplines, and summaries, returns a compact editable tag set, and avoids suggesting credentials, ratings, client identities, or unsupported expertise.

## Freelancer Workbench & Night Ledger

The portfolio manager becomes a **workbench**, not an opaque uploader: a tactile drop zone, an ordered evidence stack, local thumbnail previews, and unambiguous remove/reorder actions. The freelancer dashboard follows a **performance sheet** format, with clear operational counters, proposal and project ledgers, and a single slim earnings chart rather than a generic analytics wall.

Dark mode becomes **Night Ledger**. It trades the mineral paper for charcoal ink, soft graphite cards, muted blue-gray structure, and controlled brass highlights. It retains the same typographic hierarchy and makes the theme preference persistent—never simply inverting light-mode colors.
