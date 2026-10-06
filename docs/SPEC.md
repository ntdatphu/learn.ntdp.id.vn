# Project Specification: ntdp.id.vn (personal site) and its Learning Hub

**Status:** DRAFT v0.7; Learning Hub decisions confirmed through D-009 / APPROVED P-26 · 2026-10-07 · **Owner:** Nguyễn Trần Đạt Phú (@ntdatphu)

This file is the **single source of truth** for what is being built. AI agents implement only what is tagged `[CONFIRMED]`.

| Tag | Meaning |
|---|---|
| `[CONFIRMED]` | Stated by the Owner. |
| `[PROPOSED]` (P-nn) | Suggested, **not decided**. Becomes `[CONFIRMED]` only when the Owner writes `APPROVED P-nn`. |
| `[OPEN]` (Q-nn) | Unanswered. Needs the Owner's answer before any work that depends on it. |

> Vietnamese note for the Owner: bản này chỉ ghi những gì bạn đã nói là `[CONFIRMED]`. Mọi thứ tôi đề xuất đều là `[PROPOSED]` hoặc `[OPEN]`. Hãy đọc kỹ, sửa chỗ sai, rồi đưa cho ChatGPT làm Giai đoạn 0.

## 1. Vision

- `[CONFIRMED]` One domain, `ntdp.id.vn`, used for two separate sites: (a) the **personal site** on `ntdp.id.vn` itself, concerning the Owner only; (b) a **Learning Hub** on a **different subdomain**, where the Owner stores and shares learning materials and turns their content into easier-to-read, self-written material.
- `[CONFIRMED]` Professional quality in every detail, including small ones.
- `[CONFIRMED]` Cost-efficient: the Owner is a student and wants the best quality for the lowest cost.
- `[CONFIRMED]` The current site is discarded and rebuilt from scratch in **new repositories**.

## 2. Owner and content source

- `[CONFIRMED]` Content source for the personal site (Home/About page): the GitHub profile README, `github.com/ntdatphu/ntdatphu`. The current website is a reference only.
- Facts visible on the public GitHub profile (read 2026-10-06): Nguyễn Trần Đạt Phú; undergraduate at the Posts and Telecommunications Institute of Technology; background in Electronics and Telecommunications Engineering; interests in software engineering, computer networking, and Linux; based in Ho Chi Minh City, Vietnam. Do not extend beyond what the Owner approves.
- `[CONFIRMED]` No experience, projects, or blog sections are needed for now (the Owner is a student).
- `[OPEN]` **Q-02** Which README sections appear on the Home/About page? Candidates in the README: About me, Current learning path, Current direction, Development philosophy, Milestones, Personal notes, Contact and collaboration.
- `[OPEN]` **Q-03** Which personal details may be shown publicly: location precision, photo, ORCID, LinkedIn, email, birth-year-style tagline.

## 3. Scope

### 3.1 In scope now
- `[CONFIRMED]` Build the **Learning Hub before the personal site**. Its first screen is **Subject discovery**, rather than a document-storage-first interface. During TASK-007, the Owner confirmed keeping the existing custom domain `learn.ntdp.id.vn` as the current publication target.
- `[CONFIRMED]` **Personal site** on `ntdp.id.vn`: Home/About page in English, about the Owner only. The current site keeps running until the Owner approves a switch.
- `[CONFIRMED]` Deployed on GitHub Pages; domain registered at TenTen.

### 3.2 Deferred (wanted later; not built until the Owner re-scopes)
- `[CONFIRMED]` Optional accounts, progress tracking and "resume where I stopped" across devices.
- `[CONFIRMED]` Sharing/publishing by the Owner or a group of accounts through the site.
- `[CONFIRMED]` Restricting some content case by case.
- `[CONFIRMED]` Vietnamese translation, if needed.

### 3.3 Not needed now
- `[CONFIRMED]` Blog, experience and projects sections.

## 4. Learning Hub content model

