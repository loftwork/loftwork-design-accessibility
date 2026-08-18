import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const packageDir = dirname(fileURLToPath(import.meta.url));
const masterPath = process.argv[2] ?? join(packageDir, '..', 'practice-master-v1.0', 'practice-master.json');
const master = JSON.parse(await readFile(masterPath, 'utf8'));

const errors = [];
const warnings = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

function parseFrontmatter(text, file) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  check(Boolean(match), `${file}: frontmatter is required.`);
  if (!match) return { data: {}, body: text };
  const data = {};
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!pair) continue;
    data[pair[1]] = pair[2].replace(/^"|"$/g, '');
  }
  return { data, body: text.slice(match[0].length) };
}

const practiceDir = join(packageDir, 'practices');
const lensDir = join(packageDir, 'lenses');
const practiceFiles = (await readdir(practiceDir)).filter((file) => file.endsWith('.md')).sort();
const lensFiles = (await readdir(lensDir)).filter((file) => file.endsWith('.mdx')).sort();

check(practiceFiles.length === 51, `Expected 51 Practice files; found ${practiceFiles.length}.`);
check(lensFiles.length === 7, `Expected 7 Lens files; found ${lensFiles.length}.`);

const masterPracticeIds = new Set(master.practices.map(({ id }) => id));
const masterLensIds = new Set(master.lenses.map(({ id }) => id));
const editorialPracticeIds = new Set();
const editorialLensIds = new Set();
const sourceCounts = {};
const contentHashes = new Map();

for (const file of practiceFiles) {
  const path = join(practiceDir, file);
  const text = await readFile(path, 'utf8');
  const { data, body } = parseFrontmatter(text, file);
  const expectedId = basename(file, '.md').toUpperCase();

  check(data.contentType === 'practice', `${file}: contentType must be practice.`);
  check(data.practiceId === expectedId, `${file}: practiceId must be ${expectedId}.`);
  check(data.editorialVersion === '1.0', `${file}: editorialVersion must be 1.0.`);
  check(!('title' in data), `${file}: title must come from Practice Master, not Editorial Content.`);
  check(masterPracticeIds.has(data.practiceId), `${file}: practiceId is not present in Practice Master.`);
  check(!editorialPracticeIds.has(data.practiceId), `${file}: duplicate practiceId ${data.practiceId}.`);
  editorialPracticeIds.add(data.practiceId);

  for (const heading of ['Summary', 'Body', 'Consider', 'Explore']) {
    check(body.includes(`## ${heading}`), `${file}: missing ## ${heading}.`);
  }
  check(!body.includes('cite'), `${file}: contains an internal ChatGPT citation marker.`);
  check(!body.includes(':::writing'), `${file}: contains a writing-block fence.`);
  check(body.length >= 250, `${file}: editorial body is unexpectedly short.`);

  sourceCounts[data.sourceTier] = (sourceCounts[data.sourceTier] ?? 0) + 1;
  contentHashes.set(`practices/${file}`, createHash('sha256').update(text).digest('hex'));
}

for (const id of masterPracticeIds) check(editorialPracticeIds.has(id), `Missing Editorial Content for ${id}.`);

for (const file of lensFiles) {
  const path = join(lensDir, file);
  const text = await readFile(path, 'utf8');
  const { data, body } = parseFrontmatter(text, file);
  const expectedId = basename(file, '.mdx');

  check(data.contentType === 'lens', `${file}: contentType must be lens.`);
  check(data.lensId === expectedId, `${file}: lensId must be ${expectedId}.`);
  check(data.editorialVersion === '1.0', `${file}: editorialVersion must be 1.0.`);
  check(!('title' in data), `${file}: title must come from Practice Master, not Editorial Content.`);
  check(masterLensIds.has(data.lensId), `${file}: lensId is not present in Practice Master.`);
  check(!editorialLensIds.has(data.lensId), `${file}: duplicate lensId ${data.lensId}.`);
  editorialLensIds.add(data.lensId);

  for (const heading of ['Question', 'Why', 'Situations', 'Practices', 'Review', 'Explore', 'Standards']) {
    check(body.includes(`## ${heading}`), `${file}: missing ## ${heading}.`);
  }
  check(body.includes(`<!-- PRACTICE_LIST: primaryLens=${data.lensId} -->`), `${file}: missing Practice-list generation marker.`);
  check(body.includes(`<!-- WCAG_TABLE: primaryLens=${data.lensId} -->`), `${file}: missing WCAG-table generation marker.`);
  check(!body.includes('cite'), `${file}: contains an internal ChatGPT citation marker.`);
  check(!body.includes(':::writing'), `${file}: contains a writing-block fence.`);

  sourceCounts[data.sourceTier] = (sourceCounts[data.sourceTier] ?? 0) + 1;
  contentHashes.set(`lenses/${file}`, createHash('sha256').update(text).digest('hex'));
}

for (const id of masterLensIds) check(editorialLensIds.has(id), `Missing Editorial Content for Lens ${id}.`);

check(sourceCounts['canonical-conversation'] === 48, `Expected 48 canonical-conversation files; found ${sourceCounts['canonical-conversation'] ?? 0}.`);
check(sourceCounts['pilot-repository-adapted'] === 8, `Expected 8 pilot-repository-adapted files; found ${sourceCounts['pilot-repository-adapted'] ?? 0}.`);
check(sourceCounts['pilot-repository-aligned'] === 1, `Expected 1 pilot-repository-aligned file; found ${sourceCounts['pilot-repository-aligned'] ?? 0}.`);
check(sourceCounts['canonical-conversation-completed'] === 1, `Expected 1 canonical-conversation-completed file; found ${sourceCounts['canonical-conversation-completed'] ?? 0}.`);

const manifest = JSON.parse(await readFile(join(packageDir, 'source-manifest.json'), 'utf8'));
check(manifest.entries.length === 58, `Source manifest must contain 58 entries; found ${manifest.entries.length}.`);
for (const entry of manifest.entries) {
  check(contentHashes.has(entry.file), `Source manifest references unknown file ${entry.file}.`);
  check(contentHashes.get(entry.file) === entry.sha256, `Source manifest hash mismatch for ${entry.file}.`);
}
for (const file of contentHashes.keys()) {
  check(manifest.entries.some((entry) => entry.file === file), `Source manifest is missing ${file}.`);
}

warnings.push('OP-01 through OP-08 use the pilot repository text adapted to the v1.0 editorial structure.');
warnings.push('OP-09 is a completed article based on the approved conversation definition and official W3C Understanding guidance.');
warnings.push('Lens operate uses the pilot repository article aligned with the approved v1.0 Practice Master.');

const result = {
  status: errors.length === 0 ? 'pass' : 'fail',
  errors,
  warnings,
  counts: {
    practices: editorialPracticeIds.size,
    lenses: editorialLensIds.size,
    files: editorialPracticeIds.size + editorialLensIds.size,
    sourceTiers: sourceCounts,
  },
};

console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exitCode = 1;
