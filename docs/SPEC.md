# Project Specification: ntdp.id.vn (personal site) and its Learning Hub

**Status:** DRAFT v0.1 · 2026-10-06 · **Owner:** Nguyễn Trần Đạt Phú (@ntdatphu)

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
- `[CONFIRMED]` **Learning Hub** on its own subdomain, with **document storage first** (highest priority).
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

- `[CONFIRMED]` **Documents:** PDF files shared for reading/download.
- `[CONFIRMED]` **Notes:** self-written content in a Markdown-like format, with highlights and annotations in web style. The Owner writes them, or AI drafts from material the Owner supplies. In Phase 1 notes live in the repository; there is no online editor.
- `[CONFIRMED]` **External resources:** download links, videos, other websites, each with a preview.
- `[PROPOSED]` **P-03** Required metadata per resource: title, type, description, author/source, source URL, license or permission, language, tags, date added, status (`draft` or `published`).
- `[PROPOSED]` **P-04** A note can link to the document it explains (for example a book chapter).
- `[PROPOSED]` **P-05** Embeds come only from an allowlist; everything else renders as a link card with a preview.
- `[OPEN]` **Q-05** Which note features are wanted: callouts, highlights, tables, code blocks, math, diagrams, footnotes, images, collapsible sections?
- `[OPEN]` **Q-06** Which video/site sources are on the embed allowlist (for example YouTube)?
- `[OPEN]` **Q-07** How should the hub be organized: categories, tags, collections, learning paths?

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

- `[CONFIRMED]` Hosting: GitHub Pages. Domain: `ntdp.id.vn` at TenTen. The Learning Hub uses a subdomain of it.
- `[CONFIRMED]` New repositories; Codex CLI runs on the Owner's computer.
- `[PROPOSED]` **P-08** Build and test each site on a default `github.io` address first. A custom domain or subdomain is switched only after the Owner approves; the old site stays untouched until then; a rollback plan exists. The Owner does all DNS and GitHub settings.
- `[PROPOSED]` **P-15** Two repositories, one per site (GitHub Pages serves one site per repository; verify against current documentation).
- `[OPEN]` **Q-16** Subdomain name for the Learning Hub.
- `[OPEN]` **Q-17** One repository per site (P-15) or another layout?
- `[OPEN]` **Q-18** How do the two sites relate: cross-links and navigation, same look or different, shared components?
- `[OPEN]` **Q-19** When is the personal site rebuilt: after the Learning Hub, or in parallel? (Owner priority so far: Learning Hub first.)
- `[OPEN]` **Q-01** Where is the current site and its repository (visibility, what is wrong with it, keep or archive)? The planner could not read the current site (bot protection) and the public GitHub profile shows a single repository.
- `[OPEN]` **Q-04** Does the Owner have GitHub Pro or student benefits? What is the yearly budget limit for domain and services?
- `[OPEN]` **Q-09** Names of the new repositories.
- `[OPEN]` **Q-10** Public or private repository (depends on Q-04 and current GitHub rules).
- `[OPEN]` **Q-15** Git identity for commits, commit signing yes/no, and whether PRs are opened by `gh` CLI or manually.

## 9. Technology

- `[OPEN]` **Q-11** Technology stack. Criteria: works as a static site on GitHub Pages; few dependencies; strong Markdown support; good accessibility and performance; easy long-term maintenance; low cost. The planner presents 2–3 options with trade-offs; the Owner chooses.

## 10. Design

- `[OPEN]` **Q-12** Visual direction: reference sites the Owner likes, light/dark mode, typography, colors, tone. The planner proposes written directions; the Owner chooses.

## 11. Security and privacy

- `[CONFIRMED]` Secrets never go into prompts or the repository. AI never touches credentials.
- `[CONFIRMED]` Security and safety for all users matter.
- `[PROPOSED]` **P-09** Phase 1 has no analytics, no tracking, no cookies, no third-party scripts or fonts.
- `[OPEN]` **Q-13** When to add privacy/terms pages (now, or when accounts arrive).

## 12. Copyright and content policy

- `[PROPOSED]` **P-11** Publish a document only when the Owner confirms the right to do so (own work, open license, or explicit permission). Otherwise link to the official source. Notes are in the Owner's own words, not copied passages. AI never adds third-party files. Unknown rights means `rights: unverified` and not published.

## 13. Repository professionalism

- `[CONFIRMED]` The repository should look clean and professional on GitHub, with dedicated project files.
- `[PROPOSED]` **P-12** For every repository: `README.md`, `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `CODEOWNERS`, issue and PR templates, `.editorconfig`, `.gitignore`, `.env.example` (only when needed), `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`; GitHub Actions for lint, build and link check; Dependabot; secret scanning; branch protection on `main` (configured by the Owner); Conventional Commits.
- `[OPEN]` **Q-14** Licenses: one for the code, one for the Owner's written content.

## 14. Quality bar

- `[PROPOSED]` **P-13** Responsive on phones; accessibility target WCAG 2.2 AA; fast loading; basic SEO; no broken links.

## 15. Delivery process

- `[CONFIRMED]` ChatGPT plans and writes Codex prompts; Codex implements; the Owner reviews and decides.
- `[CONFIRMED]` AI does not act outside approved scope, does not take "good" actions on its own, and asks when unsure.
- `[CONFIRMED]` Codex automates coding, commits and pushes (to feature branches). The Owner merges.
- `[CONFIRMED]` Reports to the Owner are in plain language (Vietnamese). Detailed rules: `AGENTS.md`.

## 16. Roadmap

- `[PROPOSED]` **P-14** Phases: 0 Discovery and decisions; 1 Learning Hub repository foundation; 2 Learning Hub skeleton and design system; 3 Learning Hub content features; 4 Quality pass; 5 Learning Hub goes live on its subdomain; 6 Personal site rebuild (separate repository, timing per Q-19). Accounts, backend, online editor, Vietnamese content and restricted content come later and only after separate approval.

## 17. Suggestion parking lot (NOT approved: do not implement)

- Resume reading in the browser without an account (stored on that device only).
- Search inside the Learning Hub.
- Privacy, terms and cookie pages; account deletion (when accounts exist).
- Online editor with roles (owner, editor, reader).

## 18. Open questions, index

Q-01 current site and repo · Q-02 Home sections · Q-03 public personal details · Q-04 student benefits and budget · Q-05 note features · Q-06 embed allowlist · Q-07 hub organization · Q-08 Apple sign-in · Q-09 repo name · Q-10 repo visibility · Q-11 stack · Q-12 design · Q-13 legal pages timing · Q-14 licenses · Q-15 git identity and PR method · Q-16 subdomain name · Q-17 repository layout · Q-18 relation between the two sites · Q-19 personal-site timing.