- `[CONFIRMED]` **Documents (future content):** PDF files shared for reading/download. No PDFs or other materials are approved for the current milestone.
- `[CONFIRMED]` **Notes (future content):** self-written content in a Markdown-like format, with highlights and annotations in web style. The Owner writes them, or AI drafts from material the Owner supplies. In Phase 1 notes live in the repository; there is no online editor.
- `[CONFIRMED]` **External resources (future content):** download links, videos, other websites, each with a preview.
- `[PROPOSED]` **P-03** Required metadata per resource: title, type, description, author/source, source URL, license or permission, language, tags, date added, status (`draft` or `published`).
- `[PROPOSED]` **P-04** A note can link to the document it explains (for example a book chapter).
- `[PROPOSED]` **P-05** Embeds come only from an allowlist; everything else renders as a link card with a preview.
- `[CONFIRMED]` **Q-05 (partial) / D-009 / APPROVED P-26:** Notes, Key Topics, responsive tables, original diagrams, structured CLI, and native disclosures are approved learning primitives. Math, footnotes, other image/callout features remain undecided; no source images are approved.
- `[OPEN]` **Q-06** Which video/site sources are on the embed allowlist (for example YouTube)?
- `[CONFIRMED]` **Q-07 / D-006:** The hierarchy is **Subject -> Part/Chapter -> Material**. Learning Path is removed from the Learning Hub model.
- `[CONFIRMED]` The only initial Subjects are `ccna` / **CCNA** and `linux-system` / **Linux System**. No Parts, Chapters, Lessons, Materials, PDFs, Notes, or sample resources are approved yet. Never invent curriculum.
- `[CONFIRMED]` Home contains the Learning Hub identity, a **Search subjects** control, a **Subjects** heading, and two accessible Subject card links. Cards navigate to `/subjects/ccna/` and `/subjects/linux-system/`, respecting the configured base path.
- `[CONFIRMED]` Subject search is entirely client-side and static, with no backend or network request. It trims surrounding whitespace, collapses repeated whitespace, matches case-insensitive substrings, and shows all Subjects for an empty query. An unmatched query displays exactly **No subjects found.** Both Subjects remain in generated HTML and visible if JavaScript fails; search may stay disabled until initialization.
- `[CONFIRMED]` Each Subject page has the shared Learning Hub header, a way back to Subjects/home, its name as the page heading, and a **Chapters** section. Until real content is supplied, show exactly **Content coming soon.** and **Chapters and materials will appear here when they are ready.** No sample chapter cards, disabled fake controls, nonexistent content routes, or invented metadata.


### 4.1 Learning content platform — D-009 / APPROVED P-26

- `[CONFIRMED]` CCNA is produced **Part/Chapter at a time**. Commercial/private source material remains private; public learning content is independently authored. Source images, figures, tables, quiz questions/choices, and lab scenarios are not reused by default. No paragraph/page-level paraphrasing or translated source prose as a workaround. Technical facts, names, and commands remain correct. Track provenance privately during future production; see [public content rules](CONTENT_GUIDE.md).
- `[CONFIRMED]` TASK-008 builds reusable, data-driven static Chapter infrastructure, **without populating curriculum** or reading the commercial source. Production Parts, Chapters, objectives, Key Topics, commands, and checklists remain empty. The public route list and both Subject empty states remain unchanged. Synthetic fixtures are clearly test-only and excluded from production output.
- `[CONFIRMED]` Chapters support Subject/Part context, stable IDs/slugs, author-supplied title/intro, stable learning-objective IDs, ordered sections, shared Key Topic/checklist references, summary, and available published previous/next relationships. No unavailable navigation controls. Notes and Key Topics are first-class primitives; Key Topics have stable anchors and an explicit summary used by the derived **Key Topics to remember** review.
- `[CONFIRMED]` Modern semantic tables offer explicit **cards** mode for row-wise mobile label/value groups and **scroll** mode for comparison matrices. Use readable type, restrained separators, and inner horizontal scrolling without page overflow. Original responsive SVG diagrams use figure/caption semantics, an accessible description, and generic geometry; no vendor icons or source topology reproduction.
- `[CONFIRMED]` Structured CLI distinguishes prompt, command, output, comment, teaching emphasis, and verified result. Desktop/fine-pointer controls copy **one command text only**, never prompt/output; no Copy all. Copy controls are hidden/disabled on narrow or coarse-pointer presentations. Clipboard success is announced briefly; failure leaves manual text selection available.
- `[CONFIRMED]` Config Checklists are one shared record with stable ID, title/category, ordered steps, command references, and optional purpose, verification, mistakes, and related Chapter IDs. The same record renders inline and later in a library. Walkthroughs compose short steps; Guided Labs distinguish goal/start, action, rationale, verification, and expected result. Challenge Labs have requirements, optional hints, and an initially hidden accessible solution. Troubleshooting supports symptoms/evidence, learner prompt, disclosed diagnosis, explanation, corrective action, and verification.
- `[CONFIRMED]` Reading uses the D-007 identity, calm light-only editorial layout, approximately 44–48rem prose measure and 1.65–1.75 line-height. Wider tables/diagrams may escape that measure. Core content and native disclosures remain usable without JavaScript. Minimal client enhancement, local SVG/system fonts, no runtime content fetch or external visual assets.
- `[CONFIRMED]` **TASK-009:** Reusable **Knowledge Check — Before/After**, question banks, scoring, objective breakdown, and **local-only progress** are implemented as infrastructure with non-public synthetic fixtures. No real question bank or public assessment exists before the content pilot. The CCNA Checklist Library at `/subjects/ccna/checklists/` is implemented in TASK-010 and reuses the same checklist data; it remains empty until real CCNA Chapters are published. Cross-device/account progress remains deferred.


