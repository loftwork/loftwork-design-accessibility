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
	level: 'A' | 'AA';
	principle: 'perceivable' | 'operable' | 'understandable' | 'robust';
	version: '2.2';
}

export const wcagCriteria = {
	'2.1.1': criterion('2.1.1', 'Keyboard', 'A', 'operable'),
	'2.1.2': criterion('2.1.2', 'No Keyboard Trap', 'A', 'operable'),
	'2.1.4': criterion('2.1.4', 'Character Key Shortcuts', 'A', 'operable'),
	'2.4.3': criterion('2.4.3', 'Focus Order', 'A', 'operable'),
	'2.5.1': criterion('2.5.1', 'Pointer Gestures', 'A', 'operable'),
	'2.5.2': criterion('2.5.2', 'Pointer Cancellation', 'A', 'operable'),
	'2.5.3': criterion('2.5.3', 'Label in Name', 'A', 'operable'),
	'2.5.4': criterion('2.5.4', 'Motion Actuation', 'A', 'operable'),
	'2.5.7': criterion('2.5.7', 'Dragging Movements', 'AA', 'operable'),
	'2.5.8': criterion('2.5.8', 'Target Size (Minimum)', 'AA', 'operable'),
	'4.1.2': criterion('4.1.2', 'Name, Role, Value', 'A', 'robust'),
} satisfies Record<WcagId, WcagCriterion>;

function criterion(
	id: WcagId,
	title: string,
	level: WcagCriterion['level'],
	principle: WcagCriterion['principle'],
): WcagCriterion {
	return { id, title, level, principle, version: '2.2' };
}

export function getWcagCriterion(id: WcagId): WcagCriterion {
	return wcagCriteria[id];
}
