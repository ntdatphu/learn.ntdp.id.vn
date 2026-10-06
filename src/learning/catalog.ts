import type { Catalog } from './model';
import { validateCatalog } from './validate';
import { portChapter, portChecklist, portCommands, portTopics } from '../content/ccna/ethernet-port-operations';

/** One content-review candidate on the pilot branch; publication requires its Draft PR review. */
export const catalog: Catalog = {
  parts: [{ id: 'ccna-ethernet-operations', subjectId: 'ccna', title: 'Ethernet operations' }],
  chapters: [portChapter], keyTopics: portTopics, commands: portCommands, checklists: [portChecklist],
  checklistCategories: [{ id: 'ethernet-ports', label: 'Ethernet ports', order: 1 }],
};
validateCatalog(catalog);