### 4.2 Assessment and local progress — TASK-009

- `[CONFIRMED]` Future flow: Chapter intro → Knowledge Check — Before → objectives → content/labs/review → Knowledge Check — After. Both checks cover the same stable objectives; balanced objective pools shuffle questions and redistribute sparse pools. Post normally uses different IDs from the corresponding Pre and retry prefers unused/least-recently-used IDs where possible.
- `[CONFIRMED]` Question types include single choice, multiple choice, true/false, classification, CLI/output interpretation, configuration selection, troubleshooting, and topology/concept reasoning. Native controls; no drag/drop/matching/complex graphical interactions. Questions, choices, scenarios, and explanations must be independently authored; no source reuse or translation.
- `[CONFIRMED]` Scoring is deterministic: 1 for a correct answer, 0 otherwise; multiple choice requires the exact set, without partial or negative credit. Results show raw score, percentage, and objective breakdown. Before highlights objectives needing attention without detailed explanations. After shows correct/incorrect text, correct answer, authored explanations/distractor guidance, and valid review links. Improvement is percentage-point difference, not relative growth.
- `[CONFIRMED]` Progress stays only in this browser/device; nothing is transmitted to NTDP or third parties. Versioned scoped storage supports first/latest Pre, latest/best and bounded Post attempts, objective results, question IDs, and study timestamps. Malformed/denied storage must not break reading or checks. Reset requires deliberate confirmation and removes only relevant Learning Hub data, never unrelated browser storage. No person/account/analytics identifiers, accounts, backend, or cloud sync.
- `[CONFIRMED]` No XP/streaks/badges/ranks/leaderboards/achievements. Core learning content stays usable without JavaScript; assessment unavailability is announced accessibly. Privacy copy: **Progress is stored only in this browser/device. Nothing is sent to NTDP or third parties.** No new Privacy page in TASK-009.

### 4.3 CCNA Config Checklist Library — TASK-010

- `[CONFIRMED]` `/subjects/ccna/checklists/` is reachable from a restrained CCNA Subject action; no global-header or Linux link. Empty copy: **Config checklists** / **Quick references will appear here as CCNA chapters are published.** No fake entries/categories/details or empty search/filter controls.
- `[CONFIRMED]` Inline Chapter, library, detail and related navigation reuse one checklist record. Categories support stable IDs, display labels and explicit ordering; checklist order is author-controlled. Only categories with actual records render. Detail routes generate only for checklists related to published CCNA Chapters.
- `[CONFIRMED]` Compact reference rows and mobile-first ordered steps, exact command references, verification, common mistakes and semantic related-Chapter links. Desktop/fine-pointer per-command copy reuses TASK-008; no Copy all. Source checklist prose/layout must be independently authored, never copied/translated/lightly paraphrased.

### 4.4 First CCNA content pilot — review candidate

- `[CONFIRMED]` One independently authored Chapter candidate may exercise the real Part/Chapter presentation, original diagrams/tables/CLI/checklist/labs/troubleshooting and Before/After checks. The candidate stops at a **Draft PR** for Owner/Planner content review; it is not merged or deployed. No neighboring Chapter or second Chapter is invented or processed.
- `[CONFIRMED]` Source inventory, page mapping, factual Knowledge Specification and assessment blueprint stay in a dedicated private directory outside Git. Public authoring follows source review → factual extraction → source closed → independent authoring → technical/copyright/learning/visual QA. No source PDF, text dump, images, questions, choices, lab scenarios or private manifest enters the public repository.
- `[CONFIRMED]` The candidate Checklist uses the same record inline and centrally. Questions have stable objective alignment and original wording/scenarios. Technical commands remain exact; illustrative CLI output and device/media limitations must be clear. The first pilot is reviewed before establishing the long-term CCNA Chapter Standard v1.

