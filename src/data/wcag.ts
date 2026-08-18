import criteriaData from './wcag.json';

export type WcagLevel = 'A' | 'AA';
export type WcagPrinciple = 'perceivable' | 'operable' | 'understandable' | 'robust';

export interface WcagCriterion {
	id: string;
	title: string;
	titleJa: string;
	level: WcagLevel;
	principle: WcagPrinciple;
	version: '2.2';
	understandingUrl: string;
	specificationUrl: string;
	translationUrl: string;
}

interface CriterionSource {
	id: string;
	title: string;
	titleJa: string;
	level: WcagLevel;
	principle: WcagPrinciple;
	slug: string;
}

export const wcagCriteria = (criteriaData as CriterionSource[]).map((criterion): WcagCriterion => ({
	...criterion,
	version: '2.2',
	understandingUrl: `https://www.w3.org/WAI/WCAG22/Understanding/${criterion.slug}.html`,
	specificationUrl: `https://www.w3.org/TR/WCAG22/#${criterion.slug}`,
	translationUrl: `https://waic.jp/translations/WCAG22/#${criterion.slug}`,
}));

export const wcagIds = wcagCriteria.map(({ id }) => id);
const criterionById = new Map(wcagCriteria.map((criterion) => [criterion.id, criterion]));

export function getWcagCriterion(id: string): WcagCriterion {
	const criterion = criterionById.get(id);
	if (!criterion) throw new Error(`Unknown WCAG 2.2 criterion: ${id}`);
	return criterion;
}
