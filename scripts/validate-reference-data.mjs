import { readFile } from 'node:fs/promises';

const master = JSON.parse(await readFile('content-source/practice-master-v1.0/practice-master.json', 'utf8'));
const criteria = JSON.parse(await readFile('src/data/wcag.json', 'utf8'));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

check(criteria.length === 55, `WCAG中央参照データは55件必要です。actual=${criteria.length}`);
const criterionById = new Map();
for (const criterion of criteria) {
	check(!criterionById.has(criterion.id), `WCAG IDが重複しています: ${criterion.id}`);
	criterionById.set(criterion.id, criterion);
	check(typeof criterion.title === 'string' && criterion.title.length > 0, `${criterion.id}: titleがありません。`);
	check(typeof criterion.titleJa === 'string' && criterion.titleJa.length > 0, `${criterion.id}: titleJaがありません。`);
	check(['A', 'AA'].includes(criterion.level), `${criterion.id}: Levelが不正です。`);
	check(['perceivable', 'operable', 'understandable', 'robust'].includes(criterion.principle), `${criterion.id}: principleが不正です。`);
	check(typeof criterion.slug === 'string' && criterion.slug.length > 0, `${criterion.id}: slugがありません。`);
}

const masterCriteria = new Map();
for (const practice of master.practices) {
	for (const mapped of practice.wcag) {
		const reference = criterionById.get(mapped.id);
		check(Boolean(reference), `${practice.id}: WCAG中央参照データに${mapped.id}がありません。`);
		check(reference?.level === mapped.level, `${practice.id}: ${mapped.id}のLevelが中央参照データと一致しません。`);
		masterCriteria.set(mapped.id, mapped.level);
	}
}
for (const criterion of criteria) check(masterCriteria.has(criterion.id), `${criterion.id}: 対応するPracticeがありません。`);

const counts = {
	total: criteria.length,
	A: criteria.filter(({ level }) => level === 'A').length,
	AA: criteria.filter(({ level }) => level === 'AA').length,
};
check(counts.A === 31, `WCAG Aは31件必要です。actual=${counts.A}`);
check(counts.AA === 24, `WCAG AAは24件必要です。actual=${counts.AA}`);

console.log(JSON.stringify({ status: errors.length === 0 ? 'pass' : 'fail', errors, counts }, null, 2));
if (errors.length > 0) process.exitCode = 1;
