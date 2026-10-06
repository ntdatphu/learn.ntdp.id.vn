/** SYNTHETIC TEST FIXTURE ONLY. Never imported by production routes/catalogs. */
import type { Catalog, Chapter, DiagramBlock } from '../../src/learning/model.ts';
import { validateCatalog } from '../../src/learning/validate.ts';
const prose = (text: string) => ({ kind: 'prose' as const, paragraphs: [text] });
const diagram: DiagramBlock = {
  kind: 'diagram', id: 'fixture-diagram', caption: 'Original abstract geometry — test-only figure',
  description: 'Five arbitrary shapes A through E form a simple chain. The third connection is dashed. The labels below provide a readable text alternative at narrow sizes. This arrangement has no curriculum meaning.',
  width: 800, height: 220,
  nodes: [
    { id: 'fixture-a', label: 'Fixture A', kind: 'client', x: 80, y: 110 },
    { id: 'fixture-b', label: 'Fixture B', kind: 'switch', x: 240, y: 110 },
    { id: 'fixture-c', label: 'Fixture C', kind: 'router', x: 400, y: 110 },
    { id: 'fixture-d', label: 'Fixture D', kind: 'cloud', x: 560, y: 110 },
    { id: 'fixture-e', label: 'Fixture E', kind: 'server', x: 720, y: 110 },
  ],
  links: [{ from: 'fixture-a', to: 'fixture-b', label: 'A' }, { from: 'fixture-b', to: 'fixture-c', label: 'B' }, { from: 'fixture-c', to: 'fixture-d', label: 'C', wireless: true }, { from: 'fixture-d', to: 'fixture-e', label: 'D' }],
};
export const fixtureChapter: Chapter = {
  id: 'fixture-reading', slug: 'fixture-reading', subjectId: 'ccna', partId: 'fixture-part', publication: 'draft',
  title: 'A synthetic reading chapter for long-heading and content-layout verification',
  intro: 'This is a non-published test document. All text, commands, tables, diagrams, and exercises are invented neutral fixtures. Nothing here is learning curriculum.',
  objectives: [
    { id: 'fixture-objective-layout', text: 'Exercise a stable objective ID and inspect its wrapping across narrow and wide layouts.' },
    { id: 'fixture-objective-primitives', text: 'Check the presentation of supporting notes, an emphasized topic, and a linked review item.' },
    { id: 'fixture-objective-controls', text: 'Verify that optional controls enhance the document while every content block remains readable without JavaScript.' },
  ],
  sections: [
    { id: 'fixture-explanation', title: 'Readable explanations and emphasis', blocks: [
      prose('A calm reading surface starts with a clear measure, generous line spacing, and a predictable rhythm. This neutral paragraph exists only to test long-form reading. It contains no technical instruction or source-derived statement.'),
      prose('A second paragraph provides enough text to inspect spacing and line length. The surrounding document should remain readable at mobile widths and at doubled browser zoom without turning every paragraph into a card.'),
      { kind: 'note', paragraphs: ['This supporting note uses a quiet neutral surface. It is intentionally distinct from the stronger topic treatment.', 'A second paragraph tests spacing inside a multi-paragraph note.'], items: ['A generic supporting observation.'] },
      { kind: 'key-topic', topicId: 'fixture-key-topic' },
    ] },
    { id: 'fixture-visual-references', title: 'Tables and original diagrams', blocks: [
      { kind: 'table', id: 'fixture-cards-table', caption: 'Row-wise fields — explicit cards mode', mode: 'cards', columns: [{ id: 'name', label: 'Synthetic row label with a deliberately long heading' }, { id: 'value', label: 'Arbitrary value' }, { id: 'context', label: 'Test-only context' }], rows: [{ id: 'first', cells: ['Entry Alpha', 'fixture-token-with-no-spaces-abcdefghijklmnopqrstuvwxyz0123456789', 'A long descriptive field that should wrap while keeping its label attached.'] }, { id: 'second', cells: ['Entry Beta', 'Value B', 'A shorter field.'] }] },
      { kind: 'table', id: 'fixture-scroll-table', caption: 'Comparison relationships — explicit scroll mode', mode: 'scroll', columns: [{ id: 'row', label: 'Arbitrary row' }, { id: 'alpha', label: 'Column Alpha' }, { id: 'beta', label: 'Column Beta' }, { id: 'gamma', label: 'Column Gamma' }], rows: [{ id: 'first', cells: ['Sample One', 'Value A', 'A deliberately longer comparison value.', 'Value C'] }, { id: 'second', cells: ['Sample Two', 'Value D', 'Value E', 'Value F'] }] },
      diagram,
    ] },
    { id: 'fixture-procedures', title: 'Commands and reusable procedures', blocks: [
      { kind: 'cli', id: 'fixture-terminal', caption: 'Synthetic command lines and output', lines: [{ kind: 'comment', text: '# Test-only strings; not instructions for a real system.' }, { kind: 'command', commandId: 'fixture-inspect' }, { kind: 'output', text: 'Synthetic output: label = alpha', verified: true }, { kind: 'command', commandId: 'fixture-long-command' }, { kind: 'output', text: 'Unverified synthetic output remains neutral.' }, { kind: 'command', commandId: 'fixture-not-copyable' }] },
      { kind: 'checklist', checklistId: 'fixture-checklist' },
      { kind: 'walkthrough', id: 'fixture-walkthrough', title: 'A short synthetic sequence', intro: 'This sequence tests composition between prose and a CLI block.', steps: [{ id: 'observe', title: 'Observe the generic starting label', content: [prose('Inspect an arbitrary fixture label; there is no real task to perform.')] }, { id: 'compare', title: 'Compare the synthetic record', content: [{ kind: 'cli', id: 'fixture-walkthrough-cli', caption: 'A composed command reference', lines: [{ kind: 'command', commandId: 'fixture-inspect' }] }, prose('The same command definition is reused without duplicating its text.')] }] },
    ] },
    { id: 'fixture-practice', title: 'Structured practice and progressive disclosure', blocks: [
      { kind: 'guided-lab', id: 'fixture-guided', title: 'Inspect a synthetic state', goal: 'Exercise action, rationale, and verification hierarchy.', startingState: [prose('The invented starting label is alpha.')], prerequisites: ['No real environment or source material is needed.'], steps: [{ id: 'inspect', title: 'Read the test-only value', action: [{ kind: 'cli', id: 'fixture-guided-action', caption: 'Action — synthetic command', lines: [{ kind: 'command', commandId: 'fixture-inspect' }] }], why: 'A distinct rationale helps the reader connect the action to its purpose.', verify: [{ kind: 'cli', id: 'fixture-guided-verify', caption: 'Verification — synthetic output', lines: [{ kind: 'output', text: 'Synthetic value: alpha', verified: true }] }], expectedResult: 'The arbitrary label remains alpha.' }, { id: 'review', title: 'Review the fixture result', action: [prose('Read the result in the document.')], why: 'The next numbered step remains clear without an extra navigation control.', verify: [prose('The previous result is still visible.')], expectedResult: 'No content is hidden by script initialization.' }] },
      { kind: 'challenge-lab', id: 'fixture-challenge', title: 'Compare two arbitrary labels', goal: 'Exercise an optional hint and a native solution disclosure.', startingState: [prose('Two invented labels are alpha and beta.')], requirements: ['Keep the two labels distinct.', 'No environment changes are required.'], expectedEndState: 'Both fixture labels remain readable.', hints: ['The answer is intentionally generic.'], solution: [prose('Synthetic solution text: keep alpha and beta as separate values.')] },
      { kind: 'troubleshooting', id: 'fixture-troubleshooting', title: 'Inspect an arbitrary mismatch', scenario: 'A test record displays the invented label beta instead of alpha.', symptoms: ['The two fixture strings differ.'], evidence: [{ kind: 'cli', id: 'fixture-evidence', caption: 'Synthetic observed output', lines: [{ kind: 'output', text: 'fixture-label: beta' }] }], learnerPrompt: 'Which part of this invented record differs from its starting state?', diagnosis: 'The synthetic label differs.', explanation: [prose('This is neutral fixture copy, not a real troubleshooting scenario.')], correctiveAction: [prose('The author can replace the fixture label for a test run.')], verification: [prose('Compare the two arbitrary strings again.')] },
    ] },
  ],
  summary: { paragraphs: ['This non-public fixture exercises the content infrastructure without adding curriculum.'], items: ['Stable IDs come from the data.', 'Shared topic, command, and checklist definitions are reused.', 'Core content and disclosures work without JavaScript.'] },
};
export const fixtureCatalog: Catalog = {
  parts: [{ id: 'fixture-part', subjectId: 'ccna', title: 'Synthetic test context — not published' }],
  chapters: [fixtureChapter],
  keyTopics: [{ id: 'fixture-key-topic', title: 'An explicitly authored review label', summary: 'This condensed review text is supplied by the author, never scraped from the DOM.', paragraphs: ['The topic and its review share one source record. This paragraph exists only to verify emphasis and readable spacing.'] }],
  commands: [
    { id: 'fixture-inspect', prompt: 'fixture>', text: 'qa-tool inspect --label "alpha"', copyable: true, highlight: true },
    { id: 'fixture-long-command', prompt: 'fixture>', text: `qa-tool compare --fixture-only --arbitrary-token "${'generic-test-token-'.repeat(12)}"`, copyable: true },
    { id: 'fixture-not-copyable', prompt: 'fixture>', text: 'qa-tool display --no-copy', copyable: false },
  ],
  checklists: [{ id: 'fixture-checklist', title: 'A shared synthetic procedure', category: 'Test-only', purpose: 'Inspect a multi-step reference without adding progress controls.', steps: [{ id: 'read', instruction: 'Read this deliberately longer instruction. It should wrap naturally while preserving its place in the ordered procedure.', commandIds: ['fixture-inspect'], verification: 'The generic label is visible.' }, { id: 'compare', instruction: 'Compare the arbitrary values without modifying a real environment.', verification: 'The values remain distinct.' }], verification: ['The fixture is still marked non-published.'], commonMistakes: ['Treating a QA string as an approved lesson.'], relatedChapterIds: ['fixture-reading'] }],
};
validateCatalog(fixtureCatalog);
