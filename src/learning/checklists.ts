import type { Catalog, ConfigChecklist, SubjectId } from './model.ts';
export function checklistsForSubject(catalog: Catalog, subjectId: SubjectId) {
  const chapters = new Set(catalog.chapters.filter(chapter => chapter.subjectId === subjectId && chapter.publication === 'published').map(chapter => chapter.id));
  return catalog.checklists.filter(checklist => checklist.relatedChapterIds?.some(id => chapters.has(id)));
}
export function checklistCategoryLabel(checklist: ConfigChecklist, catalog: Catalog) {
  return catalog.checklistCategories?.find(category => category.id === checklist.category)?.label ?? checklist.category;
}
export function checklistGroups(catalog: Catalog, subjectId: SubjectId) {
  const groups = new Map<string, ConfigChecklist[]>();
  for (const checklist of checklistsForSubject(catalog, subjectId)) groups.set(checklist.category, [...(groups.get(checklist.category) ?? []), checklist]);
  const category = (id: string) => catalog.checklistCategories?.find(item => item.id === id);
  return [...groups].sort(([a], [b]) => (category(a)?.order ?? Number.MAX_SAFE_INTEGER) - (category(b)?.order ?? Number.MAX_SAFE_INTEGER) || a.localeCompare(b)).map(([id, records]) => ({
    id, label: category(id)?.label ?? id,
    checklists: records.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id)),
  }));
}
export function checklistHref(checklist: ConfigChecklist, subjectId: SubjectId, base = '/') {
  return `${base.replace(/\/$/, '')}/subjects/${subjectId}/checklists/${checklist.id}/`;
}
