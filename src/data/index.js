import u1 from './u1.js'; import u2 from './u2.js'; import u3 from './u3.js'; import u4 from './u4.js';
import { EXAMS, PRIOR, OUTSIDE } from './exams.js';

export const UNITS = [u1, u2, u3, u4];
export const LESSONS = UNITS.flatMap(u => u.lessons.map((l, i) => ({ ...l, unit: u.id, unitN: u.n, unitTitle: u.title, k: i + 1 })));
LESSONS.forEach((l, i) => { l.index = i; });
export const lessonById = Object.fromEntries(LESSONS.map(l => [l.id, l]));

/** Every concept, defined by the lesson that first teaches it. */
export const CONCEPTS = {};
for (const l of LESSONS) for (const [id, [term, def]] of Object.entries(l.teach)) {
  if (!CONCEPTS[id]) CONCEPTS[id] = { id, term, def, lesson: l.id, index: l.index, usedBy: [] };
}
for (const l of LESSONS) for (const id of l.needs) if (CONCEPTS[id]) CONCEPTS[id].usedBy.push(l.id);
export const GLOSSARY = Object.values(CONCEPTS).sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

export const ITEMS = EXAMS.flatMap(e => e.items.map(it => ({ ...it, id: `${e.id}Q${it.n}`, exam: e.id })));
export const itemById = Object.fromEntries(ITEMS.map(i => [i.id, i]));
export { EXAMS, PRIOR, OUTSIDE };
