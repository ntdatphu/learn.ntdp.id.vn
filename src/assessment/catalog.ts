import type { QuestionBank } from './model';
import { portQuestionBank } from '../content/ccna/ethernet-port-questions';
/** Independently authored pilot bank; public release is gated by its Draft PR review. */
export const questionBanks: readonly QuestionBank[] = [portQuestionBank];
