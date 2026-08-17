export const wcagIds = [
	'2.1.1',
	'2.1.2',
	'2.1.4',
	'2.4.3',
	'2.5.1',
	'2.5.2',
	'2.5.3',
	'2.5.4',
	'2.5.7',
	'2.5.8',
	'4.1.2',
] as const;

export type WcagId = (typeof wcagIds)[number];

export interface WcagCriterion {
	id: WcagId;
	title: string;
	titleJa: string;
	level: 'A' | 'AA';
	principle: 'perceivable' | 'operable' | 'understandable' | 'robust';
	version: '2.2';
	understandingUrl: string;
	translationUrl: string;
}

export const wcagCriteria = {
	'2.1.1': criterion('2.1.1', 'Keyboard', 'キーボード', 'keyboard', 'A', 'operable'),
	'2.1.2': criterion('2.1.2', 'No Keyboard Trap', 'キーボードトラップなし', 'no-keyboard-trap', 'A', 'operable'),
	'2.1.4': criterion('2.1.4', 'Character Key Shortcuts', '文字キーのショートカット', 'character-key-shortcuts', 'A', 'operable'),
	'2.4.3': criterion('2.4.3', 'Focus Order', 'フォーカス順序', 'focus-order', 'A', 'operable'),
	'2.5.1': criterion('2.5.1', 'Pointer Gestures', 'ポインタのジェスチャ', 'pointer-gestures', 'A', 'operable'),
	'2.5.2': criterion('2.5.2', 'Pointer Cancellation', 'ポインタのキャンセル', 'pointer-cancellation', 'A', 'operable'),
	'2.5.3': criterion('2.5.3', 'Label in Name', 'ラベルを含む名前 (name)', 'label-in-name', 'A', 'operable'),
	'2.5.4': criterion('2.5.4', 'Motion Actuation', '動きによる起動', 'motion-actuation', 'A', 'operable'),
	'2.5.7': criterion('2.5.7', 'Dragging Movements', 'ドラッグ動作', 'dragging-movements', 'AA', 'operable'),
	'2.5.8': criterion('2.5.8', 'Target Size (Minimum)', 'ターゲットのサイズ (最低限)', 'target-size-minimum', 'AA', 'operable'),
	'4.1.2': criterion('4.1.2', 'Name, Role, Value', '名前 (name)・役割 (role)・値 (value)', 'name-role-value', 'A', 'robust'),
} satisfies Record<WcagId, WcagCriterion>;

function criterion(
	id: WcagId,
	title: string,
	titleJa: string,
	slug: string,
	level: WcagCriterion['level'],
	principle: WcagCriterion['principle'],
): WcagCriterion {
	return {
		id,
		title,
		titleJa,
		level,
		principle,
		version: '2.2',
		understandingUrl: `https://waic.jp/translations/WCAG22/Understanding/${slug}.html`,
		translationUrl: `https://waic.jp/translations/WCAG22/#${slug}`,
	};
}

export function getWcagCriterion(id: WcagId): WcagCriterion {
	return wcagCriteria[id];
}
