# Learning content authoring API

TASK-008 provides presentation infrastructure, not curriculum. The production
catalog (`src/learning/catalog.ts`) is empty; only Home and the two Subject pages
are routable. Read [public content rules](CONTENT_GUIDE.md) before producing content.

## Data and publication

Use the TypeScript interfaces in `src/learning/model.ts`. Keep authored records in
small subject/part modules and collect them into a `Catalog`. Validate the complete
catalog with `validateCatalog` before rendering. Records use stable lowercase
hyphenated IDs; IDs must not depend on array order. Objective IDs are reserved for
future assessment mapping. Chapter slugs must be unique within a Subject.

A Chapter has a Subject, Part ID, stable ID/slug, title, optional intro, publication
state, objectives, ordered sections, summary, and optional previous/next Chapter
IDs. The Part's Subject must agree with the Chapter's Subject. Section and rendered
block anchors must be unique within a Chapter. Missing references fail validation,
including references in hidden solutions and nested exercises.

Adding records alone does not publish pages. A later approved content task must
explicitly add a static route that filters `publication === 'published'` and renders
`ChapterLayout` with the Chapter and complete catalog. Draft content must remain
outside public output; a draft flag does not make committed text private. Use
`chapterHref(chapter, import.meta.env.BASE_URL)` for links. Subject links, Chapter
navigation, and related-checklist links respect the configured base. Neighbor links
render only for available published Chapters in the same Subject. Keep missing
neighbors absent; do not invent titles or disabled navigation.

## Shared records and block API

Strings are escaped plain text, not HTML. Plain prose needs no additional
abstraction: `{ kind: 'prose', paragraphs: [...], items: [...] }`. Lists are optional.
Section headings are H2, block headings H3, and exercise-step headings H4.

| Block / record | Author-supplied fields and behavior |
|---|---|
| Note | `kind: 'note'`, optional `label`, `paragraphs`, optional `items`; supports multiple paragraphs in a quiet labeled aside. |
| Key Topic | Shared record: `id`, `title`, `paragraphs`, optional `items`, explicit `summary`. Use `{ kind: 'key-topic', topicId }` in a section. The stronger blue treatment has a stable heading anchor. |
| Key Topics review | `keyTopicsFor(chapter, catalog)` resolves the actual records in reading order. Review links and condensed text use record titles/summaries; there is no DOM scraping or duplicated review prose. |
| Table | `kind: 'table'`, `id`, `caption`, explicit `mode`, `columns: [{id,label}]`, `rows: [{id,cells}]`. Each row must match the column count. |
| Diagram | `kind: 'diagram'`, `id`, `caption`, `description`, view-box `width`/`height`, `nodes`, `links`. Generic geometry is rendered locally as responsive SVG. |
| CLI | `kind: 'cli'`, `id`, `caption`, ordered `lines`. Command lines reference shared command IDs; outputs and comments contain their own text. |
| Config Checklist | Shared record: `id`, `title`, `category`, ordered `steps`, optional `purpose`, `verification`, `commonMistakes`, `relatedChapterIds`. Use `{ kind: 'checklist', checklistId }`. |
| Walkthrough | `kind: 'walkthrough'`, `id`, `title`, optional `intro`, ordered steps `{id,title,content}`. Content uses reading blocks. |
| Guided Lab | `kind: 'guided-lab'`, `id`, `title`, `goal`, `startingState`, optional `prerequisites`; steps `{id,title,action,why,verify,expectedResult}`. Action and verification use reading blocks. |
| Challenge Lab | `kind: 'challenge-lab'`, `id`, `title`, `goal`, `startingState`, `requirements`, `expectedEndState`, optional `hints`, `solution`. Solution uses reading blocks in a closed native disclosure. |
| Troubleshooting | `kind: 'troubleshooting'`, `id`, `title`, `scenario`, `symptoms`, `evidence`, `learnerPrompt`, `diagnosis`, `explanation`, `correctiveAction`, `verification`. Reading-block groups compose the evidence and answer. Diagnosis is initially closed. |
| Summary | Chapter `summary: {paragraphs, items?}` renders a quiet final review, without automatic summarization. |

