import { readFile } from 'node:fs/promises';

const masterUrl = new URL('./practice-master.json', import.meta.url);
const master = JSON.parse(await readFile(masterUrl, 'utf8'));

const expectedCounts = {
  perceive: 9,
  structure: 6,
  navigate: 7,
  operate: 10,
  understand: 6,
  input: 8,
  adapt: 5,
};

const wcagA = new Set([
  '1.1.1', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.3.2', '1.3.3', '1.4.1', '1.4.2',
  '2.1.1', '2.1.2', '2.1.4', '2.2.1', '2.2.2', '2.3.1', '2.4.1', '2.4.2', '2.4.3',
  '2.4.4', '2.5.1', '2.5.2', '2.5.3', '2.5.4', '3.1.1', '3.2.1', '3.2.2', '3.2.6',
  '3.3.1', '3.3.2', '3.3.7', '4.1.2',
]);

const wcagAA = new Set([
  '1.2.4', '1.2.5', '1.3.4', '1.3.5', '1.4.3', '1.4.4', '1.4.5', '1.4.10', '1.4.11',
  '1.4.12', '1.4.13', '2.4.5', '2.4.6', '2.4.7', '2.4.11', '2.5.7', '2.5.8', '3.1.2',
  '3.2.3', '3.2.4', '3.3.3', '3.3.4', '3.3.8', '4.1.3',
]);

const errors = [];
const warnings = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const lensIds = new Set(master.lenses.map((lens) => lens.id));
const lensByPrefix = new Map(master.lenses.map((lens) => [lens.prefix, lens.id]));
const allowedAppliesTo = new Set([
  ...master.vocabulary.appliesToBase,
  ...master.vocabulary.appliesToSchemaCompletion,
]);
const allowedRequirements = new Set(master.vocabulary.requirement);
const allowedPhases = new Set([...master.vocabulary.phaseWeight, null]);
const allowedHandoffs = new Set(master.vocabulary.handoff);
const baselineAA = new Set(master.policy.baselineAA);

check(master.version === '1.0', 'Master version must be 1.0.');
check(master.contentModelVersion === '0.4', 'Content Model version must be 0.4.');
check(master.requirementPolicyVersion === '1.0', 'Requirement Policy version must be 1.0.');
check(master.practices.length === 51, `Expected 51 Practices; found ${master.practices.length}.`);

const ids = new Set();
for (const practice of master.practices) {
  check(!ids.has(practice.id), `Duplicate Practice ID: ${practice.id}.`);
  ids.add(practice.id);

  check(/^(PE|ST|NV|OP|UN|IN|AD)-\d{2}$/.test(practice.id), `Invalid Practice ID: ${practice.id}.`);
  const prefix = practice.id.slice(0, 2);
  check(lensByPrefix.get(prefix) === practice.primaryLens, `${practice.id}: ID prefix and primaryLens disagree.`);
  check(lensIds.has(practice.primaryLens), `${practice.id}: unknown primaryLens ${practice.primaryLens}.`);
  check(practice.relatedLens.length <= 2, `${practice.id}: relatedLens must contain at most two Lens IDs.`);
  check(!practice.relatedLens.includes(practice.primaryLens), `${practice.id}: relatedLens contains its primaryLens.`);
  for (const lens of practice.relatedLens) check(lensIds.has(lens), `${practice.id}: unknown relatedLens ${lens}.`);

  check(practice.priority === 'standard', `${practice.id}: priority must be standard in v1.0.`);
  check(allowedRequirements.has(practice.requirement), `${practice.id}: invalid requirement ${practice.requirement}.`);
  check(['always', 'conditional'].includes(practice.condition), `${practice.id}: invalid condition ${practice.condition}.`);
  if (practice.condition === 'conditional') {
    check(Array.isArray(practice.appliesTo) && practice.appliesTo.length > 0, `${practice.id}: conditional requires appliesTo.`);
  }
  if (practice.condition === 'always') {
    check(!('appliesTo' in practice), `${practice.id}: always must not carry appliesTo.`);
  }
  for (const term of practice.appliesTo ?? []) {
    check(allowedAppliesTo.has(term), `${practice.id}: unknown appliesTo value ${term}.`);
  }

  const phaseValues = ['decide', 'design', 'review'].map((phase) => practice.phases[phase]);
  for (const [phase, value] of Object.entries(practice.phases)) {
    check(['decide', 'design', 'review'].includes(phase), `${practice.id}: unknown phase ${phase}.`);
    check(allowedPhases.has(value), `${practice.id}: invalid ${phase} weight ${value}.`);
  }
  check(phaseValues.includes('primary'), `${practice.id}: at least one phase must be primary.`);

  for (const handoff of practice.handoff) check(allowedHandoffs.has(handoff), `${practice.id}: invalid handoff ${handoff}.`);
  check(practice.wcag.length > 0, `${practice.id}: at least one WCAG reference is required.`);
  for (const criterion of practice.wcag) {
    check(wcagA.has(criterion.id) || wcagAA.has(criterion.id), `${practice.id}: unknown A/AA WCAG criterion ${criterion.id}.`);
    check((wcagA.has(criterion.id) ? 'A' : 'AA') === criterion.level, `${practice.id}: incorrect level for ${criterion.id}.`);
  }

  const derivedRequirement = practice.wcag.some(({ id }) => wcagA.has(id) || baselineAA.has(id))
    ? 'baseline'
    : 'project-dependent';
  check(practice.requirement === derivedRequirement, `${practice.id}: top-level requirement conflicts with Requirement Policy v1.0.`);

  for (const override of practice.requirements ?? []) {
    check(allowedRequirements.has(override.requirement), `${practice.id}: invalid requirements override.`);
    for (const id of override.wcag ?? []) {
      check(practice.wcag.some((criterion) => criterion.id === id), `${practice.id}: override references unmapped WCAG ${id}.`);
    }
    for (const term of override.appliesTo ?? []) {
      check((practice.appliesTo ?? []).includes(term), `${practice.id}: override appliesTo ${term} is outside Practice applicability.`);
    }
  }
}

