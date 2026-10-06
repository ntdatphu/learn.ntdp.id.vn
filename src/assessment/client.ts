import type { Answers, AssessmentConfig, Attempt, Mode, Question } from './model';
import { improvementPoints, isCorrect, scoreQuestions, selectQuestions } from './core';
import { ProgressStore, type ProgressStorage } from './progress';
const initialized = new WeakSet<HTMLElement>();
const query = <T extends HTMLElement = HTMLElement>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector); if (!element) throw new Error('Missing assessment element'); return element;
};
function textElement(tag: string, text: string) { const element = document.createElement(tag); element.textContent = text; return element; }
function scoreText(score?: { correct: number; total: number; percentage: number }) { return score ? `${score.correct} / ${score.total} · ${score.percentage}%` : 'Not completed'; }
function browserStorage(): ProgressStorage | undefined { try { return window.localStorage; } catch { return undefined; } }
class CheckView {
  mode: Mode;
  selected: Question[] = [];
  submitted = false;
  constructor(readonly element: HTMLElement, readonly controller: ChapterController) {
    this.mode = element.dataset.mode as Mode;
    query(element, '[data-check-unavailable]').hidden = true;
    query(element, '[data-check-enhanced]').hidden = false;
    query(element, '[data-check-start]').addEventListener('click', () => this.start());
    query(element, '[data-check-retry]').addEventListener('click', () => this.start());
    query<HTMLFormElement>(element, '[data-check-form]').addEventListener('submit', event => { event.preventDefault(); this.submit(); });
    element.addEventListener('change', event => {
      const input = event.target;
      if (input instanceof HTMLInputElement) {
        const fieldset = input.closest('fieldset')!;
        query(fieldset, '[data-question-error]').hidden = true;
        fieldset.querySelectorAll('input').forEach(e => e.removeAttribute('aria-invalid'));
        query(element, '[data-check-error]').textContent = '';
      }
    });
    const saved = this.mode === 'before' ? controller.store.data.pre.latest : controller.store.data.post.latest;
    if (saved) this.showAttempt(saved); else this.reset();
  }
  fields() { return this.element.querySelectorAll<HTMLFieldSetElement>('fieldset[data-question-id]'); }
  field(id: string) { return [...this.fields()].find(field => field.dataset.questionId === id)!; }
  reset() {
    this.selected = []; this.submitted = false;
    query(this.element, '[data-check-start]').hidden = false;
    query(this.element, '[data-check-form]').hidden = true;
    query(this.element, '[data-check-results]').hidden = true;
    query(this.element, '[data-check-announcement]').textContent = '';
    query(this.element, '[data-check-error]').textContent = '';
    this.clearFields();
  }
  clearFields() {
    for (const field of this.fields()) {
      field.hidden = true; field.disabled = true;
      field.querySelectorAll<HTMLInputElement>('input').forEach(input => { input.checked = false; input.disabled = false; input.removeAttribute('aria-invalid'); });
      query(field, '[data-question-error]').hidden = true;
      field.querySelectorAll<HTMLElement>('[data-question-feedback], [data-distractor-id]').forEach(e => e.hidden = true);
    }
  }
  showQuestions(questions: Question[]) {
    this.clearFields(); this.selected = questions;
    const list = query(this.element, '[data-check-questions]');
    questions.forEach((question, index) => {
      const field = this.field(question.id); field.hidden = false; field.disabled = false;
      query(field, '[data-question-number]').textContent = `${index + 1}.`;
      list.append(field);
    });
  }
  start() {
    const data = this.controller.store.data;
    const recent = this.mode === 'before' ? data.pre.recentQuestionIds : data.post.attempts.flatMap(a => a.questionIds);
    this.showQuestions(selectQuestions(this.controller.config.bank, this.controller.config.objectives, this.mode, {
      recentIds: recent, avoidIds: this.mode === 'after' ? data.pre.latest?.questionIds : [],
    }));
    this.submitted = false;
    query(this.element, '[data-check-start]').hidden = true;
    query(this.element, '[data-check-form]').hidden = false;
    query(this.element, '[data-check-results]').hidden = true;
    query(this.element, '[data-check-error]').textContent = '';
    query(this.element, '[data-check-announcement]').textContent = '';
    const submit = query<HTMLButtonElement>(this.element, '[data-check-submit]'); submit.disabled = false; submit.textContent = 'Submit answers';
    this.controller.store.touch(new Date().toISOString()); this.controller.refresh();
    // Focus changes only on the learner's deliberate Start/Try again action.
    this.field(this.selected[0].id).querySelector('input')?.focus({ preventScroll: true });
    this.element.scrollIntoView({ block: 'start' });
  }
  submit() {
    if (this.submitted) return;
    const answers: Answers = Object.create(null); let missing = 0;
    for (const q of this.selected) {
      const field = this.field(q.id);
      const selected = [...field.querySelectorAll<HTMLInputElement>('input:checked')].map(input => input.value);
      answers[q.id] = selected;
      query(field, '[data-question-error]').hidden = selected.length > 0;
      if (!selected.length) { missing++; field.querySelectorAll('input').forEach(input => input.setAttribute('aria-invalid', 'true')); }
    }
    if (missing) { query(this.element, '[data-check-error]').textContent = `Answer ${missing} incomplete ${missing === 1 ? 'question' : 'questions'} before submitting.`; return; }
    const result = scoreQuestions(this.selected, answers, this.controller.config.objectives);
    const baseline = this.controller.store.data.pre.latest;
    const attempt: Attempt = { ...result, id: crypto.randomUUID(), questionIds: this.selected.map(q => q.id), answers, completedAt: new Date().toISOString(), ...(this.mode === 'after' && baseline ? { preAttemptId: baseline.id } : {}) };
    this.controller.store.complete(this.mode, attempt); this.showAttempt(attempt); this.controller.refresh();
    query(this.element, '[data-check-announcement]').textContent = `Results: ${attempt.correct} out of ${attempt.total}, ${attempt.percentage} percent. Objective results are available below.`;
  }
  showAttempt(attempt: Attempt) {
    this.submitted = true;
    query(this.element, '[data-check-start]').hidden = true;
    query(this.element, '[data-check-results]').hidden = false;
    query(this.element, '[data-check-error]').textContent = '';
    query(this.element, '[data-check-score]').textContent = scoreText(attempt);
    const results = query(this.element, '[data-check-objectives]'); results.replaceChildren();
    for (const objective of this.controller.config.objectives) {
      const score = attempt.objectives.find(o => o.objectiveId === objective.id)!;
      const row = document.createElement('div'); row.append(textElement('dt', objective.text), textElement('dd', score.total ? `${score.correct} / ${score.total}` : 'Not assessed')); results.append(row);
    }
    if (this.mode === 'before') {
      query(this.element, '[data-check-form]').hidden = true;
      const list = query(this.element, '[data-attention-list]'); list.replaceChildren();
      const attention = attempt.objectives.filter(o => !o.total || o.correct < o.total);
      for (const score of attention) list.append(textElement('li', this.controller.config.objectives.find(o => o.id === score.objectiveId)!.text));
      if (!attention.length) list.append(textElement('li', 'All assessed objectives were answered correctly.'));
    } else {
      const questions = attempt.questionIds.map(id => this.controller.config.bank.questions.find(q => q.id === id)!);
      this.showQuestions(questions); query(this.element, '[data-check-form]').hidden = false;
      for (const q of questions) {
        const field = this.field(q.id); const correct = isCorrect(q, attempt.answers[q.id]);
        field.querySelectorAll<HTMLInputElement>('input').forEach(input => { input.checked = attempt.answers[q.id].includes(input.value); input.disabled = true; });
        query(field, '[data-question-feedback]').hidden = false;
        const verdict = query(field, '[data-question-verdict]'); verdict.textContent = correct ? 'Correct' : 'Incorrect'; verdict.dataset.correct = String(correct);
        const notes = [...field.querySelectorAll<HTMLElement>('[data-distractor-id]')];
        notes.forEach(note => note.hidden = !attempt.answers[q.id].includes(note.dataset.distractorId!));
        const noteList = field.querySelector<HTMLElement>('[data-distractor-list]'); if (noteList) noteList.hidden = !notes.some(note => !note.hidden);
      }
      const submit = query<HTMLButtonElement>(this.element, '[data-check-submit]'); submit.disabled = true; submit.textContent = 'Submitted';
    }
  }
}
class ChapterController {
  store: ProgressStore;
  views: CheckView[] = [];
  progressElements: HTMLElement[] = [];
  constructor(readonly config: AssessmentConfig) { this.store = new ProgressStore(config, browserStorage()); }
  refresh() {
    for (const view of this.views) query(view.element, '[data-check-storage-notice]').textContent = this.store.notice;
    for (const root of this.progressElements) {
      query(root, '[data-progress-enhanced]').hidden = false;
      query(root, '[data-progress-notice]').textContent = this.store.notice;
      const scores = query(root, '[data-progress-scores]'); scores.replaceChildren();
      for (const [label, value] of [['Before studying (latest)', this.store.data.pre.latest], ['After studying (latest)', this.store.data.post.latest], ['Best After result', this.store.data.post.best]] as const) {
        const group = document.createElement('div'); group.append(textElement('dt', label), textElement('dd', scoreText(value))); scores.append(group);
      }
      const pre = this.store.data.pre.latest, post = this.store.data.post.latest;
      const improvement = query(root, '[data-progress-improvement]');
      if (pre && post && post.preAttemptId === pre.id) { const delta = improvementPoints(pre, post); improvement.textContent = `Improvement: ${delta > 0 ? '+' : ''}${delta} percentage ${Math.abs(delta) === 1 ? 'point' : 'points'}.`; }
      else improvement.textContent = 'Complete Before and After checks in the same study cycle to compare results.';
      query(root, '[data-progress-first]').textContent = this.store.data.pre.first ? `First Before result: ${scoreText(this.store.data.pre.first)}` : 'No completed Before check yet.';
    }
  }
  attachProgress(root: HTMLElement) {
    this.progressElements.push(root);
    const details = query<HTMLDetailsElement>(root, '[data-progress-reset]');
    query(root, '[data-progress-cancel]').addEventListener('click', () => { details.open = false; details.querySelector('summary')?.focus(); });
    query(root, '[data-progress-confirm]').addEventListener('click', () => {
      if (this.store.reset()) { this.views.forEach(view => view.reset()); details.open = false; details.querySelector('summary')?.focus(); }
      this.refresh();
    });
  }
}
const controllers = new Map<string, ChapterController>();
export function initializeLearningChecks() {
  document.querySelectorAll<HTMLElement>('[data-knowledge-check]').forEach(element => {
    if (initialized.has(element)) return;
    try {
      const config = JSON.parse(query(element, '[data-assessment-config]').textContent!) as AssessmentConfig;
      const controller = controllers.get(config.chapterId) ?? new ChapterController(config); controllers.set(config.chapterId, controller);
      const view = new CheckView(element, controller); controller.views.push(view); initialized.add(element);
    } catch {
      const message = query(element, '[data-check-unavailable]'); message.hidden = false;
      message.textContent = 'Knowledge checks are unavailable. You can still read the chapter.';
      query(element, '[data-check-enhanced]').hidden = true;
    }
  });
  document.querySelectorAll<HTMLElement>('[data-chapter-progress]').forEach(root => {
    if (initialized.has(root)) return;
    const controller = controllers.get(root.dataset.chapterProgress!); if (!controller) return;
    controller.attachProgress(root); initialized.add(root);
  });
  controllers.forEach(controller => controller.refresh());
}
