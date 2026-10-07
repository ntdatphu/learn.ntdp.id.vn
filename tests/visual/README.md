# TASK-011 local visual review

Exactly three primary specimens: `/learning/`, `/simple/`, `/complex/`.
`/` only indexes them. All text and topology data are synthetic review fixtures.
These are candidates for visual acceptance, not approved learning content.

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run build:visual
npm run preview:visual
```

Open `http://127.0.0.1:4323/`. Use 1440 × 900 and 390 × 844 for primary
review, then check narrow screens, actual 200% browser zoom and reduced motion.
In Learning, jump to Observe and Field reference. Idle copy is visually hidden;
hover the command row or Tab to its tight icon button on a fine-pointer desktop.
On the diagrams, focus the inline interface reference;
on touch, tap it and clear focus. In Complex, try Play/Pause and Expand inside the
canvas. Desktop shows Step/Reset; mobile has them in More (Escape closes it).
Scroll through the mobile diagram to test its sticky safe rail. Open Connection
details for continued reading past the canvas and check that controls leave with it.
In the expanded dialog, test Tab/Shift+Tab, Escape, zoom, scroll and drag/swipe pan.

The generated source, output and cache live under ignored `.qa/visual/`. The
production config continues to build only `src/`. No production component imports
this harness. `Layout.astro` reuses the existing site identity; all new styles are
scoped to the prototype. `topologies.ts` provides two manual compositions of the
same graphs; automatic routing/collision solving is outside this acceptance pack.
The small native scripts only enhance copy, outline position and diagram controls.

Screenshot gallery and QA evidence are local review artifacts outside Git. They
must not be copied into `public/` or included in production deployment. See
`docs/LEARNING_UI_CONTRACT.md` for the proposed visual/interaction rules.

Do not merge, deploy, begin TASK-012 or change Draft PR #12 before visual acceptance.