Reading blocks are prose, Note, table, diagram, and CLI. These compose exercise
starting states, actions, verification, and solutions without nesting another full
Chapter renderer. Native `details`/`summary` remain usable with JavaScript disabled.
Do not introduce a client framework or runtime content request for authoring.

## Tables and diagrams

Choose `cards` for row-wise label/value information. Desktop uses a captioned
semantic table; narrow screens show the same row data as labeled definition lists.
CSS exposes only one representation at a time. Long labels and values wrap.

Choose `scroll` for comparisons/matrices that depend on column relationships.
The table keeps its column/row headers inside a labeled, keyboard-focusable
horizontal region with a visible scroll instruction. Only the inner region scrolls.
Do not shrink text to fit a matrix on a phone.

Diagram nodes use `client`, `server`, `switch`, `router`, or `cloud`, with coordinates
inside the view box. Links reference node IDs; `wireless: true` draws a dashed link;
an optional label identifies a link. Shapes are original generic geometry, not
vendor symbols. The SVG has an accessible title/description and the figure shows
its caption, description, and a readable numbered node legend. Describe connection
meaning in prose; do not rely on tiny SVG labels or color alone on mobile. Add more
original geometry only when a real authored diagram requires it.

## CLI and shared procedures

A command record has `id`, `text`, optional `prompt`, `copyable`, and `highlight`.
A CLI line is one of:

- `{kind: 'command', commandId}`
- `{kind: 'output', text, verified?: true}`
- `{kind: 'comment', text}`

Only mark output `verified` when the result really has been verified. The output
includes a visible Verified label as well as restrained green styling. Highlighted
commands use blue emphasis. Prompts, comments, and unverified output stay neutral.
Long lines scroll inside the CLI region and remain selectable.

Copy controls start hidden and disabled. They appear only with a secure, available
Clipboard API and `(min-width: 48rem) and (hover: hover) and (pointer: fine)`.
Each copies exactly its command record's text, never prompt/output or the whole
example. Success shows **Copied** and announces **Command copied.** briefly.
Failure announces **Could not copy. Select the command text to copy it manually.**
There is no Copy all, user-agent detection, or deprecated clipboard fallback.
Coarse pointers and narrow layouts have no copy controls, including when resized.

Checklist steps reference shared command IDs instead of copying command strings.
Each step has an instruction and optional verification guidance. Overall verification
and common mistakes are optional; related Chapter links include only published
records. TASK-010 can query the same `catalog.checklists` and render the same
`ConfigChecklist` with a catalog. There are no completion controls or library route
in TASK-008.

## Future assessment integration

`ChapterLayout` exposes named `knowledge-check-before` and `knowledge-check-after`
slots. TASK-009 can supply approved components; the layout currently renders no
quiz, score, question bank, objective breakdown, or persistence. Before is placed
between objectives and content; After follows Chapter Summary. Keep objective IDs
stable when adding assessment mappings.

## Non-public fixture and checks

`tests/fixtures/chapter.ts` is explicitly synthetic, neutral test data.
`tests/fixtures/ChapterFixture.astro` exercises every primitive. Neither is imported
by any production route. The harness generates a separate ignored `.qa/src/pages`
entry and uses its own config/output/cache. No test-only page lives in `src/pages`.

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run check
npm test
ASTRO_TELEMETRY_DISABLED=1 npm run build:fixture
npm run preview:fixture
```

The fixture preview uses local port 4322. Stop its background daemon with
`npx astro preview stop` before reinstalling dependencies. Use it for browser/axe checks at 320,
375, 768, 1024, 1280, and 1920px; inspect long headings, both table modes, diagrams,
CLI inner scrolling/copy, procedures, and disclosures. Also verify keyboard focus,
copy success/failure, coarse pointer, no JavaScript, reduced motion, and 200% zoom.
The fixture is test data, never a lesson or publication asset.

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run build
git diff --check
```

