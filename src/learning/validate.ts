import { emphasisIntents, outputLabels, plainText } from './emphasis.ts';
import type { Catalog, LearningText, ReadingBlock } from './model.ts';
import { chapterBlocks, requireRecord } from './resolve.ts';

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function expect(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function text(value: string, context: string) { expect(typeof value === 'string' && value.trim().length > 0, `Empty ${context}`); }
function learningText(value: LearningText, context: string, allowEmpty = false) {
  if (typeof value === 'string') { if (!allowEmpty) text(value, context); return; }
  expect(Array.isArray(value) && value.length > 0, `Invalid ${context} segments`);
  for (const segment of value) {
    expect(segment && typeof segment.text === 'string' && segment.text.length > 0, `Invalid ${context} segment`);
    expect(segment.intent === undefined || emphasisIntents.includes(segment.intent), `Unknown emphasis intent in ${context}`);
  }
  if (!allowEmpty) text(plainText(value), context);
}
function outputIntent(value: unknown) {
  expect(value === undefined || (typeof value === 'string' && Object.hasOwn(outputLabels, value)), 'Unknown output intent');
}
function id(value: string) { expect(slug.test(value), `Invalid stable ID: ${value}`); }
function unique(records: readonly { id: string }[], context: string) {
  const seen = new Set<string>();
  for (const record of records) { id(record.id); expect(!seen.has(record.id), `Duplicate ${context} ID: ${record.id}`); seen.add(record.id); }
}
export function validateReadingBlock(block: ReadingBlock, catalog: Catalog) {
  if (block.kind === 'cli') {
    text(block.caption, 'CLI caption');
    expect(block.lines.length > 0, 'CLI example needs lines');
    for (const line of block.lines) {
      if (line.kind === 'command') requireRecord(catalog.commands, line.commandId);
      else {
        learningText(line.text, 'CLI line');
        if (line.kind === 'output') {
          outputIntent(line.intent);
          expect(!line.verified || line.intent === undefined || line.intent === 'success', 'Verified output cannot conflict with its intent');
        }
      }
    }
  } else if (block.kind === 'table') {
    expect(['cards', 'scroll'].includes(block.mode), 'Choose an explicit table mode');
    text(block.caption, 'table caption'); unique(block.columns, 'table column'); unique(block.rows, 'table row');
    expect(block.columns.length > 0 && block.rows.length > 0, 'Table needs columns and rows');
    block.columns.forEach(column => text(column.label, 'column label'));
    for (const row of block.rows) {
      expect(row.cells.length === block.columns.length, `Table ${block.id} row ${row.id} has the wrong cell count`);
      outputIntent(row.intent); row.cells.forEach(cell => learningText(cell, 'table cell', true));
    }
  } else if (block.kind === 'diagram') {
    text(block.caption, 'diagram caption'); text(block.description, 'diagram description'); unique(block.nodes, 'diagram node');
    expect(block.width > 0 && block.height > 0 && Number.isFinite(block.width) && Number.isFinite(block.height), 'Invalid diagram size');
    expect(block.nodes.length > 0, 'Diagram needs nodes');
    for (const node of block.nodes) {
      text(node.label, 'node label'); expect(['client', 'server', 'switch', 'router', 'cloud'].includes(node.kind), 'Unknown diagram node kind');
      expect(Number.isFinite(node.x) && Number.isFinite(node.y) && node.x >= 40 && node.x <= block.width - 40 && node.y >= 32 && node.y <= block.height - 32, `Diagram node ${node.id} is outside safe bounds`);
    }
    for (const link of block.links) { requireRecord(block.nodes, link.from); requireRecord(block.nodes, link.to); expect(link.from !== link.to, 'Diagram self-links are not supported'); }
  } else {
    expect(block.paragraphs.length > 0 || !!block.items?.length, 'Prose needs content');
    block.paragraphs.forEach(paragraph => learningText(paragraph, 'paragraph')); block.items?.forEach(item => learningText(item, 'list item'));
  }
}
/** Build-time safeguards complement the author-facing TypeScript discriminated unions. */
export function validateCatalog(catalog: Catalog) {
  for (const [name, records] of Object.entries(catalog)) if (records) unique(records, name);
  for (const category of catalog.checklistCategories ?? []) { text(category.label, 'category label'); expect(Number.isFinite(category.order), 'Invalid category order'); }
  for (const part of catalog.parts) { expect(['ccna', 'linux-system'].includes(part.subjectId), 'Unknown subject'); text(part.title, 'Part title'); }
  for (const command of catalog.commands) {
    text(command.text, 'command text');
    if (command.display !== undefined) {
      learningText(command.display, 'command display');
      expect(plainText(command.display) === command.text, 'Command display must match exact command text');
    }
  }
  for (const topic of catalog.keyTopics) { text(topic.title, 'Key Topic title'); text(topic.summary, 'Key Topic review summary'); validateReadingBlock({ kind: 'prose', paragraphs: topic.paragraphs, items: topic.items }, catalog); }
  for (const checklist of catalog.checklists) {
    expect(checklist.id !== 'main-content', 'Checklist ID conflicts with reserved layout anchor');
    text(checklist.title, 'checklist title'); text(checklist.category, 'checklist category'); unique(checklist.steps, 'checklist step'); expect(checklist.steps.length > 0, 'Checklist needs steps');
    if (checklist.order !== undefined) expect(Number.isFinite(checklist.order), 'Invalid checklist order');
    for (const step of checklist.steps) { text(step.instruction, 'checklist instruction'); step.commandIds?.forEach(command => requireRecord(catalog.commands, command)); }
    checklist.relatedChapterIds?.forEach(chapter => requireRecord(catalog.chapters, chapter));
  }
  const routes = new Set<string>();
  for (const chapter of catalog.chapters) {
    const route = `${chapter.subjectId}/${chapter.slug}`;
    expect(!routes.has(route), `Duplicate Chapter route: ${route}`); routes.add(route);
    id(chapter.slug); text(chapter.title, 'Chapter title'); expect(['draft', 'published'].includes(chapter.publication), 'Invalid publication state');
    const part = requireRecord(catalog.parts, chapter.partId); expect(part.subjectId === chapter.subjectId, 'Chapter and Part subjects differ');
    unique(chapter.objectives, 'objective'); expect(chapter.objectives.length > 0, 'Chapter needs learning objectives'); chapter.objectives.forEach(objective => text(objective.text, 'objective'));
    unique(chapter.sections, 'section'); expect(chapter.sections.length > 0, 'Chapter needs sections'); chapter.sections.forEach(section => text(section.title, 'section title'));
    const anchors = new Set(['main-content', 'learning-objectives', 'key-topics-review', 'chapter-summary']);
    const anchor = (value: string) => { id(value); expect(!anchors.has(value), `Duplicate Chapter anchor: ${value}`); anchors.add(value); };
    chapter.objectives.forEach(objective => anchor(objective.id)); chapter.sections.forEach(section => anchor(section.id));
    for (const block of chapterBlocks(chapter)) {
      if ('id' in block) anchor(block.id);
      if (block.kind === 'cli' || block.kind === 'table') anchor(`${block.id}-caption`);
      if (block.kind === 'table' && block.mode === 'scroll') anchor(`${block.id}-hint`);
      if (block.kind === 'diagram') anchor(`${block.id}-title`);
      if (block.kind === 'key-topic') { const topic = requireRecord(catalog.keyTopics, block.topicId); anchor(topic.id); }
      else if (block.kind === 'checklist') {
        const checklist = requireRecord(catalog.checklists, block.checklistId); anchor(checklist.id);
        checklist.steps.forEach(step => { anchor(`${checklist.id}-${step.id}`); anchor(`${checklist.id}-${step.id}-instruction`); if (step.commandIds?.length) { anchor(`${checklist.id}-${step.id}-commands`); anchor(`${checklist.id}-${step.id}-commands-caption`); } });
      } else if (block.kind === 'prose' || block.kind === 'note' || block.kind === 'cli' || block.kind === 'table' || block.kind === 'diagram') validateReadingBlock(block, catalog);
      else {
        text(block.title, 'exercise title');
        if ('steps' in block) { unique(block.steps, 'exercise step'); expect(block.steps.length > 0, 'Exercise needs steps'); block.steps.forEach(step => { anchor(`${block.id}-${step.id}`); text(step.title, 'step title'); if ('why' in step) { text(step.why, 'step rationale'); text(step.expectedResult, 'expected result'); expect(step.action.length && step.verify.length, 'Guided steps need action and verification'); } }); }
        if ('goal' in block) { text(block.goal, 'lab goal'); expect(block.startingState.length > 0, 'Lab needs starting state'); }
        if (block.kind === 'challenge-lab') { expect(block.requirements.length && block.solution.length, 'Challenge needs requirements and a solution'); text(block.expectedEndState, 'expected end state'); }
        if (block.kind === 'troubleshooting') { text(block.scenario, 'scenario'); text(block.learnerPrompt, 'learner prompt'); text(block.diagnosis, 'diagnosis'); expect(block.symptoms.length && block.evidence.length && block.explanation.length && block.correctiveAction.length && block.verification.length, 'Troubleshooting needs complete anatomy'); }
      }
    }
    for (const relation of [chapter.previousId, chapter.nextId]) if (relation) {
      const neighbor = requireRecord(catalog.chapters, relation); expect(neighbor.id !== chapter.id && neighbor.subjectId === chapter.subjectId, 'Invalid Chapter navigation relationship');
    }
    validateReadingBlock({ kind: 'prose', ...chapter.summary }, catalog);
  }
}
