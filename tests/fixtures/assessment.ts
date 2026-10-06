/** SYNTHETIC ASSESSMENT TEST DATA ONLY — no curriculum or commercial source. */
import type { Question, QuestionBank, QuestionType } from '../../src/assessment/model.ts';
import { fixtureChapter } from './chapter.ts';
const types: QuestionType[] = ['single-choice', 'multiple-choice', 'true-false', 'classification', 'cli-interpretation', 'configuration-selection', 'troubleshooting', 'topology-reasoning'];
export const assessmentFixtureBank: QuestionBank = {
  chapterId: fixtureChapter.id, version: 1, beforeCount: 9, afterCount: 12,
  questions: Array.from({ length: 36 }, (_, index): Question => {
    const type = types[index % types.length];
    const base: Question = {
      id: `fixture-question-${index + 1}`, chapterId: fixtureChapter.id,
      objectiveId: fixtureChapter.objectives[index % 3].id, eligibility: ['before', 'after'], type,
      prompt: `Synthetic record ${index + 1}: which value matches the test-only label alpha?`,
      choices: [{ id: 'alpha', label: 'The arbitrary label alpha, kept separate from other test-only labels.' }, { id: 'beta', label: 'The arbitrary label beta, which is a different value.' }, { id: 'gamma', label: 'The arbitrary label gamma, which is another distinct value.' }],
      correctChoiceIds: ['alpha'], explanation: 'This neutral test record explicitly names alpha. The other labels are distinct strings. This explanation exists only to exercise assessment feedback, not to teach curriculum.',
      distractorExplanations: [{ choiceId: 'beta', text: 'Beta is a different synthetic string from the label named in this record.' }],
      reviewAnchor: 'fixture-explanation',
    };
    if (type === 'multiple-choice') return { ...base, prompt: `Synthetic set ${index + 1}: select both labels explicitly listed here: alpha and beta.`, correctChoiceIds: ['alpha', 'beta'], explanation: 'Both alpha and beta are explicitly listed. Gamma is not listed. Exact-set scoring requires both listed labels and no extra label.', distractorExplanations: [{ choiceId: 'gamma', text: 'Gamma is not listed in this test-only set.' }] };
    if (type === 'true-false') return { ...base, prompt: `Synthetic statement ${index + 1}: alpha and beta are the same string.`, choices: [{ id: 'true', label: 'True' }, { id: 'false', label: 'False' }], correctChoiceIds: ['false'], explanation: 'The two arbitrary strings are different. This is a generic test of the true/false scoring path.', distractorExplanations: undefined };
    if (type === 'classification') return { ...base, prompt: `Synthetic classification ${index + 1}: assign the row labeled “Reference” to its category.`, choices: [{ id: 'reference', label: 'Reference' }, { id: 'result', label: 'Result' }, { id: 'annotation', label: 'Annotation' }], correctChoiceIds: ['reference'], explanation: 'The table supplies the category Reference explicitly. Classification assigns one item to a category using a native single-answer control.', distractorExplanations: undefined, context: [{ kind: 'table', id: 'fixture-question-table', caption: 'Synthetic categories — not learning material', mode: 'cards', columns: [{ id: 'label', label: 'Arbitrary label' }, { id: 'category', label: 'Test category' }], rows: [{ id: 'entry', cells: ['Alpha', 'Reference'] }] }] };
    if (type === 'cli-interpretation') return { ...base, prompt: `Synthetic output ${index + 1}: which label appears in the output?`, context: [{ kind: 'cli', id: 'fixture-question-cli', caption: 'Synthetic output for UI testing', lines: [{ kind: 'output', text: 'test-only-label: alpha' }] }] };
    if (type === 'configuration-selection') return { ...base, prompt: `Synthetic configuration ${index + 1}: choose the setting that keeps the fixture label alpha.`, context: [{ kind: 'prose', paragraphs: ['The invented fixture requires label = alpha. No real system or configuration syntax is being taught.'] }] };
    if (type === 'troubleshooting') return { ...base, prompt: `Synthetic mismatch ${index + 1}: the test record displays beta. Which expected label is missing?`, context: [{ kind: 'prose', paragraphs: ['Expected arbitrary value: alpha. Observed arbitrary value: beta.'] }] };
    if (type === 'topology-reasoning') return { ...base, prompt: `Synthetic geometry ${index + 1}: which pair has a dashed connection?`, choices: [{ id: 'ab', label: 'Shape A and shape B' }, { id: 'bc', label: 'Shape B and shape C' }, { id: 'ac', label: 'Shape A and shape C' }], correctChoiceIds: ['bc'], explanation: 'Only the connection from shape B to shape C is dashed. The arbitrary geometry has no network curriculum meaning.', distractorExplanations: undefined, context: [{ kind: 'diagram', id: 'fixture-question-diagram', caption: 'Original arbitrary shapes for testing', description: 'Shapes A, B and C form a chain. A to B is solid; B to C is dashed.', width: 480, height: 140, nodes: [{ id: 'a', label: 'Shape A', kind: 'client', x: 80, y: 70 }, { id: 'b', label: 'Shape B', kind: 'switch', x: 240, y: 70 }, { id: 'c', label: 'Shape C', kind: 'server', x: 400, y: 70 }], links: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c', wireless: true }] }] };
    return base;
  }),
};
