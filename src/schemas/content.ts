import { z } from 'astro/zod';
import { lensIds, practiceIds } from '../data/practice-master';

const sourceFieldsSchema = z.object({
	editorialVersion: z.literal('1.0'),
	sourceTier: z.enum([
		'canonical-conversation',
		'pilot-repository-adapted',
		'canonical-conversation-completed',
		'pilot-repository-aligned',
	]),
	sourceConversation: z.string().optional(),
	sourceRepository: z.string().optional(),
	sourceCommit: z.string().optional(),
	referenceUrl: z.url().optional(),
});

export const pageFieldsSchema = z.object({
	contentType: z.literal('page'),
});

export const lensFieldsSchema = sourceFieldsSchema.extend({
	contentType: z.literal('lens'),
	lensId: z.string().refine((id) => lensIds.includes(id), 'Practice Masterに存在しないLens IDです。'),
});

export const practiceFieldsSchema = sourceFieldsSchema.extend({
	contentType: z.literal('practice'),
	practiceId: z.string().refine((id) => practiceIds.includes(id), 'Practice Masterに存在しないPractice IDです。'),
});

export const contentFieldsSchema = z.discriminatedUnion('contentType', [
	pageFieldsSchema,
	lensFieldsSchema,
	practiceFieldsSchema,
]);

export type LensFields = z.infer<typeof lensFieldsSchema>;
export type PracticeFields = z.infer<typeof practiceFieldsSchema>;
