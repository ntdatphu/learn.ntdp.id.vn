import type { Answers, AssessmentConfig, Attempt, Mode, Progress } from './model.ts';
import { scoreQuestions } from './core.ts';
export const STORAGE_PREFIX = 'ntdp-learning:progress:';
export interface ProgressStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export const progressKey = (chapterId: string) => STORAGE_PREFIX + chapterId;
export function emptyProgress(config: AssessmentConfig): Progress {
  return { schemaVersion: 1, bankVersion: config.bank.version, chapterId: config.chapterId, pre: { recentQuestionIds: [] }, post: { attempts: [] } };
}
const object = (value: unknown): value is Record<string, any> => !!value && typeof value === 'object' && !Array.isArray(value);
const date = (value: unknown): value is string => typeof value === 'string' && value.length <= 40 && Number.isFinite(Date.parse(value));
function readAttempt(raw: unknown, config: AssessmentConfig): Attempt {
  if (!object(raw) || typeof raw.id !== 'string' || !raw.id.length || raw.id.length > 100 || !date(raw.completedAt)) throw new Error('Invalid attempt');
  const ids = raw.questionIds;
  if (!Array.isArray(ids) || !ids.length || ids.length > config.bank.questions.length || new Set(ids).size !== ids.length || !object(raw.answers)) throw new Error('Invalid question history');
  const questions = ids.map(id => { const q = config.bank.questions.find(q => q.id === id); if (!q) throw new Error('Unknown question'); return q; });
  const answers: Answers = Object.create(null);
  for (const q of questions) {
    const selected = raw.answers[q.id];
    if (!Array.isArray(selected) || !selected.length || selected.length > q.choices.length || new Set(selected).size !== selected.length || selected.some(id => !q.choices.some(c => c.id === id))) throw new Error('Invalid stored answer');
    if (q.type !== 'multiple-choice' && selected.length !== 1) throw new Error('Invalid stored single answer');
    answers[q.id] = selected;
  }
  const score = scoreQuestions(questions, answers, config.objectives);
  if (raw.correct !== score.correct || raw.total !== score.total || raw.percentage !== score.percentage || JSON.stringify(raw.objectives) !== JSON.stringify(score.objectives)) throw new Error('Invalid stored score');
  if (raw.preAttemptId !== undefined && (typeof raw.preAttemptId !== 'string' || raw.preAttemptId.length > 100)) throw new Error('Invalid baseline reference');
  return { ...score, id: raw.id, questionIds: ids, answers, completedAt: raw.completedAt, ...(raw.preAttemptId ? { preAttemptId: raw.preAttemptId } : {}) };
}
function parseProgress(raw: unknown, config: AssessmentConfig): Progress {
  if (!object(raw) || raw.chapterId !== config.chapterId || !object(raw.pre) || !object(raw.post)) throw new Error('Invalid progress');
  const read = (value: unknown) => value === undefined ? undefined : readAttempt(value, config);
  const recent = raw.pre.recentQuestionIds;
  if (!Array.isArray(recent) || recent.length > 120 || recent.some(id => !config.bank.questions.some(q => q.id === id))) throw new Error('Invalid Pre history');
  if (!Array.isArray(raw.post.attempts) || raw.post.attempts.length > 12) throw new Error('Invalid Post history');
  const attempts = raw.post.attempts.map((a: unknown) => readAttempt(a, config));
  const first = read(raw.pre.first), latestPre = read(raw.pre.latest), latest = read(raw.post.latest), best = read(raw.post.best);
  if (!!first !== !!latestPre || !!attempts.length !== !!latest || !!latest !== !!best) throw new Error('Incomplete saved progress');
  if (latest && latest.id !== attempts.at(-1)?.id) throw new Error('Invalid latest attempt');
  if (best && attempts.some((a: Attempt) => a.correct / a.total > best.correct / best.total)) throw new Error('Invalid best result');
  if (raw.lastStudiedAt !== undefined && !date(raw.lastStudiedAt)) throw new Error('Invalid study timestamp');
  return { ...emptyProgress(config), pre: { first, latest: latestPre, recentQuestionIds: recent }, post: { attempts, latest, best }, ...(raw.lastStudiedAt ? { lastStudiedAt: raw.lastStudiedAt } : {}) };
}
/** Scoped storage boundary: corruption or denied storage never breaks reading/checks. */
export class ProgressStore {
  data: Progress;
  notice = '';
  private writable = true;
  readonly config: AssessmentConfig;
  private storage?: ProgressStorage;
  constructor(config: AssessmentConfig, storage?: ProgressStorage) {
    this.config = config; this.storage = storage;
    this.data = emptyProgress(config);
    if (!storage) { this.writable = false; this.notice = 'Browser storage is unavailable. Results last only while this page is open.'; return; }
    try {
      const text = storage.getItem(progressKey(config.chapterId)); if (!text) return;
      if (text.length > 262144) throw new Error('Oversized progress');
      const raw = JSON.parse(text);
      if (!object(raw) || !Number.isInteger(raw.schemaVersion) || raw.schemaVersion < 1) throw new Error('Invalid schema version');
      if (raw.schemaVersion !== 1) { this.writable = false; this.notice = 'Saved progress uses a different version. New results last only while this page is open. Reset this chapter’s progress to start fresh.'; return; }
      if (!Number.isInteger(raw.bankVersion) || raw.bankVersion < 1) throw new Error('Invalid bank version');
      if (raw.bankVersion !== config.bank.version) { storage.removeItem(progressKey(config.chapterId)); this.notice = 'Saved progress was reset because this chapter’s question bank changed.'; return; }
      this.data = parseProgress(raw, config);
    } catch {
      try { storage.removeItem(progressKey(config.chapterId)); this.notice = 'Saved progress could not be read and was reset for this chapter.'; }
      catch { this.writable = false; this.notice = 'Browser storage is unavailable. Results last only while this page is open.'; }
    }
  }
  private save() {
    if (!this.writable || !this.storage) return;
    try { this.storage.setItem(progressKey(this.config.chapterId), JSON.stringify(this.data)); }
    catch { this.writable = false; this.notice = 'Results could not be saved. They last only while this page is open.'; }
  }
  touch(timestamp: string) { this.data.lastStudiedAt = timestamp; this.save(); }
  complete(mode: Mode, attempt: Attempt) {
    if (mode === 'before') {
      this.data.pre.first ??= attempt;
      this.data.pre.latest = attempt;
      this.data.pre.recentQuestionIds = [...this.data.pre.recentQuestionIds, ...attempt.questionIds].slice(-120);
    } else {
      this.data.post.attempts = [...this.data.post.attempts, attempt].slice(-12);
      this.data.post.latest = attempt;
      const best = this.data.post.best;
      if (!best || attempt.correct / attempt.total >= best.correct / best.total) this.data.post.best = attempt;
    }
    this.data.lastStudiedAt = attempt.completedAt; this.save();
  }
  reset(): boolean {
    try {
      this.storage?.removeItem(progressKey(this.config.chapterId));
      this.data = emptyProgress(this.config); this.writable = !!this.storage;
      this.notice = this.storage ? 'Local progress was deleted for this chapter.' : 'Progress was reset for this page. Browser storage is unavailable.';
      return true;
    } catch { this.notice = 'Could not delete saved progress. Check your browser storage settings.'; return false; }
  }
}
