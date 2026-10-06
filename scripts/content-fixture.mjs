import { mkdir, writeFile } from 'node:fs/promises';
const pages = new URL('../.qa/src/pages/', import.meta.url);
await mkdir(pages, { recursive: true });
await writeFile(new URL('index.astro', pages), `---\nimport Fixture from '../../../tests/fixtures/ChapterFixture.astro';\n---\n<Fixture />\n`);
console.log('Prepared the isolated, non-published content fixture.');

for (const route of ['assessment', 'assessment-types']) {
  const folder = new URL(route + '/', pages);
  await mkdir(folder, { recursive: true });
  await writeFile(new URL('index.astro', folder), `---\nimport Fixture from '../../../../tests/fixtures/AssessmentFixture.astro';\n---\n<Fixture allTypes={${route === 'assessment-types'}} />\n`);
}
