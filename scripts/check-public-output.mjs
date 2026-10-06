import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = new URL('../dist/', import.meta.url);
const files = [];
async function walk(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) await walk(new URL(entry.name + '/', directory), path + '/');
    else files.push(path);
  }
}
await walk(output);
assert.deepEqual(files.filter(path => path.endsWith('.html')).sort(), ['index.html', 'subjects/ccna/checklists/index.html', 'subjects/ccna/index.html', 'subjects/linux-system/index.html']);
for (const path of files) {
  assert(!/fixture|\.pdf$|chapters\/|quiz\//i.test(path), `Unexpected public file: ${path}`);
  if (/\.(html|css|js)$/.test(path)) {
    const text = await readFile(new URL(path, output), 'utf8');
    assert(!/SYNTHETIC[^<]*FIXTURE|fixture-reading|qa-tool|data-cli-copy|data-knowledge-check/.test(text), `Test/learning fixture leaked: ${path}`);
    assert(!/https?:\/\//.test(text.replace(/https:\/\/ntdp\.id\.vn\//g, '').replace(/http:\/\/www\.w3\.org\/2000\/svg/g, '')), `Unexpected external runtime URL: ${path}`);
    assert(!/@font-face/.test(text), 'External/downloaded font detected');
  }
}
for (const subject of ['ccna', 'linux-system']) {
  const html = await readFile(new URL(`subjects/${subject}/index.html`, output), 'utf8');
  assert(html.includes('Content coming soon.') && html.includes('Chapters and materials will appear here when they are ready.'));
  assert(!html.includes('/learn.ntdp.id.vn/'), 'Old project base returned');
}
const library = await readFile(new URL('subjects/ccna/checklists/index.html', output), 'utf8');
assert(library.includes('Config checklists') && library.includes('Quick references will appear here as CCNA chapters are published.'));
assert(!library.includes('class="checklist-index"'), 'Fake checklist entries detected');
const ccna = await readFile(new URL('subjects/ccna/index.html', output), 'utf8');
const linux = await readFile(new URL('subjects/linux-system/index.html', output), 'utf8');
assert(ccna.includes('href="/subjects/ccna/checklists/"') && !linux.includes('/checklists/'), 'Subject checklist discoverability mismatch');
console.log('Public output: only Home, two empty Subject pages and the empty CCNA Checklist Library; no fixtures, curriculum, PDF, detail routes, or external runtime resources.');
