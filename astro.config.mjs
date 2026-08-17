// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
					label: 'Introduction',
					items: [{ slug: 'introduction' }],
				},
				{
					label: 'Human Lens',
					items: [{ slug: 'lens/operate' }],
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
					label: 'Practices',
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
