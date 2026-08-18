import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { contentFieldsSchema } from './schemas/content';

export const collections = {
	docs: defineCollection({
		loader: glob({
			base: '.',
			pattern: ['src/content/docs/**/*.{md,mdx}', '.generated/docs/**/*.{md,mdx}'],
			generateId: ({ entry }) => {
				const normalized = entry.replaceAll('\\', '/');
				const relative = normalized
					.replace(/^src\/content\/docs\//, '')
					.replace(/^\.generated\/docs\//, '')
					.replace(/\.(?:md|mdx)$/, '');
				return relative.replace(/\/index$/, '') || 'index';
			},
		}),
		schema: docsSchema({ extend: contentFieldsSchema }),
	}),
};
