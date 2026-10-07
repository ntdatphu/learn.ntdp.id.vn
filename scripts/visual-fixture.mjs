import { mkdir, writeFile } from 'node:fs/promises';
const pages = new URL('../.qa/visual/src/pages/', import.meta.url);
await mkdir(pages, { recursive: true });
for (const [route, component] of [['', 'Gallery'], ['learning/', 'Learning'], ['simple/', 'Simple'], ['complex/', 'Complex']]) {
  const folder = new URL(route, pages);
  await mkdir(folder, { recursive: true });
  const relative = route ? '../../../../../' : '../../../../';
  await writeFile(new URL('index.astro', folder), `---\nimport Specimen from '${relative}tests/visual/${component}.astro';\n---\n<Specimen />\n`);
}
console.log('Prepared exactly three local visual specimens and their review index.');
