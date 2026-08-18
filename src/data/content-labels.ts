import type { Condition, Handoff, Phase, PhaseWeight, Requirement } from './practice-master';

export const phaseLabels: Record<Phase, string> = {
	decide: 'Decide',
	design: 'Design',
	review: 'Review',
};

export const phaseWeightLabels: Record<Exclude<PhaseWeight, null>, string> = {
	primary: '主に判断する',
	supporting: 'あわせて確認する',
};

export const priorityLabels = {
	standard: '標準',
} as const;

export const requirementLabels: Record<Requirement, string> = {
	baseline: '標準品質',
	'project-dependent': '案件に応じて判断',
};

export const conditionLabels: Record<Condition, string> = {
	always: '常に確認',
	conditional: '該当する場合に確認',
};

export const handoffLabels: Record<Handoff, string> = {
	development: '開発へ引き継ぐ',
};
