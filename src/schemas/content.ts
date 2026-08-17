import { z } from 'astro/zod';
import { lensIds } from '../data/lenses';
import { wcagIds } from '../data/wcag';

export const phaseStrengthSchema = z.enum(['primary', 'supporting']);

export const pageFieldsSchema = z.object({
	contentType: z.literal('page'),
});

export const lensFieldsSchema = z.object({
	contentType: z.literal('lens'),
	lensId: z.enum(lensIds),
	order: z.number().int().positive(),
	question: z.string().min(1),
});

export const practiceFieldsSchema = z.object({
	contentType: z.literal('practice'),
	practiceId: z.string().regex(/^[A-Z]{2}-\d{2}$/, 'Practice IDは「OP-01」の形式で指定してください。'),
	description: z.string().min(1),
	primaryLens: z.enum(lensIds),
	relatedLens: z.array(z.enum(lensIds)).optional(),
	priority: z.enum(['standard', 'recommended']),
	condition: z.enum(['always', 'conditional']),
	appliesTo: z.array(z.string().min(1)).optional(),
	phases: z.object({
		decide: phaseStrengthSchema.optional(),
		design: phaseStrengthSchema.optional(),
		review: phaseStrengthSchema.optional(),
	}),
	wcag: z.array(z.enum(wcagIds)).min(1),
});

export const contentFieldsSchema = z.discriminatedUnion('contentType', [
	pageFieldsSchema,
	lensFieldsSchema,
	practiceFieldsSchema,
]);

export type PhaseStrength = z.infer<typeof phaseStrengthSchema>;
export type PracticeFields = z.infer<typeof practiceFieldsSchema>;