Production `postbuild` runs `verify:public`: it currently enforces exactly Home and
two empty-state Subject routes and rejects fixture strings, extra content routes,
PDFs, external runtime URLs, or downloaded fonts. A later approved publication task
must deliberately update that allowlist to the exact new real routes and retain the
fixture/source exclusion checks. Never disable the guard merely to pass a build.

## Assessments and browser-local progress (TASK-009)

Define an independently authored `QuestionBank` with a positive `version`, Chapter
ID, Before/After counts, and questions. Each question has a stable ID, Chapter and
objective references, eligible modes, type, prompt, labeled choices, exact correct
choice IDs, authored explanation, optional distractor explanations, review anchor,
and optional reading-block context. `validateQuestionBank` checks references,
answers, context, and coverage. Bump the bank version when content/answer/objective
mappings change so stale saved results are reset only for that Chapter.

Supported types are single-choice, multiple-choice, true-false, classification,
CLI interpretation, configuration selection, troubleshooting, and topology/concept
reasoning. All use native radio controls except multiple-choice, which uses
checkboxes. Classification assigns one item/scenario to a category; there is no
matching, drag/drop, or graphical interaction. True/false uses choice IDs `true`
and `false`. Non-multiple types have exactly one correct choice. Multiple-choice
requires the exact correct set: no partial or negative credit.

Each Chapter objective needs eligible questions in both modes. Counts must be at
least the objective count; target about 8–12 Before and 10–15 After when the bank
supports that. Selection shuffles within objective pools and rotates across them,
redistributing exhausted pools. Within each pool Post avoids the latest Pre IDs
first, then favors unused/least-recently-used IDs. Reuse is allowed when a pool
cannot otherwise cover its objective. No question ID repeats within an attempt.

Place `KnowledgeCheck` in the existing `knowledge-check-before` slot; the Chapter
layout now puts that slot immediately after the intro, before objectives. Place
After plus `ChapterProgress` in `knowledge-check-after`. Pass the same Chapter,
catalog, and bank to both checks; pass `chapterId` to progress. Do not fork the
Chapter renderer. Question contexts reuse the reading renderer with scoped DOM IDs
so Before/After copies cannot collide. Explanations are rendered only for After;
Before displays score, objective breakdown, and areas to pay attention to.

Client scoring is inspectable static code, not an exam security boundary. Correct
answer definitions must be available to the browser. Do not pretend the answer
model is secret or add a backend. Prompts and authored feedback remain static
escaped HTML; there is no runtime content fetch or generated explanation.

Progress key: `ntdp-learning:progress:<chapterId>`, payload `schemaVersion: 1` and
bank version. It stores first/latest Before, recent Pre IDs, latest/best After,
up to 12 After summaries with answers/question IDs, objective scores, timestamps,
and corresponding Pre attempt IDs. Improvement compares latest Before/After only
when they belong to the same study cycle, using rounded percentage-point difference.
First Before is preserved; best After compares score ratios. Storage contains no
person/account/analytics identity and nothing is sent anywhere.

Malformed data is scoped-reset; a known bank revision resets only that Chapter.
Unknown newer schema data stays untouched until explicit reset. Denied storage or
quota errors leave checks usable in memory with a visible notice. Reset requires
opening the disclosure and explicitly confirming deletion; it never clears all
storage or removes another Chapter/application key. Core content remains readable
without JavaScript; both checks show an accessible unavailable message.

The generated `/assessment/` QA fixture uses 36 neutral questions, three objectives,
Before count 9 and After count 12. `/assessment-types/` tests every type together.
These exist only in the excluded harness. `src/assessment/catalog.ts` contains no
production banks. Never copy fixture strings into a real bank.
