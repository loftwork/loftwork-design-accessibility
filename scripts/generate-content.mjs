import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sourceRoot = path.join(root, 'content-source');
const masterPath = path.join(sourceRoot, 'practice-master-v1.0', 'practice-master.json');
const editorialRoot = path.join(sourceRoot, 'editorial-content-v1.0');
const practiceOutput = path.join(root, '.generated', 'docs', 'practices');
const lensOutput = path.join(root, '.generated', 'docs', 'lens');
const legacyPracticeOutput = path.join(root, 'src', 'content', 'docs', 'practices');
const legacyLensOutput = path.join(root, 'src', 'content', 'docs', 'lens');

const master = JSON.parse(await readFile(masterPath, 'utf8'));
const practiceById = new Map(master.practices.map((practice) => [practice.id, practice]));
const lensById = new Map(master.lenses.map((lens) => [lens.id, lens]));

await mkdir(practiceOutput, { recursive: true });
await mkdir(lensOutput, { recursive: true });
await removeGeneratedFiles(practiceOutput, (name) => /^(?:pe|st|nv|op|un|in|ad)-\d{2}\.md$/.test(name));
await removeGeneratedFiles(lensOutput, (name) => name.endsWith('.mdx'));
await removeGeneratedFiles(legacyPracticeOutput, (name) => /^(?:pe|st|nv|op|un|in|ad)-\d{2}\.md$/.test(name));
await removeGeneratedFiles(legacyLensOutput, (name) => name.endsWith('.mdx'));

for (const file of (await readdir(path.join(editorialRoot, 'practices'))).filter((name) => name.endsWith('.md')).sort()) {
	const source = await readFile(path.join(editorialRoot, 'practices', file), 'utf8');
	const { frontmatter, body } = parseDocument(source, file);
	const practiceId = readFrontmatterValue(frontmatter, 'practiceId');
	const practice = practiceById.get(practiceId);
	if (!practice) throw new Error(`${file}: Practice Masterに${practiceId}がありません。`);

	const summary = extractSection(body, 'Summary');
	const generated = renderDocument(
		frontmatter,
		[
			`title: ${JSON.stringify(practice.title)}`,
			`description: ${JSON.stringify(toPlainText(summary))}`,
		],
		normalizeMarkdown(body),
	);
	await writeFile(path.join(practiceOutput, file), generated);
}

for (const file of (await readdir(path.join(editorialRoot, 'lenses'))).filter((name) => name.endsWith('.mdx')).sort()) {
	const source = await readFile(path.join(editorialRoot, 'lenses', file), 'utf8');
	const { frontmatter, body } = parseDocument(source, file);
	const lensId = readFrontmatterValue(frontmatter, 'lensId');
	const lens = lensById.get(lensId);
	if (!lens) throw new Error(`${file}: Practice MasterにLens ${lensId}がありません。`);

	const question = extractSection(body, 'Question');
	const transformedBody = normalizeMarkdown(body)
		.replace(
			`<!-- PRACTICE_LIST: primaryLens=${lensId} -->`,
			`<PracticeList primaryLens=${JSON.stringify(lensId)} />`,
		)
		.replace(
			`<!-- WCAG_TABLE: primaryLens=${lensId} -->`,
			`<WcagTable primaryLens=${JSON.stringify(lensId)} />`,
		);
	const imports = [
		"import PracticeList from '../../../src/components/PracticeList.astro';",
		"import WcagTable from '../../../src/components/WcagTable.astro';",
	].join('\n');
	const generated = renderDocument(
		frontmatter,
		[
			`title: ${JSON.stringify(lens.title)}`,
			`description: ${JSON.stringify(toPlainText(question))}`,
			'sidebar:',
			`  order: ${lens.order}`,
		],
		`${imports}\n\n${transformedBody}`,
	);
	await writeFile(path.join(lensOutput, file), generated);
}

console.log(`Generated ${master.practices.length} Practice pages and ${master.lenses.length} Lens pages from Canonical Source.`);

function parseDocument(source, file) {
	const match = source.match(/^---\n([\s\S]*?)\n---\n/);
	if (!match) throw new Error(`${file}: frontmatterがありません。`);
	return { frontmatter: match[1], body: source.slice(match[0].length) };
}

function readFrontmatterValue(frontmatter, key) {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'));
	if (!match) throw new Error(`frontmatterに${key}がありません。`);
	return match[1].trim();
}

function extractSection(body, heading) {
	const headingMatch = body.match(new RegExp(`^## ${heading}\\s*$`, 'm'));
	if (!headingMatch || headingMatch.index === undefined) throw new Error(`## ${heading} がありません。`);
	const sectionStart = headingMatch.index + headingMatch[0].length;
	const remainder = body.slice(sectionStart).replace(/^\s+/, '');
	const nextHeading = remainder.search(/^##\s/m);
	return (nextHeading === -1 ? remainder : remainder.slice(0, nextHeading)).trim();
}

function toPlainText(markdown) {
	return markdown
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_`]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function normalizeMarkdown(markdown) {
	// Japanese text directly adjacent to ** can remain unrendered in CommonMark.
	// This is a derived rendering normalization; the Canonical Editorial Content is not changed.
	return markdown.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
}

function renderDocument(frontmatter, derivedFields, body) {
	return `---\n${frontmatter}\n${derivedFields.join('\n')}\n---\n\n${body.trim()}\n`;
}

async function removeGeneratedFiles(directory, isGenerated) {
	let names;
	try {
		names = await readdir(directory);
	} catch (error) {
		if (error?.code === 'ENOENT') return;
		throw error;
	}

	for (const name of names) {
		if (isGenerated(name)) await unlink(path.join(directory, name));
	}
}
