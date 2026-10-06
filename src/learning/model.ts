/** Author-owned content only. IDs are stable slugs, never list positions. */
export type SubjectId = 'ccna' | 'linux-system';
export interface Prose {
  paragraphs: readonly string[];
  items?: readonly string[];
}
export interface Objective { id: string; text: string }
export interface Part { id: string; subjectId: SubjectId; title: string }
export interface Command {
  id: string;
  text: string;
  prompt?: string;
  copyable?: boolean;
  highlight?: boolean;
}
export type CliLine =
  | { kind: 'command'; commandId: string }
  | { kind: 'output'; text: string; verified?: boolean }
  | { kind: 'comment'; text: string };
export interface CliExample {
  kind: 'cli';
  id: string;
  caption: string;
  lines: readonly CliLine[];
}
export interface TableBlock {
  kind: 'table';
  id: string;
  caption: string;
  mode: 'cards' | 'scroll';
  columns: readonly { id: string; label: string }[];
  rows: readonly { id: string; cells: readonly string[] }[];
}
export type NodeKind = 'client' | 'server' | 'switch' | 'router' | 'cloud';
export interface DiagramNode {
  id: string;
  label: string;
  kind: NodeKind;
  x: number;
  y: number;
}
export interface DiagramBlock {
  kind: 'diagram';
  id: string;
  caption: string;
  description: string;
  width: number;
  height: number;
  nodes: readonly DiagramNode[];
  links: readonly { from: string; to: string; label?: string; wireless?: boolean }[];
}
export type ReadingBlock =
  | ({ kind: 'prose' } & Prose)
  | ({ kind: 'note'; label?: string } & Prose)
  | TableBlock | DiagramBlock | CliExample;
export interface KeyTopic extends Prose {
  id: string;
  title: string;
  summary: string;
}
export interface ChecklistStep {
  id: string;
  instruction: string;
  commandIds?: readonly string[];
  verification?: string;
}
export interface ConfigChecklist {
  id: string;
  title: string;
  category: string;
  order?: number;
  purpose?: string;
  steps: readonly ChecklistStep[];
  verification?: readonly string[];
  commonMistakes?: readonly string[];
  relatedChapterIds?: readonly string[];
}
export interface ChecklistCategory { id: string; label: string; order: number }
export interface Walkthrough {
  kind: 'walkthrough';
  id: string;
  title: string;
  intro?: string;
  steps: readonly { id: string; title: string; content: readonly ReadingBlock[] }[];
}
export interface GuidedLab {
  kind: 'guided-lab';
  id: string;
  title: string;
  goal: string;
  startingState: readonly ReadingBlock[];
  prerequisites?: readonly string[];
  steps: readonly {
    id: string;
    title: string;
    action: readonly ReadingBlock[];
    why: string;
    verify: readonly ReadingBlock[];
    expectedResult: string;
  }[];
}
export interface ChallengeLab {
  kind: 'challenge-lab';
  id: string;
  title: string;
  goal: string;
  startingState: readonly ReadingBlock[];
  requirements: readonly string[];
  expectedEndState: string;
  hints?: readonly string[];
  solution: readonly ReadingBlock[];
}
export interface Troubleshooting {
  kind: 'troubleshooting';
  id: string;
  title: string;
  scenario: string;
  symptoms: readonly string[];
  evidence: readonly ReadingBlock[];
  learnerPrompt: string;
  diagnosis: string;
  explanation: readonly ReadingBlock[];
  correctiveAction: readonly ReadingBlock[];
  verification: readonly ReadingBlock[];
}
export type Block =
  | ReadingBlock
  | { kind: 'key-topic'; topicId: string }
  | { kind: 'checklist'; checklistId: string }
  | Walkthrough | GuidedLab | ChallengeLab | Troubleshooting;
export interface Chapter {
  id: string;
  slug: string;
  subjectId: SubjectId;
  partId: string;
  title: string;
  intro?: string;
  publication: 'draft' | 'published';
  objectives: readonly Objective[];
  sections: readonly { id: string; title: string; blocks: readonly Block[] }[];
  summary: Prose;
  previousId?: string;
  nextId?: string;
}
export interface Catalog {
  parts: readonly Part[];
  chapters: readonly Chapter[];
  keyTopics: readonly KeyTopic[];
  commands: readonly Command[];
  checklists: readonly ConfigChecklist[];
  checklistCategories?: readonly ChecklistCategory[];
}
