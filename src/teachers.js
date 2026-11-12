import { UNITS, LESSONS, lessonById, CONCEPTS, EXAMS, ITEMS, PRIOR, OUTSIDE } from './data/index.js';
import { esc, store } from './ui.js';

const main = document.getElementById('main');
const claimedBy = {};
for (const l of LESSONS) for (const id of l.exam) (claimedBy[id] ??= []).push(l.id);
const link = id => `<a href="index.html#/${id}">${id}</a>`;
const fills = LESSONS.filter(l => !l.exam.length), noted = LESSONS.filter(l => l.gap);

const progression = UNITS.map(u => `<h3 data-u="${u.id}" id="prog-${u.id}">Part ${u.n}. ${esc(u.title)} <span class="tag">${esc(EXAMS.find(e => e.unit === u.id).title)}</span></h3>
  <div class="scroll" data-u="${u.id}"><table><thead><tr><th>Lesson</th><th>Idea</th><th>New key concepts</th><th>Builds on</th><th>Prepares for</th></tr></thead><tbody>
  ${u.lessons.map(l0 => { const l = lessonById[l0.id];
    const from = [...new Set(l.needs.filter(n => CONCEPTS[n]).map(n => CONCEPTS[n].lesson))].sort((a, b) => lessonById[a].index - lessonById[b].index);
    const prior = l.needs.filter(n => PRIOR[n]);
    return `<tr><td class="n">${link(l.id)}</td><td><b>${esc(l.title)}</b><br>${esc(l.head)}</td><td>${Object.values(l.teach).map(t => esc(t[0])).join('; ')}</td>
      <td>${from.map(link).join(', ') || '—'}${prior.length ? `<br><i>prior: ${prior.map(esc).join(', ')}</i>` : ''}</td>
      <td>${l.exam.length ? l.exam.map(x => x.replace(/^E\dQ/, 'Q')).join(', ') : '<span class="tag fill">gap fill</span>'}</td></tr>`; }).join('')}
  </tbody></table></div>`).join('');

const coverage = EXAMS.map(e => `<h3 data-u="${e.unit}">${esc(e.title)}. ${esc(e.topic)}</h3>
  <div class="scroll" data-u="${e.unit}"><table><thead><tr><th>Item</th><th>What it asks for</th><th>Taught in</th></tr></thead><tbody>
  ${e.items.map(it => `<tr><td class="n">Q${it.n}${it.pts ? ` <span style="font-weight:400">(${it.pts})</span>` : ''}</td><td>${esc(it.skill)}${it.fig ? ' <span class="tag">figure</span>' : ''}</td><td>${(claimedBy[`${e.id}Q${it.n}`] ?? []).map(link).join(', ')}</td></tr>`).join('')}
  </tbody></table></div>`).join('');