## 5. Access

- `[CONFIRMED]` Everyone can view the content without an account.
- `[CONFIRMED]` Accounts are never required.
- Constraint (verify against current GitHub documentation): GitHub Pages serves static files and the published site is public. With Pages alone **no content can be restricted**. Anything committed to a public repository is public to everyone.

## 6. Accounts (deferred)

- `[CONFIRMED]` Optional login for tracking learning progress and resuming on another device, and for features that need an account.
- `[CONFIRMED]` Sign-in via a Google account; the Owner also mentioned GitHub and earlier Apple ID.
- `[CONFIRMED]` Wish: the same email address means one person even across providers.
- `[PROPOSED]` **P-16** Accounts belong to the Learning Hub only; the personal site has no accounts. Login sessions are not shared across subdomains unless the Owner approves.
- `[PROPOSED]` **P-06** Merge accounts automatically only when both providers report a **verified** email; otherwise let the user link accounts explicitly in Settings.
- `[OPEN]` **Q-08** Apple sign-in: wanted at all? It may require a paid Apple developer membership (verify before deciding).

## 7. Language

- `[CONFIRMED]` English first. Vietnamese translation later, only if needed.
- `[PROPOSED]` **P-07** Structure the content and routes so a Vietnamese version can be added later. No Vietnamese content and no language switcher until the Owner approves.

## 8. Hosting, domain, repository

- `[CONFIRMED]` Hosting: GitHub Pages. Domain: `ntdp.id.vn` registered at TenTen. During TASK-007, the Owner explicitly confirmed keeping the existing Pages custom domain `learn.ntdp.id.vn`. The current target is `https://learn.ntdp.id.vn/`; the default GitHub Pages project URL redirects to that domain. This supersedes the earlier staging-only outcome for the current milestone. The personal site remains untouched.
- `[CONFIRMED]` New repositories; Codex CLI runs on the Owner's computer.
- `[CONFIRMED]` **P-08 / D-006 (completed Learning Hub staging):** The first milestone published at the default GitHub Pages project URL. During TASK-007, the Owner separately approved retaining the existing custom domain, superseding that staging URL as the current publication target. Continue using GitHub Actions with the official Astro Pages action and Pages `build_type: workflow`; deployment runs on pushes to `main` and supports manual dispatch. The AI may configure Pages through existing authenticated tooling and merge verified work when repository protections permit. The personal site stays untouched.
- `[PROPOSED]` **P-15** Two repositories, one per site (GitHub Pages serves one site per repository; verify against current documentation).
- `[CONFIRMED]` **Q-16:** Learning Hub publication target: `learn.ntdp.id.vn`, retained by direct Owner confirmation during TASK-007. Serve the site and its Subject routes from the domain root.
- `[CONFIRMED]` **Q-17 (Learning Hub):** The Learning Hub has its own repository, `ntdatphu/learn.ntdp.id.vn`. The personal-site repository layout remains open under P-15.
- `[CONFIRMED]` **Q-18 / D-007 / P-25 (Learning Hub):** The Learning Hub shares the NTDP identity and design language of `ntdp.id.vn`, with a quieter education/content-focused presentation. Its footer links to `https://ntdp.id.vn/`; no personal-site cross-link belongs in its header. Other personal-site navigation and shared-code decisions remain outside this milestone.
- `[CONFIRMED]` **Q-19:** Build the Learning Hub before rebuilding the personal site.
- `[OPEN]` **Q-01** Where is the current site and its repository (visibility, what is wrong with it, keep or archive)? The planner could not read the current site (bot protection) and the public GitHub profile shows a single repository.
- `[OPEN]` **Q-04** Does the Owner have GitHub Pro or student benefits? What is the yearly budget limit for domain and services?
- `[CONFIRMED]` **Q-09 (Learning Hub):** Repository: `ntdatphu/learn.ntdp.id.vn`. The personal-site repository name remains open.
- `[CONFIRMED]` **Q-10 (Learning Hub):** The repository is public. Personal-site repository visibility remains open.
- `[OPEN]` **Q-15** Git identity for commits and commit signing yes/no. For D-006, PRs are handled through existing authenticated GitHub tooling.

