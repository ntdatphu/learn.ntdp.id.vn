import type { Catalog, Chapter } from '../learning/model.ts';
import type { QuestionBank } from './model.ts';
import { chapterBlocks } from '../learning/resolve.ts';
import { validateReadingBlock } from '../learning/validate.ts';
const kinds = ['single-choice', 'multiple-choice', 'true-false', 'classification', 'cli-interpretation', 'configuration-selection', 'troubleshooting', 'topology-reasoning'];
const stable = (id: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
function expect(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
export function validateQuestionBank(bank: QuestionBank, chapter: Chapter, catalog: Catalog) {
  expect(bank.chapterId === chapter.id, 'Question bank Chapter mismatch');
  expect(Number.isInteger(bank.version) && bank.version > 0, 'Question bank needs a positive version');
  expect(bank.questions.length > 0, 'Question bank needs authored questions');
  const objectives = new Set(chapter.objectives.map(o => o.id));
  const anchors = new Set(['learning-objectives', 'key-topics-review', 'chapter-summary', ...objectives, ...chapter.sections.map(s => s.id)]);
  for (const block of chapterBlocks(chapter)) {
    if ('id' in block) anchors.add(block.id);
    if (block.kind === 'key-topic') anchors.add(block.topicId);
    if (block.kind === 'checklist') anchors.add(block.checklistId);
  }
  const ids = new Set<string>();
  for (const q of bank.questions) {
    expect(stable(q.id) && !ids.has(q.id), 'Question IDs must be stable and unique'); ids.add(q.id);
    expect(q.chapterId === chapter.id && objectives.has(q.objectiveId), 'Question Chapter/objective reference mismatch');
    expect(kinds.includes(q.type), 'Unsupported question type');
    expect(q.eligibility.length > 0 && new Set(q.eligibility).size === q.eligibility.length && q.eligibility.every(m => m === 'before' || m === 'after'), 'Invalid assessment eligibility');
    expect(q.prompt.trim() && q.explanation.trim(), 'Question needs a prompt and authored explanation');
    const choices = new Set(q.choices.map(c => c.id));
    expect(q.choices.length >= 2 && choices.size === q.choices.length && q.choices.every(c => stable(c.id) && c.label.trim()), 'Question needs unique labeled choices');
    expect(q.correctChoiceIds.length > 0 && new Set(q.correctChoiceIds).size === q.correctChoiceIds.length && q.correctChoiceIds.every(id => choices.has(id)), 'Invalid correct-answer definition');
    expect(q.type === 'multiple-choice' || q.correctChoiceIds.length === 1, 'Single-answer types need one correct choice');
    if (q.type === 'true-false') expect(choices.size === 2 && choices.has('true') && choices.has('false'), 'True/false needs true and false choices');
    q.distractorExplanations?.forEach(d => expect(choices.has(d.choiceId) && !q.correctChoiceIds.includes(d.choiceId) && d.text.trim(), 'Invalid distractor explanation'));
    if (q.reviewAnchor) expect(anchors.has(q.reviewAnchor), 'Review anchor is absent from Chapter');
    const blockIds = new Set<string>();
    q.context?.forEach(block => {
      if ('id' in block) { expect(stable(block.id) && !blockIds.has(block.id), 'Duplicate/invalid question context ID'); blockIds.add(block.id); }
      validateReadingBlock(block, catalog);
    });
  }
  for (const mode of ['before', 'after'] as const) {
    const eligibleQuestions = bank.questions.filter(q => q.eligibility.includes(mode));
    const eligible = new Set(eligibleQuestions.map(q => q.objectiveId));
    expect([...objectives].every(id => eligible.has(id)), `Every Chapter objective needs ${mode} coverage`);
    const count = mode === 'before' ? bank.beforeCount : bank.afterCount;
    expect(Number.isInteger(count) && count >= objectives.size, 'Assessment count must cover the Chapter objectives');
    expect(count <= eligibleQuestions.length, `Assessment count exceeds the unique ${mode} question supply`);
  }
}
