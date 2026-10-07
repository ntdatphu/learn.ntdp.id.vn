# Learning UI contract - visual acceptance candidate

D-010 / APPROVED P-27 defines the direction below. TASK-011 proposes its rendered
expression in **three local-only specimens**. Visual acceptance is required before
broad implementation. This document does not approve publication of the prototype,
change the public CCNA experience, or authorize modifications to Draft PR #12.

## Editorial + technical

Whitespace and typography group the Chapter. Normal explanation stays on the page;
section labels, headings and a restrained rule distinguish practice/review. Surfaces
are reserved for Key Topics, CLI, field references and topology canvases. Use
12-16px corners, subtle borders, nearly no decorative shadow, local/system fonts,
and a reading measure near 44rem. Avoid dashboard, IDE and textbook reproduction.

| Role | Text/action | Quiet surface | Purpose |
| --- | --- | --- | --- |
| Blue | `#0066CC` | `#EFF6FF` | Links, action, command interaction, focus |
| Amber | `#875D08` | `#FFF8E8` | Key Topic, evidence, important observation |
| Green | `#226744` | `#F0F8F3` | Explicit success/expected result |
| Purple | `#69418C` | `#F7F2FC` | Config Checklist and reusable procedure |
| Red | `#A53131` | `#FFF2F1` | Actual warning/error only |
| Neutral | `#25252C`, muted `#5C616B` | `#F7F8FA` | Structure, prose, ordinary output |

The palette is semantic, not syntax decoration. Do not make every role equally
saturated. Accompany color with labels, typography, rules or state text. Prototype
highlight intents cover focus, attention, change, warning, success, interface and
value; these are an isolated typed study, not a final authoring-schema migration.
Demonstrate word/phrase/token/value/state, whole line, table cell/row and diagram
node/endpoint/link emphasis. Each emphasis must explain teaching intent.

## Recognizable field reference

Config Checklist uses a 4px purple leading rule, a distinct lavender header with
an original procedure glyph, a full-size **Config checklist** identity and a strong
procedure title. A white, divided ordered body remains readable. It must be
recognizable in one second of scrolling; no tiny badge or book-derived treatment.
Key Topics use quiet amber with a 3px rule. Practice uses a neutral structural rule
and labeled header, not an additional saturated role. Review returns to open prose.

## Command-local interaction

A copy control belongs immediately after its command text in the same row. Idle
shows a compact outline glyph. Fine-pointer hover or keyboard focus adds a subtle
blue surface to the whole row; the glyph becomes stronger. Reserve the same inline
width for feedback so the row does not reflow.

On success, **✓ Copied** replaces the glyph beside that exact command for **1250ms**.
Copy only the command, never prompt/output or a block. Keep focus in place. A
visually hidden polite live region in that row announces success; no visible bottom
status, distant toast or page notification. Failure remains local with manual
selection available. Narrow/coarse/no-JS contexts have no copy control. Use pointer
capabilities and width, never user-agent detection.

Prompt is muted, command is strong, ordinary output neutral. Evidence/change has
selective amber emphasis; warning red, genuine expected/success result green.
Comment, omitted content and step markers have distinct quiet roles. The prototype
uses synthetic labeled output; it is not device execution evidence.

## Orientation

A small right-side sticky Chapter outline answers current position on desktop.
Use wrapping concise titles; current location has a rule, stronger type and a
visible **Current** label plus `aria-current="location"`. Clicking uses native
anchors with header-safe scroll margins and normal smooth scroll. Reduced motion
uses immediate scrolling. Below 68rem, replace the persistent sidebar with a compact
native Chapter-outline disclosure near the top. Jump links remain usable without JS.

## Topology grammar

Keep these layers separate: device icons, links, endpoint/interface labels, device
labels, sequence/callout, focus, and optional context/legend. Generic technical
outline icons and geometry are original; no vendor/tool/source graphics.

- Device label belongs below its icon. No automatic device numbers.
- Interface labels belong beside their **own** endpoint. Two relevant endpoint
  names require two labels; a switch interface is not a mid-link property.
- Mid-link labels are actual link properties such as Trunk or a rate.
- Sequence numbers, if used, represent an explained order; the prototype numbers
  the user-controlled state text, not devices.
- Resolve collisions in order: label placement, node placement, restrained leader,
  reduced secondary density, expanded view. Never hide bad placement with tiny text.
- Mobile repositions the same graph and endpoint labels. Do not shrink the desktop
  SVG. Keep every essential device/link, preserve focus and provide text connections.

The simple specimen has one switch/two clients and owned interfaces. The complex
specimen has nine devices/eight links, a Trunk label and an explicitly described
three-stop path. These are manual placement studies, **not** the final TASK-012
layout/router engine.

## Deliberate diagram interaction

No autoplay. **Play / Step / Reset** traverse the stated path. Play advances at
1800ms per state and can pause; Step is immediate; Reset restores the neutral view.
Reduced motion removes visual interpolation while retaining deliberate state changes.
Stronger path/node/endpoint geometry and explicit state text explain focus; unrelated
links dim slightly while labels keep contrast.

Hover or keyboard-focus an interface reference to coordinate endpoint, link and node
focus. Leaving restores the normal/current sequence view. Touch can pin focus and
clear it explicitly. Understanding never depends on hover or the enhancement.

Complex **Expand diagram** uses a native modal dialog: close action, Escape,
initial close-button focus, native background inertness plus a boundary Tab loop, return
focus to the opener, and background scroll lock. The larger canvas supports bounded
100-200% button zoom, scroll/keyboard/touch pan and fine-pointer drag pan. Gesture
pinch and a final automatic collision/layout model are deferred to TASK-012; do not
add a heavy diagram/animation library for this acceptance study.

## Review and isolation

Sources live only in `tests/visual/`; `.qa/visual` source/build/cache is ignored.
`npm run build:visual` generates three specimens plus their index. Production never
imports this harness or stylesheet. Production output must match the main baseline,
with no prototype routes, assets, curriculum or behavior changes. No framework,
third-party runtime assets, fonts, tracking or source PDF reading is part of TASK-011.

Review default desktop/mobile views, command idle/focus/copied, diagram focus,
sequence and expanded states. Check keyboard, live feedback, labels, modal focus,
actual 200% browser zoom, reduced motion, no-JS readability and page overflow.
After the review pack and Draft PR are delivered, stop for Owner/Planner acceptance.
Do not merge, publish, begin TASK-012 or retrofit the pilot.