for (const [lens, expected] of Object.entries(expectedCounts)) {
  const actual = master.practices.filter((practice) => practice.primaryLens === lens).length;
  check(actual === expected, `${lens}: expected ${expected} Practices; found ${actual}.`);
}

const coveredA = new Set(master.practices.flatMap((practice) => practice.wcag).filter(({ level }) => level === 'A').map(({ id }) => id));
const coveredAA = new Set(master.practices.flatMap((practice) => practice.wcag).filter(({ level }) => level === 'AA').map(({ id }) => id));
for (const id of wcagA) check(coveredA.has(id), `WCAG A coverage gap: ${id}.`);
for (const id of wcagAA) check(coveredAA.has(id), `WCAG AA coverage gap: ${id}.`);
check(coveredA.size === wcagA.size, `Unexpected WCAG A coverage count: ${coveredA.size}.`);
check(coveredAA.size === wcagAA.size, `Unexpected WCAG AA coverage count: ${coveredAA.size}.`);

const byId = new Map(master.practices.map((practice) => [practice.id, practice]));
check(byId.get('OP-01')?.wcag.length === 1 && byId.get('OP-01')?.wcag[0].id === '2.1.1', 'OP-01 must contain only WCAG 2.1.1.');
check(byId.get('OP-10')?.wcag.some(({ id }) => id === '4.1.2'), 'OP-10 must cover WCAG 4.1.2.');
check(byId.get('NV-06')?.condition === 'always', 'NV-06 must be always.');

if (master.vocabulary.appliesToSchemaCompletion.length > 0) {
  warnings.push(`${master.vocabulary.appliesToSchemaCompletion.length} appliesTo values are documented schema-completion terms.`);
}
if (master.practices.some((practice) => practice.requirements?.some((override) => override.wcag))) {
  warnings.push('requirements overrides use the documented WCAG selector schema completion for mixed A/AA Practices.');
}

const result = {
  status: errors.length === 0 ? 'pass' : 'fail',
  errors,
  warnings,
  counts: {
    practices: master.practices.length,
    lenses: master.lenses.length,
    wcagA: coveredA.size,
    wcagAA: coveredAA.size,
    baselinePractices: master.practices.filter(({ requirement }) => requirement === 'baseline').length,
    projectDependentPractices: master.practices.filter(({ requirement }) => requirement === 'project-dependent').length,
    conditionalPractices: master.practices.filter(({ condition }) => condition === 'conditional').length,
    developmentHandoffs: master.practices.filter(({ handoff }) => handoff.includes('development')).length,
  },
};

console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exitCode = 1;
