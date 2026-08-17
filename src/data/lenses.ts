export const lensIds = [
	'operate',
	'navigate',
	'adapt',
	'perceive',
	'recover',
	'understand',
] as const;

export type LensId = (typeof lensIds)[number];

export interface Lens {
	id: LensId;
	title: string;
	order: number;
	question: string;
}

/**
 * パイロット原稿で正式な内容が提供されているLensのみを登録する。
 * その他のIDはPracticeの関連付けを検証するために `lensIds` で管理し、
 * 正式な名称や問いを推測して補わない。
 */
export const lenses = {
	operate: {
		id: 'operate',
		title: '操作する',
		order: 4,
		question: '特定の身体能力や入力方法だけを前提にしていないだろうか？',
	},
} satisfies Partial<Record<LensId, Lens>>;

export function getLens(id: LensId): Lens | undefined {
	return lenses[id as keyof typeof lenses];
}
