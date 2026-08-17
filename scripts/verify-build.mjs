import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve('dist');
const repositoryBase = '/loftwork-design-accessibility/';
const configuredBase = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS === 'true' ? repositoryBase : '/');
const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;

const expectedPages = [
	'index.html',
	'introduction/index.html',
	'lens/operate/index.html',
	'practices/index.html',
	...Array.from({ length: 8 }, (_, index) => `practices/op-0${index + 1}/index.html`),
	'by-phase/decide/index.html',
	'by-phase/design/index.html',
	'by-phase/review/index.html',
	'standards/wcag/index.html',
];

const allPracticeIds = Array.from({ length: 8 }, (_, index) => `OP-0${index + 1}`);
const expectedPracticeLists = new Map([
	['lens/operate/index.html', allPracticeIds],
	['practices/index.html', allPracticeIds],
	['by-phase/decide/index.html', ['OP-01', 'OP-02', 'OP-03', 'OP-06', 'OP-07', 'OP-08', 'OP-04', 'OP-05']],
	['by-phase/design/index.html', allPracticeIds],
	['by-phase/review/index.html', allPracticeIds],
]);

for (const page of expectedPages) {
	await assertExists(path.join(outputDirectory, page), `ページが生成されていません: ${page}`);
}

for (const [page, expectedIds] of expectedPracticeLists) {
	const html = await readFile(path.join(outputDirectory, page), 'utf8');
	const actualIds = [...html.matchAll(/<p class="[^"]*\bpractice-id\b[^"]*">(OP-\d{2})<\/p>/g)].map(
		(match) => match[1],
	);
	assertEqual(actualIds, expectedIds, `${page} のPractice順序`);
}

const htmlFiles = await collectHtmlFiles(outputDirectory);
const brokenLinks = [];
const unrenderedMarkdown = [];

for (const file of htmlFiles) {
	const html = await readFile(file, 'utf8');
	const mainContent = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '';
	if (mainContent.includes('**')) {
		unrenderedMarkdown.push(path.relative(outputDirectory, file));
	}

	for (const match of html.matchAll(/href="([^"]+)"/g)) {
		const href = match[1].replaceAll('&amp;', '&');
		const target = resolveInternalTarget(href);
		if (!target) continue;

		try {
			await access(target);
		} catch {
			brokenLinks.push(`${path.relative(outputDirectory, file)} -> ${href}`);
		}
	}
}

if (brokenLinks.length > 0) {
	throw new Error(`リンク先が見つかりません:\n${brokenLinks.join('\n')}`);
}

if (unrenderedMarkdown.length > 0) {
	throw new Error(`未変換のMarkdown強調記法があります:\n${unrenderedMarkdown.join('\n')}`);
}

console.log(`Verified ${expectedPages.length} pages, ${htmlFiles.length} HTML files, internal links, and Markdown rendering.`);

async function collectHtmlFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const entryPath = path.join(directory, entry.name);
			return entry.isDirectory() ? collectHtmlFiles(entryPath) : [entryPath];
		}),
	);

	return files.flat().filter((file) => file.endsWith('.html'));
}

function resolveInternalTarget(href) {
	if (
		href.startsWith('#') ||
		href.startsWith('mailto:') ||
		href.startsWith('tel:') ||
		href.startsWith('data:') ||
		href.startsWith('javascript:')
	) {
		return undefined;
	}

	let url;
	try {
		url = new URL(href, 'https://local.invalid');
	} catch {
		return undefined;
	}

	if (url.hostname !== 'local.invalid') return undefined;

	let pathname = decodeURIComponent(url.pathname);
	if (base !== '/' && pathname.startsWith(base)) pathname = pathname.slice(base.length - 1);
	if (!pathname.startsWith('/')) return undefined;

	const relativePath = pathname.slice(1);
	if (relativePath === '' || pathname.endsWith('/')) {
		return path.join(outputDirectory, relativePath, 'index.html');
	}

	if (path.extname(relativePath)) return path.join(outputDirectory, relativePath);
	return path.join(outputDirectory, relativePath, 'index.html');
}

async function assertExists(file, message) {
	try {
		await access(file);
	} catch {
		throw new Error(message);
	}
}

function assertEqual(actual, expected, label) {
	if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
		throw new Error(`${label}が不正です。expected=${expected.join(',')} actual=${actual.join(',')}`);
	}
}