## 9. Technology

- `[CONFIRMED]` **Q-11 (Learning Hub):** Astro, static output, CSS, and minimal native client JavaScript. No backend, database, content API, or JavaScript framework integration is needed. Following the Owner's TASK-007 custom-domain confirmation, configure `site: https://learn.ntdp.id.vn` with the default root base. Internal navigation and local assets must continue to respect Astro's configured base. The earlier D-006 project-site configuration was `site: https://ntdatphu.github.io`, `base: /learn.ntdp.id.vn`. The personal-site stack remains open.

## 10. Design

- `[CONFIRMED]` **Q-12 / D-007 / APPROVED P-25 (Learning Hub):** A simple, modern, professional, light-only, responsive, content-focused variation of the Owner's NTDP system. Reuse the personal site's visual identity and base palette/typography, without cloning its showcase layout. No giant dark hero, orbit graphics, floating 3D hero panels, portfolio sections, or distracting animation.
- `[CONFIRMED]` The shared palette is primary text `#1d1d1f`, muted text `#6e6e73`, light surface `#f5f5f7`, elevated surface approximately `#fbfbfd`/white, accent `#0071e3`, hover accent approximately `#0077ed`, and subtle black-alpha borders. Use restrained heading weights, tight line-height, negative letter-spacing, generous but controlled spacing, and card radii around 24–32px. Maintain practical AA contrast in interaction states.
- `[CONFIRMED]` Use a local, lightweight, static NTDP mark from the Owner's personal-site repository. Deriving/optimizing the existing geometry is allowed while preserving recognizable identity. No animated hero treatment or runtime hotlinks.
- `[CONFIRMED]` The shared header is sticky, compact (approximately 52–56px), translucent white with subtle backdrop blur and a very light bottom border. It contains only the NTDP mark and **Learning Hub** identity/home link; no search, hamburger, accounts, or personal-site cross-link.
- `[CONFIRMED]` Home has a compact white intro: eyebrow **Learning Hub**, heading **Explore by subject.**, and supporting copy **Notes, materials, and references organized around what I am learning.** Place the labeled **Search subjects** control below, approximately 600–680px maximum width with a comfortable 44px+ target. Keep the existing static search behavior and exact **No subjects found.** status; do not add suggestion copy.
- `[CONFIRMED]` Anchor the **Subjects** section on a very light `#f5f5f7` surface. Two substantial media-style cards sit side by side when space permits and stack on mobile, each with original decorative artwork, its real Subject name, an arrow, and a full-card native link. Do not add curriculum descriptions, counts, progress, badges, tags, or other invented metadata.
- `[CONFIRMED]` CCNA artwork is original local SVG/CSS networking imagery: abstract nodes, connection paths, packet dots, or geometric device forms using blue/cyan and neutral tones. It is conceptual decoration, not a real topology or curriculum. No Cisco logo or decorative trademark branding.
- `[CONFIRMED]` Linux System artwork is original local SVG/CSS systems imagery: abstract terminal rows, server forms, process grids, or filesystem branching using graphite/neutral tones with blue accents. No Tux, distro logos, external images, or copied illustrations. All artwork is decorative and hidden from assistive technology.
- `[CONFIRMED]` Subject pages use an editorial composition with Back to Subjects, a large Subject H1, adjacent artwork on desktop and title-first stacking on mobile, followed by Chapters and the unchanged empty-state copy. No sample rows, disabled chapter controls, or nonexistent content routes. Future chapters should fit editorial lists; future reading should fit approximately 44–48rem width and 1.7 line-height, without adding public Chapter pages until real content is approved. D-009 subsequently approves reusable learning components and excluded QA fixtures.
- `[CONFIRMED]` The restrained footer contains **NTDP Learning Hub**, **Learning, one subject at a time.**, **© <current year> Nguyễn Trần Đạt Phú**, and a small **ntdp.id.vn** link. Do not move this cross-link into the header.
- `[CONFIRMED]` Use restrained card/link microinteractions around 180–300ms, with clear hover, focus-visible, and active states. Remove nonessential motion under `prefers-reduced-motion`. No continuous decorative motion is required.
- `[CONFIRMED]` Local/system fonts only: no downloaded fonts, font packages, external font requests, or `@font-face`. The layout tolerates different system font metrics. D-007 preferred stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif`.
- `[CONFIRMED]` D-007 must work from approximately 320px through large desktop screens, without page-level horizontal overflow. Verify 320px, 375px, 768px, 1024px, 1280px, and 1920px; inspect screenshots and interaction states; verify keyboard navigation, reduced motion, and real 200% browser zoom where tooling permits. Use semantic headings, labeled search, appropriate search status announcements, practical contrast, usable touch targets, and meaningful Subject page titles.
- `[OPEN]` Personal-site visual direction remains undecided.

## 11. Security and privacy

- `[CONFIRMED]` Secrets never go into prompts or the repository. AI never touches credentials.
- `[CONFIRMED]` Security and safety for all users matter.
- `[CONFIRMED]` **P-09 / D-006 (Learning Hub):** No analytics, trackers, cookies, ads, third-party scripts, external fonts, CDN UI assets, external images, embeds, API calls, login, backend, or server-side content persistence. TASK-009 separately approves only local-browser assessment/progress storage as described above.
- `[OPEN]` **Q-13** When to add privacy/terms pages (now, or when accounts arrive).

## 12. Copyright and content policy

- `[CONFIRMED]` **P-11 / D-009 / APPROVED P-26 (Learning Hub):** Commercial/private references stay outside the public repository. Publish independently authored content; do not reuse source expression, assets, questions/choices, or labs without explicit redistribution rights. Unknown rights remain unpublished. Private provenance and a content review gate are required during future production; see [CONTENT_GUIDE.md](CONTENT_GUIDE.md).

## 13. Repository professionalism

- `[CONFIRMED]` The repository should look clean and professional on GitHub, with dedicated project files.
- `[PROPOSED]` **P-12** For every repository: `README.md`, `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `CODEOWNERS`, issue and PR templates, `.editorconfig`, `.gitignore`, `.env.example` (only when needed), `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; GitHub Actions for lint, build and link check; Dependabot; secret scanning; branch protection on `main` (configured by the Owner); Conventional Commits.
- `[OPEN]` **Q-14** Licenses: one for the code, one for the Owner's written content.

## 14. Quality bar

- `[PROPOSED]` **P-13** Responsive on phones; accessibility target WCAG 2.2 AA; fast loading; basic SEO; no broken links.

## 15. Delivery process

- `[CONFIRMED]` ChatGPT plans and writes Codex prompts; Codex implements; the Owner reviews and decides.
- `[CONFIRMED]` The Owner decides product scope, content, and visible behavior. The AI owns technical execution within that scope under the current `AGENTS.md` and asks only when a product/content/behavior decision is required.
- `[CONFIRMED]` Codex automates coding, checks, commits, feature-branch pushes, PR handling, and deployment. For D-006, it may merge once acceptance criteria are satisfied and repository protections permit; it must not bypass protections.
- `[CONFIRMED]` Reports to the Owner are in plain language (Vietnamese). Detailed rules: `AGENTS.md`.

## 16. Roadmap

- `[PROPOSED]` **P-14** Phases: 0 Discovery and decisions; 1 Learning Hub repository foundation; 2 Learning Hub skeleton and design system; 3 Learning Hub content features; 4 Quality pass; 5 Learning Hub goes live on its subdomain; 6 Personal site rebuild (separate repository, timing per Q-19). Accounts, backend, online editor, Vietnamese content and restricted content come later and only after separate approval.

## 17. Suggestion parking lot (NOT approved: do not implement)

- Resume reading position in the browser without an account (assessment/progress storage is confirmed separately in TASK-009).
- Search beyond Subject names inside Learning Hub content (Subject-name search is already confirmed).
- Privacy, terms and cookie pages; account deletion (when accounts exist).
- Online editor with roles (owner, editor, reader).

## 18. Open questions, index

Q-01 current site and repo · Q-02 Home sections · Q-03 public personal details · Q-04 student benefits and budget · Q-05 remaining note features (math, footnotes, other image/callout features) · Q-06 embed allowlist · Q-08 Apple sign-in · Q-09 personal-site repo name · Q-10 personal-site repo visibility · Q-11 personal-site stack · Q-12 personal-site design · Q-13 legal pages timing · Q-14 licenses · Q-15 git identity and signing · Q-17 personal-site repository layout.