const notes = UNITS.map(u => `<h2 data-u="${u.id}" id="notes-${u.id}" style="color:var(--part)">Part ${u.n}. ${esc(u.title)}</h2>
  ${u.lessons.map(l0 => { const l = lessonById[l0.id]; return `<section class="note" data-u="${u.id}" id="n-${l.id}">
    <div class="head"><h3>${l.id} ${esc(l.title)}</h3><span>${esc(l.head)}</span>${l.exam.length ? '' : '<span class="tag fill">gap fill</span>'}<a href="index.html#/${l.id}">open the page</a></div>
    <h4>Objectives</h4><ul>${l.obj.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
    ${l.exam.length ? `<h4>Prepares for</h4><ul>${l.exam.map(x => { const it = ITEMS.find(i => i.id === x); const e = EXAMS.find(e => e.id === it.exam); return `<li>${esc(e.title)} Q${it.n}: ${esc(it.skill)}</li>`; }).join('')}</ul>` : ''}
    ${l.gap ? `<h4>${l.exam.length ? 'Added beyond the exam' : 'Why it is in the course'}</h4><p>${esc(l.gap)}</p>` : ''}
    <h4>Common errors</h4><ul>${l.traps.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
    <h4>Questions to ask</h4><ul>${l.ask.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
    <h4>The model</h4><p>${esc(l.figure)}.${l.id === '1.1' ? ' Built.' : ' Planned.'}</p>
  </section>`; }).join('')}`).join('');

main.innerHTML = `
  <h1>Teachers’ notes</h1>
  <p>Every Mole is a book of ${LESSONS.length} lessons in four parts, written to prepare students for the four course exams. Each lesson is one spread. The left page carries the idea, the key equation, any rules to keep, and the key words. The right page runs predict, explain, a worked example revealed a step at a time, and a question to try that earns a stamp.</p>
  <p>The order of the lessons was worked out backwards from the exams. Every exam item was broken into the concepts it depends on; every concept was given to the lesson where it is first needed; and every lesson lists what it builds on. A script (<code>tools/check.mjs</code>) then checks that nothing is used before it is taught. Where an exam item depended on something the exams never test on its own, a lesson or a paragraph was added, and it is marked below.</p>
  <div class="stats"><div><b>${LESSONS.length}</b>lessons</div><div><b>${Object.keys(CONCEPTS).length}</b>key concepts</div><div><b>${ITEMS.length}</b>exam items mapped</div><div><b>${fills.length}</b>lessons added to fill gaps</div><div><b>${noted.length - fills.length}</b>more with added material</div></div>
  <nav class="toc" aria-label="On this page"><a href="#progression">Progression</a><a href="#gaps">Gaps filled</a><a href="#coverage">Exam coverage</a><a href="#prior">Assumed knowledge</a><a href="#outside">Not in this course</a>${UNITS.map(u => `<a href="#notes-${u.id}">Part ${u.n} notes</a>`).join('')}</nav>

  <h2 id="progression">Progression</h2>
  <p>Read each row as: this lesson introduces these concepts, depends on those earlier lessons, and prepares for these exam items.</p>
  ${progression}

  <h2 id="gaps">Gaps filled</h2>
  <p>These ${fills.length} lessons prepare for no exam item directly. Each is here because later lessons, and exam items, cannot be done without it.</p>
  <div class="scroll"><table><thead><tr><th>Lesson</th><th>Topic</th><th>Why it was added</th></tr></thead><tbody>
  ${fills.map(l => `<tr data-u="${l.unit}"><td class="n">${link(l.id)}</td><td><b>${esc(l.title)}</b><br>${esc(l.head)}</td><td>${esc(l.gap)}</td></tr>`).join('')}</tbody></table></div>
  <p style="margin-top:14px">These ${noted.length - fills.length} lessons do prepare for exam items, and also carry something the exams leave out.</p>
  <div class="scroll"><table><thead><tr><th>Lesson</th><th>Topic</th><th>What was added and why</th></tr></thead><tbody>
  ${noted.filter(l => l.exam.length).map(l => `<tr data-u="${l.unit}"><td class="n">${link(l.id)}</td><td><b>${esc(l.title)}</b></td><td>${esc(l.gap)}</td></tr>`).join('')}</tbody></table></div>

  <h2 id="coverage">Exam coverage</h2>
  <p>Every item on every exam, with the lesson or lessons that prepare for it. Items are described by skill only; no exam wording, numbers or answers appear in this book, and no worked example reuses an exam’s numbers.</p>
  ${coverage}

  <h2 id="prior">Assumed knowledge</h2>
  <p>The book teaches its own chemistry from the first page. It assumes this mathematics:</p>
  <ul>${Object.values(PRIOR).map(p => `<li>${esc(p)}</li>`).join('')}</ul>
  <p>Natural logarithms are not assumed: lesson 4.5 introduces them where they are first used.</p>

  <h2 id="outside">Not in this course</h2>
  <p>The four exams do not test the topics below, so the book does not teach them. They are part of a full AP Chemistry course, and a class sitting the AP exam will need them from elsewhere.</p>
  <div class="scroll"><table><thead><tr><th>Topic</th><th>AP unit</th><th>Note</th></tr></thead><tbody>${OUTSIDE.map(o => `<tr><td>${esc(o.topic)}</td><td class="n">${esc(o.ap)}</td><td>${esc(o.note ?? '')}</td></tr>`).join('')}</tbody></table></div>

  ${notes}`;

document.getElementById('printBtn').addEventListener('click', () => print());
const pb = document.getElementById('projBtn');
const setProj = on => { document.documentElement.classList.toggle('projector', on); pb.setAttribute('aria-pressed', String(on)); };
setProj(store.get('projector') === 1);
pb.addEventListener('click', () => { const on = !document.documentElement.classList.contains('projector'); setProj(on); store.set('projector', on ? 1 : 0); });
if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
