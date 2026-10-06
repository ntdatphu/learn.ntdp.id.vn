# Public content rules

D-009 / APPROVED P-26 establishes independently authored learning material.
Commercial and private sources are references, not publication assets. TASK-008
builds infrastructure only and does not process any commercial source.

## Source boundary

- Keep source PDFs, screenshots, extracted images, OCR/text dumps, and private
  provenance outside the public repository and production output.
- A lawful private reading copy does not grant redistribution rights. Do not publish
  source figures, tables, screenshots, questions, answer choices, answer keys, or
  lab scenarios unless explicit redistribution rights cover that use.
- Do not use page-by-page or paragraph-by-paragraph paraphrasing. Rewording quiz
  questions/choices or mirroring source labs is also prohibited.
- Translating source prose is not a publication workaround.
- Do not put source page references, private filesystem paths, or copied content
  into public UI, comments, fixtures, generated assets, or commit/PR text.
- Do not use a draft flag as a privacy mechanism in a public Git repository.

## Independent authoring

Extract and understand the knowledge first in a private workspace, then independently
author the teaching material. Design the explanation, ordering, examples, tables,
diagrams, practice scenarios, and questions for this Learning Hub's objectives.
A changed surface or different wording is not enough when the work still mirrors
protected expression or a source exercise.

Keep terminology, protocol names, CLI commands, and technical facts correct rather
than artificially changing them to appear different. Verify technical claims and
commands against current authoritative documentation when appropriate. Verification
must not copy a source's presentation or introduce unlicensed assets.

Public prose, diagrams, tables, examples, labs, checklists, and assessment questions
must be original, independently authored work unless explicit redistribution rights
exist. Use original generic geometry and independently chosen examples. Preserve
licenses/attribution where a separately approved reusable asset requires them.
Rights and public inclusion remain Owner content decisions; uncertain rights mean
leave the material unpublished, not invent permission.

## Provenance and review

During future content production, maintain a private record of sources consulted,
knowledge extracted, technical verification, original authoring decisions, and
rights evidence. Keep private source locations and page mapping out of public
artifacts. Public factual citations, when useful and approved, should point to
legitimate accessible primary documentation rather than exposing private sources.

Before proposing publication, review each artifact for source-derived prose,
1:1 paraphrase/translation, copied questions/choices, mirrored lab scenarios,
traced figures, reconstructed source tables, and leaked source files or metadata.
Do not publish when any of these concerns remains unresolved. Content review is
separate from technical QA; a passing build does not establish originality or rights.

CCNA production is Part/Chapter at a time. TASK-008 creates no production Parts,
Chapters, objectives, commands, checklists, or materials. Synthetic infrastructure
fixtures belong only to the excluded QA harness and must not become public lessons.
