import type { Catalog } from './model';
import { validateCatalog } from './validate';

/** No approved curriculum exists. Test records belong only in tests/fixtures. */
export const catalog: Catalog = {
  parts: [], chapters: [], keyTopics: [], commands: [], checklists: [],
  checklistCategories: [],
};
validateCatalog(catalog);
