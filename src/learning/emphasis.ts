import type { LearningText, OutputIntent } from './model.ts';

export const emphasisIntents = ['focus', 'interface', 'value', 'evidence', 'change', 'success', 'warning', 'error'] as const;
export const outputLabels: Record<OutputIntent, string> = {
  evidence: 'Evidence', change: 'Changed', success: 'Success', warning: 'Warning', error: 'Error',
};
/** Also used to guard command display against misleading clipboard text. */
export function plainText(value: LearningText): string {
  return typeof value === 'string' ? value : value.map(segment => segment.text).join('');
}
