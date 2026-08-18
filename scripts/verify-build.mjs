import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve('dist');
const repositoryBase = '/loftwork-design-accessibility/';
const configuredBase = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS === 'true' ? repositoryBase : '/');
const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
const master = JSON.parse(await readFile('content-source/practice-master-v1.0/practice-master.json', 'utf8'));
const criteria = JSON.parse(await readFile('src/data/wcag.json', 'utf8'));

const practiceIds = master.practices.map(({ id }) => id);
const expectedPages = [
	'index.html',
	'introduction/index.html',
	...master.lenses.map(({ id }) => `lens/${id}/index.html`),
	'practices/index.html',
	...practiceIds.map((id) => `practices/${id.toLowerCase()}/index.html`),
	'by-phase/decide/index.html',
	'by-phase/design/index.html',
	'by-phase/review/index.html',
	'standards/wcag/index.html',
];

for (const page of expectedPages) await assertExists(path.join(outputDirectory, page), `ページが生成されていません: ${page}`);

const expectedPracticeLists = new Map([
	['practices/index.html', practiceIds],
	...master.lenses.map((lens) => [
		`lens/${lens.id}/index.html`,
		master.practices.filter(({ primaryLens }) => primaryLens === lens.id).map(({ id }) => id),
	]),
	...['decide', 'design', 'review'].map((phase) => [
		`by-phase/${phase}/index.html`,
		master.practices
			.filter((practice) => practice.phases[phase] !== null)
			.toSorted((a, b) => {
				const order = { primary: 0, supporting: 1 };
				return order[a.phases[phase]] - order[b.phases[phase]] || practiceIds.indexOf(a.id) - practiceIds.indexOf(b.id);
			})
			.map(({ id }) => id),
	]),
]);

for (const [page, expectedIds] of expectedPracticeLists) {
	const html = await readFile(path.join(outputDirectory, page), 'utf8');
	const actualIds = [...html.matchAll(/<p class="[^"]*\bpractice-id\b[^"]*">([A-Z]{2}-\d{2})<\/p>/g)].map((match) => match[1]);
	assertEqual(actualIds, expectedIds, `${page} のPractice順序`);
}

const standardsHtml = await readFile(path.join(outputDirectory, 'standards/wcag/index.html'), 'utf8');
const renderedCriterionIds = [...standardsHtml.matchAll(/id="criterion-(\d)-(\d)-(\d+)"/g)].map((match) => `${match[1]}.${match[2]}.${match[3]}`);
assertEqual(renderedCriterionIds, criteria.map(({ id }) => id), 'StandardsのWCAG順序');
for (const criterion of criteria) {
	const anchor = `criterion-${criterion.id.replaceAll('.', '-')}`;
	const row = standardsHtml.match(new RegExp(`<tr id="${anchor}"[\\s\\S]*?<\\/tr>`))?.[0] ?? '';
	if (!row.includes(criterion.titleJa)) throw new Error(`${criterion.id}: WAIC日本語訳タイトルが表示されていません。`);
	if (!row.includes('/practices/')) throw new Error(`${criterion.id}: WCAG逆引きにPracticeがありません。`);
}

await assertPracticeMetadata('OP-01', (html) => html.includes('2.1.1') && !html.includes('4.1.2'), 'OP-01は2.1.1のみである必要があります。');
await assertPracticeMetadata('OP-10', (html) => html.includes('4.1.2'), 'OP-10に4.1.2がありません。');
await assertPracticeMetadata('NV-06', (html) => html.includes('常に確認'), 'NV-06がAlways表示になっていません。');

const baselineAaList = standardsHtml.match(/<ul class="[^"]*\bbaseline-wcag-list\b[^"]*"[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? '';
for (const id of master.policy.baselineAA) {
	const criterion = criteria.find((candidate) => candidate.id === id);
	if (!criterion || !baselineAaList.includes(`${criterion.id} ${criterion.titleJa}`)) {
		throw new Error(`${id}: 標準品質のLevel AA一覧にMaster由来の達成基準がありません。`);
	}
}

const htmlFiles = await collectHtmlFiles(outputDirectory);
const brokenLinks = [];
const unrenderedMarkdown = [];
const generationMarkers = [];

for (const file of htmlFiles) {
	const html = await readFile(file, 'utf8');
	const mainContent = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '';
	if (mainContent.includes('**')) unrenderedMarkdown.push(path.relative(outputDirectory, file));
	if (html.includes('PRACTICE_LIST:') || html.includes('WCAG_TABLE:')) generationMarkers.push(path.relative(outputDirectory, file));

	for (const match of html.matchAll(/href="([^"]+)"/g)) {
		const href = match[1].replaceAll('&amp;', '&');
		const target = resolveInternalTarget(href);
		if (!target) continue;
		try { await access(target); } catch { brokenLinks.push(`${path.relative(outputDirectory, file)} -> ${href}`); }
	}
}

if (brokenLinks.length > 0) throw new Error(`リンク先が見つかりません:\n${brokenLinks.join('\n')}`);
if (unrenderedMarkdown.length > 0) throw new Error(`未変換のMarkdown強調記法があります:\n${unrenderedMarkdown.join('\n')}`);
if (generationMarkers.length > 0) throw new Error(`未変換の生成マーカーがあります:\n${generationMarkers.join('\n')}`);

console.log(JSON.stringify({
	status: 'pass',
	pages: expectedPages.length,
	htmlFiles: htmlFiles.length,
	practices: practiceIds.length,
	lenses: master.lenses.length,
	wcag: { A: criteria.filter(({ level }) => level === 'A').length, AA: criteria.filter(({ level }) => level === 'AA').length },
}, null, 2));

async function assertPracticeMetadata(id, assertion, message) {
	const html = await readFile(path.join(outputDirectory, `practices/${id.toLowerCase()}/index.html`), 'utf8');
	const metadata = html.match(/<aside class="[^"]*\bpractice-meta\b[^"]*"[\s\S]*?<\/aside>/)?.[0] ?? '';
	if (!assertion(metadata)) throw new Error(message);
}

async function collectHtmlFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(entries.map((entry) => {
		const entryPath = path.join(directory, entry.name);
		return entry.isDirectory() ? collectHtmlFiles(entryPath) : [entryPath];
	}));
	return files.flat().filter((file) => file.endsWith('.html'));
}

function resolveInternalTarget(href) {
	if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('data:') || href.startsWith('javascript:')) return undefined;
	let url;
	try { url = new URL(href, 'https://local.invalid'); } catch { return undefined; }
	if (url.hostname !== 'local.invalid') return undefined;
	let pathname = decodeURIComponent(url.pathname);
	if (base !== '/' && pathname.startsWith(base)) pathname = pathname.slice(base.length - 1);
	if (!pathname.startsWith('/')) return undefined;
	const relativePath = pathname.slice(1);
	if (relativePath === '' || pathname.endsWith('/')) return path.join(outputDirectory, relativePath, 'index.html');
	if (path.extname(relativePath)) return path.join(outputDirectory, relativePath);
	return path.join(outputDirectory, relativePath, 'index.html');
}

async function assertExists(file, message) {
	try { await access(file); } catch { throw new Error(message); }
}

function assertEqual(actual, expected, label) {
	if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
		throw new Error(`${label}が不正です。expected=${expected.join(',')} actual=${actual.join(',')}`);
	}
}
