import assert from 'node:assert/strict';
import test from 'node:test';
import type { Catalog, Chapter, Block } from '../src/learning/model.ts';
import { validateCatalog } from '../src/learning/validate.ts';
import { chapterBlocks, chapterHref, chapterNavigation, keyTopicsFor } from '../src/learning/resolve.ts';

// Small neutral data used exclusively for model invariants, never production records.
const makeCatalog = (): Catalog => ({
  parts: [{ id: 'test-part', subjectId: 'ccna', title: 'Synthetic Part' }],
  chapters: [{ id: 'test-chapter', slug: 'test-chapter', subjectId: 'ccna', partId: 'test-part', title: 'Synthetic record', publication: 'draft', objectives: [{ id: 'test-objective', text: 'Neutral test objective' }], sections: [{ id: 'test-section', title: 'Synthetic section', blocks: [{ kind: 'key-topic', topicId: 'test-topic' }] }], summary: { paragraphs: ['Synthetic summary'] } }],
  keyTopics: [{ id: 'test-topic', title: 'Synthetic topic', summary: 'Explicit author summary', paragraphs: ['Neutral topic text'] }],
  commands: [{ id: 'test-command', text: 'generic-test-command', prompt: 'test>', copyable: true }],
  checklists: [{ id: 'test-checklist', title: 'Synthetic procedure', category: 'Test', steps: [{ id: 'test-step', instruction: 'Neutral step', commandIds: ['test-command'] }] }],
});
const withBlocks = (blocks: readonly Block[]): Catalog => {
  const catalog = makeCatalog();
  return { ...catalog, chapters: [{ ...catalog.chapters[0], sections: [{ id: 'test-section', title: 'Synthetic section', blocks }] }] };
};
test('empty production catalog is valid', () => validateCatalog({ parts: [], chapters: [], keyTopics: [], commands: [], checklists: [] }));
test('linked neutral model is valid', () => validateCatalog(makeCatalog()));
test('review resolves the exact record and explicit summary', () => {
  const catalog = makeCatalog(); const topics = keyTopicsFor(catalog.chapters[0], catalog);
  assert.equal(topics[0], catalog.keyTopics[0]); assert.equal(topics[0].summary, 'Explicit author summary');
});
test('stable IDs reject unsafe anchor syntax', () => {
  const catalog = makeCatalog(); assert.throws(() => validateCatalog({ ...catalog, commands: [{ id: 'Not a slug', text: 'test' }] }), /Invalid stable ID/);
});
test('duplicate source records fail', () => {
  const catalog = makeCatalog(); assert.throws(() => validateCatalog({ ...catalog, keyTopics: [...catalog.keyTopics, catalog.keyTopics[0]] }), /Duplicate/);
});
test('missing Part is rejected', () => assert.throws(() => validateCatalog({ ...makeCatalog(), parts: [] }), /Missing content record/));
test('cross-subject Part is rejected', () => assert.throws(() => validateCatalog({ ...makeCatalog(), parts: [{ id: 'test-part', subjectId: 'linux-system', title: 'Synthetic Part' }] }), /subjects differ/));
test('missing Key Topic is rejected', () => assert.throws(() => validateCatalog({ ...makeCatalog(), keyTopics: [] }), /Missing content record/));
test('duplicate render anchors are rejected', () => assert.throws(() => validateCatalog(withBlocks([{ kind: 'key-topic', topicId: 'test-topic' }, { kind: 'key-topic', topicId: 'test-topic' }])), /Duplicate Chapter anchor/));
test('objectives cannot collide with generated section anchors', () => {
  const catalog = makeCatalog(); const chapter = { ...catalog.chapters[0], objectives: [{ id: 'chapter-summary', text: 'Synthetic' }] };
  assert.throws(() => validateCatalog({ ...catalog, chapters: [chapter] }), /Duplicate Chapter anchor/);
});
test('missing command in a shared checklist is rejected', () => assert.throws(() => validateCatalog({ ...makeCatalog(), commands: [] }), /Missing content record/));
test('CLI rejects dangling command references', () => assert.throws(() => validateCatalog(withBlocks([{ kind: 'cli', id: 'test-cli', caption: 'Synthetic', lines: [{ kind: 'command', commandId: 'absent' }] }])), /Missing content record/));
test('table cell shape is checked', () => assert.throws(() => validateCatalog(withBlocks([{ kind: 'table', id: 'test-table', caption: 'Synthetic', mode: 'cards', columns: [{ id: 'name', label: 'Name' }], rows: [{ id: 'row', cells: ['One', 'Extra'] }] }])), /cell count/));
test('diagram dangling endpoints are rejected', () => assert.throws(() => validateCatalog(withBlocks([{ kind: 'diagram', id: 'test-diagram', caption: 'Synthetic', description: 'Neutral description', width: 200, height: 100, nodes: [{ id: 'a', label: 'A', kind: 'client', x: 80, y: 50 }], links: [{ from: 'a', to: 'absent' }] }])), /Missing content record/));
test('nested exercise CLI is validated', () => assert.throws(() => validateCatalog(withBlocks([{ kind: 'walkthrough', id: 'test-walkthrough', title: 'Synthetic', steps: [{ id: 'step', title: 'Synthetic step', content: [{ kind: 'cli', id: 'nested-cli', caption: 'Synthetic', lines: [{ kind: 'command', commandId: 'absent' }] }] }] }])), /Missing content record/));
test('content traversal includes hidden solutions and diagnosis content', () => {
  const catalog = withBlocks([{ kind: 'challenge-lab', id: 'test-challenge', title: 'Synthetic', goal: 'Neutral', startingState: [{ kind: 'prose', paragraphs: ['Start'] }], requirements: ['Synthetic requirement'], expectedEndState: 'Neutral result', solution: [{ kind: 'cli', id: 'solution-cli', caption: 'Synthetic', lines: [{ kind: 'command', commandId: 'test-command' }] }] }]);
  validateCatalog(catalog); assert(chapterBlocks(catalog.chapters[0]).some(block => block.kind === 'cli' && block.id === 'solution-cli'));
});
test('unavailable navigation is omitted and draft neighbors are not exposed', () => {
  const catalog = makeCatalog(); const draft = { ...catalog.chapters[0], id: 'other-chapter', slug: 'other-chapter' };
  const chapter: Chapter = { ...catalog.chapters[0], nextId: draft.id };
  assert.deepEqual(chapterNavigation(chapter, { ...catalog, chapters: [chapter, draft] }), { previous: undefined, next: undefined });
  const next = { ...draft, publication: 'published' as const }; assert.equal(chapterNavigation(chapter, { ...catalog, chapters: [chapter, next] }).next, next);
});
test('navigation rejects self and unknown relations', () => {
  const catalog = makeCatalog();
  assert.throws(() => validateCatalog({ ...catalog, chapters: [{ ...catalog.chapters[0], nextId: 'test-chapter' }] }), /navigation relationship/);
  assert.throws(() => validateCatalog({ ...catalog, chapters: [{ ...catalog.chapters[0], nextId: 'absent' }] }), /Missing content record/);
});
test('route helper respects root and a configured base', () => {
  const chapter = makeCatalog().chapters[0];
  assert.equal(chapterHref(chapter), '/subjects/ccna/chapters/test-chapter/');
  assert.equal(chapterHref(chapter, '/configured-base/'), '/configured-base/subjects/ccna/chapters/test-chapter/');
});

