import type { Block, Catalog, Chapter, ReadingBlock } from './model.ts';

export function requireRecord<T extends { id: string }>(records: readonly T[], id: string): T {
  const record = records.find(item => item.id === id);
  if (!record) throw new Error(`Missing content record: ${id}`);
  return record;
}

/** Ordered blocks, including composed exercise content, without reading the DOM. */
export function* walkBlocks(blocks: readonly Block[]): Generator<Block> {
  for (const block of blocks) {
    yield block;
    const groups: readonly (readonly ReadingBlock[])[] =
      block.kind === 'walkthrough' ? block.steps.map(step => step.content) :
      block.kind === 'guided-lab' ? [block.startingState, ...block.steps.flatMap(step => [step.action, step.verify])] :
      block.kind === 'challenge-lab' ? [block.startingState, block.solution] :
      block.kind === 'troubleshooting' ? [block.evidence, block.explanation, block.correctiveAction, block.verification] : [];
    for (const group of groups) yield* walkBlocks(group);
  }
}
export const chapterBlocks = (chapter: Chapter) => [...walkBlocks(chapter.sections.flatMap(section => section.blocks))];
export function keyTopicsFor(chapter: Chapter, catalog: Catalog) {
  return chapterBlocks(chapter).filter(block => block.kind === 'key-topic').map(block => requireRecord(catalog.keyTopics, block.topicId));
}
export function chapterHref(chapter: Chapter, base = '/') {
  return `${base.replace(/\/$/, '')}/subjects/${chapter.subjectId}/chapters/${chapter.slug}/`;
}
export function chapterNavigation(chapter: Chapter, catalog: Catalog) {
  const available = (id?: string) => catalog.chapters.find(item => item.id === id && item.publication === 'published' && item.subjectId === chapter.subjectId);
  return { previous: available(chapter.previousId), next: available(chapter.nextId) };
}
