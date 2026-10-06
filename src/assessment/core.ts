import type { Answers, Mode, Question, QuestionBank, Score } from './model.ts';
import type { Objective } from '../learning/model.ts';
function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
/** Round-robin across objective pools, redistributing exhausted pools. */
export function selectQuestions(bank: QuestionBank, objectives: readonly Objective[], mode: Mode, options: {
  avoidIds?: readonly string[]; recentIds?: readonly string[]; random?: () => number;
} = {}): Question[] {
  const random = options.random ?? Math.random;
  const avoid = new Set(options.avoidIds);
  const recent = options.recentIds ?? [];
  const pools = shuffled(objectives, random).map(objective => {
    const eligible = bank.questions.filter(q => q.objectiveId === objective.id && q.eligibility.includes(mode));
    // First avoid the corresponding Pre, then prefer unused/least-recently-used IDs.
    return shuffled(eligible, random).sort((a, b) =>
      Number(avoid.has(a.id)) - Number(avoid.has(b.id)) ||
      recent.lastIndexOf(a.id) - recent.lastIndexOf(b.id));
  });
  const count = mode === 'before' ? bank.beforeCount : bank.afterCount;
  const selected: Question[] = [];
  while (selected.length < count && pools.some(pool => pool.length)) {
    for (const pool of pools) {
      if (selected.length >= count) break;
      const question = pool.shift(); if (question) selected.push(question);
    }
  }
  return selected;
}
export function isCorrect(question: Question, selected: readonly string[] = []): boolean {
  const answer = [...new Set(selected)].sort();
  const correct = [...question.correctChoiceIds].sort();
  return answer.length === correct.length && answer.every((id, index) => id === correct[index]);
}
export function scoreQuestions(questions: readonly Question[], answers: Answers, objectives: readonly Objective[]): Score {
  const results = objectives.map(objective => {
    const items = questions.filter(q => q.objectiveId === objective.id);
    return { objectiveId: objective.id, correct: items.filter(q => isCorrect(q, Object.hasOwn(answers, q.id) ? answers[q.id] : [])).length, total: items.length };
  });
  const correct = results.reduce((sum, result) => sum + result.correct, 0);
  return { correct, total: questions.length, percentage: questions.length ? Math.round(correct / questions.length * 100) : 0, objectives: results };
}
export const improvementPoints = (before: Score, after: Score) => after.percentage - before.percentage;