test('duplicate Chapter slugs within a subject cannot overwrite a route', () => {
  const catalog = makeCatalog();
  assert.throws(() => validateCatalog({ ...catalog, chapters: [...catalog.chapters, { ...catalog.chapters[0], id: 'other-chapter' }] }), /Duplicate Chapter route/);
});

test('caption IDs cannot collide with author objective IDs', () => {
  const catalog = withBlocks([{ kind: 'cli', id: 'test-cli', caption: 'Neutral', lines: [{ kind: 'command', commandId: 'test-command' }] }]);
  const chapter = { ...catalog.chapters[0], objectives: [{ id: 'test-cli-caption', text: 'Neutral' }] };
  assert.throws(() => validateCatalog({ ...catalog, chapters: [chapter] }), /Duplicate Chapter anchor/);
});
test('a command definition may recur in a CLI sequence without duplicate anchors', () => {
  validateCatalog(withBlocks([{ kind: 'cli', id: 'test-cli', caption: 'Neutral', lines: [{ kind: 'command', commandId: 'test-command' }, { kind: 'output', text: 'Before' }, { kind: 'command', commandId: 'test-command' }, { kind: 'output', text: 'After' }] }]));
});


test('standalone checklist IDs cannot collide with the skip-link main target', () => {
  const catalog = makeCatalog();
  assert.throws(() => validateCatalog({ ...catalog, checklists: [{ ...catalog.checklists[0], id: 'main-content' }] }), /reserved layout anchor/);
});
