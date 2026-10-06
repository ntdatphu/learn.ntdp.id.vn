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
const chapterRoute = 'subjects/ccna/chapters/ethernet-port-operations/index.html';
const checklistRoute = 'subjects/ccna/checklists/verify-ethernet-port-change/index.html';
assert.deepEqual(files.filter(path => path.endsWith('.html')).sort(), ['index.html', chapterRoute, 'subjects/ccna/checklists/index.html', checklistRoute, 'subjects/ccna/index.html', 'subjects/linux-system/index.html'].sort());
for (const path of files) {
  assert(!/fixture|\.pdf$|quiz\//i.test(path), `Unexpected public file: ${path}`);
  if (/\.(html|css|js)$/.test(path)) {
    const text = await readFile(new URL(path, output), 'utf8');
    assert(!/SYNTHETIC[^<]*FIXTURE|fixture-reading|qa-tool|\/home\/|\/tmp\/|source-manifest|knowledge-specification|source_pdf_range/.test(text), `Test/private/source data leaked: ${path}`);
    assert(!/https?:\/\//.test(text.replace(/https:\/\/ntdp\.id\.vn\//g, '').replace(/http:\/\/www\.w3\.org\/2000\/svg/g, '')), `Unexpected external runtime URL: ${path}`);
    assert(!/@font-face/.test(text), 'External/downloaded font detected');
    assert(!text.includes('/learn.ntdp.id.vn/'), 'Old project base returned');
  }
}
const html = route => readFile(new URL(route, output), 'utf8');
const linux = await html('subjects/linux-system/index.html');
assert(linux.includes('Content coming soon.') && linux.includes('Chapters and materials will appear here when they are ready.') && !linux.includes('/checklists/'));
const ccna = await html('subjects/ccna/index.html');
assert(ccna.includes('href="/subjects/ccna/checklists/"') && ccna.includes('href="/subjects/ccna/chapters/ethernet-port-operations/"'));
assert(!ccna.includes('Content coming soon.'));
const chapter = await html(chapterRoute), checklist = await html(checklistRoute), library = await html('subjects/ccna/checklists/index.html');
assert(chapter.includes('Ethernet Ports: Configure, Verify, Diagnose') && chapter.includes('data-mode="before"') && chapter.includes('data-mode="after"'));
assert(chapter.includes('Progress is stored only in this browser/device. Nothing is sent to NTDP or third parties.'));
assert(!chapter.includes('chapter-navigation'), 'Invented neighboring Chapter navigation');
assert(checklist.includes('Verify an Ethernet port change') && checklist.includes('learning-steps'));
assert(library.includes('href="/subjects/ccna/checklists/verify-ethernet-port-change/"') && !library.includes('Quick references will appear here'));
console.log('Pilot output: exactly six routes, one real Chapter/checklist candidate, Linux unchanged; no fixtures, private source/PDF/assets, neighbors, or external runtime resources.');
