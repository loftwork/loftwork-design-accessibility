// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';

/** @type {{ lenses: Array<{ id: string; title: string; order: number }> }} */
const practiceMaster = JSON.parse(
	readFileSync(new URL('./content-source/practice-master-v1.0/practice-master.json', import.meta.url), 'utf8'),
);

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const site = process.env.SITE_URL ?? (isGitHubActions ? 'https://loftwork.github.io' : 'http://localhost:4321');
const base = process.env.BASE_PATH ?? (isGitHubActions ? '/loftwork-design-accessibility' : '/');

export default defineConfig({
	site,
	base,
	integrations: [
		starlight({
			title: 'Accessible Design Guide',
			description: '人を起点にアクセシブルなデザインを考えるためのガイド',
			customCss: ['./src/styles/custom.css'],
			components: {
				PageTitle: './src/components/PageTitle.astro',
			},
			locales: {
				root: {
					label: '日本語',
					lang: 'ja',
				},
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/loftwork/loftwork-design-accessibility',
				},
			],
			sidebar: [
				{
					label: 'はじめに',
					items: [{ slug: 'introduction', label: 'このガイドについて' }],
				},
			{
				label: 'Human Lens',
				items: practiceMaster.lenses
					.toSorted((a, b) => a.order - b.order)
					.map((lens) => ({ slug: `lens/${lens.id}`, label: lens.title })),
				},
				{
					label: 'By Phase',
					items: [
						{ slug: 'by-phase/decide' },
						{ slug: 'by-phase/design' },
						{ slug: 'by-phase/review' },
					],
				},
				{
					label: 'Practice',
					items: [{ autogenerate: { directory: 'practices' } }],
				},
				{
					label: 'Standards',
					items: [{ slug: 'standards/wcag' }],
				},
			],
		}),
	],
});
