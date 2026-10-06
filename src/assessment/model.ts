import type { ReadingBlock, Objective } from '../learning/model.ts';
export type Mode = 'before' | 'after';
export type QuestionType = 'single-choice' | 'multiple-choice' | 'true-false' | 'classification' | 'cli-interpretation' | 'configuration-selection' | 'troubleshooting' | 'topology-reasoning';
export interface Choice { id: string; label: string }
export interface Question {
  id: string;
  chapterId: string;
  objectiveId: string;
  eligibility: readonly Mode[];
  type: QuestionType;
  prompt: string;
  choices: readonly Choice[];
  correctChoiceIds: readonly string[];
  explanation: string;
  distractorExplanations?: readonly { choiceId: string; text: string }[];
  reviewAnchor?: string;
  context?: readonly ReadingBlock[];
}
export interface QuestionBank {
  chapterId: string;
  version: number;
  beforeCount: number;
  afterCount: number;
  questions: readonly Question[];
}
export type Answers = Record<string, readonly string[]>;
export interface ObjectiveResult { objectiveId: string; correct: number; total: number }
export interface Score { correct: number; total: number; percentage: number; objectives: ObjectiveResult[] }
export interface Attempt extends Score {
  id: string;
  questionIds: string[];
  answers: Answers;
  completedAt: string;
  preAttemptId?: string;
}
export interface Progress {
  schemaVersion: 1;
  bankVersion: number;
  chapterId: string;
  pre: { first?: Attempt; latest?: Attempt; recentQuestionIds: string[] };
  post: { attempts: Attempt[]; latest?: Attempt; best?: Attempt };
  lastStudiedAt?: string;
}
/** Minimal client payload. Reading primitives and explanations are rendered by Astro. */
export interface AssessmentConfig {
  chapterId: string;
  objectives: readonly Objective[];
  bank: QuestionBank;
}
