import masterData from '../../content-source/practice-master-v1.0/practice-master.json';

export type Phase = 'decide' | 'design' | 'review';
export type PhaseWeight = 'primary' | 'supporting' | null;
export type Requirement = 'baseline' | 'project-dependent';
export type Condition = 'always' | 'conditional';
export type Handoff = 'development';
export type WcagLevel = 'A' | 'AA';

export interface Lens {
	id: string;
	title: string;
	prefix: string;
	order: number;
}

export interface RequirementOverride {
	wcag?: string[];
	appliesTo?: string[];
	requirement: Requirement;
}

export interface Practice {
	id: string;
	title: string;
	primaryLens: string;
	relatedLens: string[];
	priority: 'standard';
	requirement: Requirement;
	requirements?: RequirementOverride[];
	condition: Condition;
	appliesTo?: string[];
	phases: Record<Phase, PhaseWeight>;
	handoff: Handoff[];
	wcag: Array<{ id: string; level: WcagLevel }>;
}

export interface RequirementPolicy {
	baselineWcagLevels: WcagLevel[];
	baselineAA: string[];
	requirementResolution: string[];
}

export interface PracticeMaster {
	version: '1.0';
	contentModelVersion: '0.4';
	requirementPolicyVersion: '1.0';
	policy: RequirementPolicy;
	lenses: Lens[];
	practices: Practice[];
}

export const practiceMaster = masterData as PracticeMaster;
export const lenses = practiceMaster.lenses;
export const practices = practiceMaster.practices;
export const lensIds = lenses.map(({ id }) => id);
export const practiceIds = practices.map(({ id }) => id);
export const baselineAaIds = practiceMaster.policy.baselineAA;

const lensById = new Map(lenses.map((lens) => [lens.id, lens]));
const practiceById = new Map(practices.map((practice) => [practice.id, practice]));

export function getLens(id: string): Lens {
	const lens = lensById.get(id);
	if (!lens) throw new Error(`Unknown Lens ID: ${id}`);
	return lens;
}

export function getPractice(id: string): Practice {
	const practice = practiceById.get(id);
	if (!practice) throw new Error(`Unknown Practice ID: ${id}`);
	return practice;
}

export function getPracticesByLens(primaryLens: string): Practice[] {
	return practices.filter((practice) => practice.primaryLens === primaryLens);
}

export function getRelatedPractices(lensId: string): Practice[] {
	return practices.filter((practice) => practice.relatedLens.includes(lensId));
}

export function getPracticesByPhase(phase: Phase): Practice[] {
	const weightOrder: Record<Exclude<PhaseWeight, null>, number> = { primary: 0, supporting: 1 };
	return practices
		.filter((practice) => practice.phases[phase] !== null)
		.toSorted((a, b) => {
			const weight = weightOrder[a.phases[phase]!] - weightOrder[b.phases[phase]!];
			return weight || practiceIds.indexOf(a.id) - practiceIds.indexOf(b.id);
		});
}

export function getPracticesByWcag(wcagId: string): Practice[] {
	return practices.filter((practice) => practice.wcag.some(({ id }) => id === wcagId));
}

export function getWcagIdsByLens(primaryLens: string): string[] {
	const ids = new Set(getPracticesByLens(primaryLens).flatMap((practice) => practice.wcag.map(({ id }) => id)));
	return [...ids];
}
