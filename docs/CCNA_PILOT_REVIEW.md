# CCNA content pilot — review candidate

This branch contains one complete candidate, **Ethernet Ports: Configure, Verify,
Diagnose**, in the independent Part **Ethernet operations**. It establishes a
proposed CCNA Chapter Standard v1 for review, not a published content standard.
**The Draft PR must not be merged or deployed without Owner/Planner content review.**
The `published` data value enables candidate routes in the branch build; main
has no real Chapter until that review gate is explicitly passed.

## Learning design

Four objectives cover interface-scoped changes, both-end operating agreement,
verification evidence, and counter-based diagnosis. The lesson moves through
quick understanding, detailed study and practice rather than reproducing a source
TOC. One bench topology plus an independently authored assessment drawing, two responsive evidence tables, two Notes and four
shared Key Topics support the lesson. A walkthrough, field checklist, four-step
Guided Lab, independently posed Challenge Lab and measured troubleshooting case
exercise recall, scope control and evidence-based reasoning. Eight sections contain
15 authored CLI blocks (including exercises), backed by 27 exact command records;
the checklist additionally renders its shared command references.

The 36-question bank has nine records per objective and all eight native types.
Before selects eight (two per objective), After twelve (three per objective).
Same-cycle IDs differ when available and retry prefers unused/recently-unused
records. Post has authored answer explanations, targeted distractor guidance
where useful and real review anchors; Before only shows measurement results.
The central/inline checklist is one record, including exact command references.
No neighbors, additional Chapters or Linux curriculum exist.

## Technical verification and limits

- Interface contexts, ranges, monitoring and port/media limits were checked in
  [Cisco's interface configuration guide](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9200/software/release/17-11/configuration_guide/int_hw/b_1711_int_and_hw_9200_cg/configuring_interface_characteristics.html).
- Both-end negotiation and mismatch interpretation were checked in
  [Cisco's Ethernet autonegotiation guide](https://www.cisco.com/c/en/us/support/docs/lan-switching/ethernet/10561-3.html).
- Protective states, CRC/counter interpretation and diagnosis were checked in
  [Cisco's switch-port troubleshooting guide](https://www.cisco.com/c/en/us/support/docs/switches/catalyst-6500-series-switches/12027-53.html).

The candidate deliberately scopes fallback reasoning to legacy 10/100 copper;
Gigabit/fiber/multi-Gigabit controls must follow the exact platform guide. Size
counter accounting is not presented as a universal tagged/jumbo-frame rule.
Private notes record the historical/generalized source claims and the current
platform caveats separately. Review these teaching nuances rather than grading
universal predictions that depend on a particular module.

Commands were checked against documentation and model validation. No physical
IOS device or network simulator was available/executed: outputs are explicitly
**authored illustrative excerpts**. Lab prerequisites define console access, an
isolated existing VLAN, preaddressed endpoints and suitable cables. Real lab
execution is an additional learning-quality check before broader production.

## Copyright and provenance gate

Private source structure/range mapping, factual Knowledge Specification,
assessment blueprint and provenance remain outside Git. Temporary extracted prose
and a single source figure capture were removed before public authoring. Public
prose, diagrams, table decision structure, CLI device names/outputs, checklist,
labs, troubleshooting and questions were independently designed. Exact CLI
syntax and factual terminology are retained for technical accuracy.

Review for source screenshots/figures, traced layouts, table clones, verbatim or
translated prose, paragraph-by-paragraph paraphrase, source questions/options,
source lab scenarios/captions/checklists and source visual identity. Similarity
metrics are only warning signals and cannot establish independence by themselves.
No PDF, source asset, private range mapping or extracted source data is included.

## Local review

Run `npm ci`, `ASTRO_TELEMETRY_DISABLED=1 npm run check`, `npm test`, and
`ASTRO_TELEMETRY_DISABLED=1 npm run build`. Serve `dist` locally. Candidate routes:

- `/subjects/ccna/chapters/ethernet-port-operations/`
- `/subjects/ccna/checklists/verify-ethernet-port-change/`

Start from Home → CCNA to inspect Part placement and central checklist reuse.
Core prose and native disclosures work without JavaScript. Assessment/progress
stay only in this browser; no backend, account, analytics or network transmission.

## Verification completed before Draft PR

- Clean install: `npm ci`, zero reported vulnerabilities; no dependency changes.
- Astro check: 58 files, zero errors/warnings/hints. Unit tests: 54 passed.
- Production build and output guard: exactly six candidate routes, no fixtures,
  private source files/paths, PDF/assets, invented neighbors or external runtime
  resources. Fixture build and `git diff --check` passed.
- Real Chrome pilot: 49 grouped checks passed at 320/375/768/1024/1280/1920,
  including all 10 search cases, balanced 8/12 checks, scoring/feedback, unused
  retry, reload/latest/best/scoped reset, actual command-only clipboard, native
  disclosures, no JavaScript, corrupt/denied/quota storage and reduced motion.
- Inherited eight-type assessment regression: 27 grouped checks passed.
  Additional complete return-navigation/reading/header/footer captures: six widths.
- Actual Chrome 200% zoom: Chapter, checklist detail, CCNA and library passed at
  innerWidth 640/devicePixelRatio 2. No horizontal page overflow or axe violations.
- Browser page/console errors and unexpected runtime requests: zero. Private
  copyright and learning review notes retained outside Git; visual captures
  inspected for the real candidate. No physical IOS or simulator execution claimed.

The pilot remains a Draft PR only. The deployed main contains the completed
platform and empty CCNA library until Owner/Planner content review authorizes
publication. No second Chapter was processed.
