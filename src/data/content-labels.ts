import type { PhaseStrength, PracticeFields } from '../schemas/content';

export type Phase = keyof PracticeFields['phases'];

export const phaseLabels: Record<Phase, string> = {
	decide: 'Decide',
	design: 'Design',
	review: 'Review',
};

export const phaseStrengthLabels: Record<PhaseStrength, string> = {
	primary: '主に扱う',
	supporting: '補助的に扱う',
};

export const priorityLabels: Record<PracticeFields['priority'], string> = {
	standard: '標準',
	recommended: '推奨',
};

export const conditionLabels: Record<PracticeFields['condition'], string> = {
	always: '常に確認する',
	conditional: '該当する機能・コンテンツがある場合',
};
