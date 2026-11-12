import { UNITS, LESSONS, lessonById, GLOSSARY, CONCEPTS } from './data/index.js';
import { esc, store, readNumber, closeEnough } from './ui.js';
import { mountModel } from './model-1-1.js';

const book = document.getElementById('book');
const done = () => store.get('done') ?? {};
const markDone = id => { const d = done(); if (!d[id]) { d[id] = 1; store.set('done', d); } };

function cover() {
  const d = done();
  document.title = 'Every Mole · a chemistry book in four parts';
  book.innerHTML = `<article class="spread single"><div class="page cover">
    <h1>Every <em>Mole</em></h1>
    <p class="lede">${LESSONS.length} short lessons in four parts, from weighing out atoms to finding how fast they react. One idea to a page.</p>
    <p class="how">On every spread: tick a prediction, lift the flap to see why, follow a worked example, then try one yourself to earn the stamp.</p>
    <div class="parts">${UNITS.map(u => `<section class="part" data-u="${u.id}">
      <h2><small>Part ${u.n}</small>${esc(u.title)}</h2><p>${esc(u.blurb)}</p>
      <ol>${u.lessons.map(l => `<li><a href="#/${l.id}"><span class="n">${l.id}</span><span>${esc(l.title)}${d[l.id] ? '<span class="done" title="Stamp earned">✓</span>' : ''}</span><span class="h">${esc(l.head)}</span></a></li>`).join('')}</ol>
    </section>`).join('')}</div>
    <p class="legend">Each part ends with one of the course exams: Part 1 with Exam 1, Part 2 with Exam 2, Part 3 with Exam 3 and Part 4 with the Final. Stamps are remembered on this device only.</p>
  </div></article>`;
}

function glossary() {
  document.title = 'Glossary · Every Mole';
  book.innerHTML = `<article class="spread single"><div class="page cover">
    <p class="lesson-no">${GLOSSARY.length} key words</p><h1 class="title">Glossary</h1>
    <p>Each word is defined on the page where it is first needed. The number after a definition is that page.</p>
    <dl class="gloss">${GLOSSARY.map(c => `<div data-u="${lessonById[c.lesson].unit}" id="g-${c.id}"><dt>${esc(c.term)}</dt> <dd>${esc(c.def)}</dd> <a href="#/${c.lesson}">${c.lesson}</a></div>`).join('')}</dl>
  </div></article>`;
}

function lesson(l) {
  document.title = `${l.id} ${l.title} · Every Mole`;
  const prev = LESSONS[l.index - 1], next = LESSONS[l.index + 1];
  const keys = Object.entries(l.teach);
  book.innerHTML = `<article class="spread" data-u="${l.unit}">
    <section class="page left">
      <div class="runhead"><span><b>Part ${l.unitN}</b> ${esc(l.unitTitle)}</span><span>${esc(l.head)}</span></div>
      <p class="lesson-no">Lesson ${l.id}</p>
      <h1 class="title">${esc(l.title)}</h1>
      <div class="idea">${l.idea.map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="eq"><div class="sym">${esc(l.eq.sym)}</div><div class="words">${esc(l.eq.words)}</div></div>
      ${l.info ? `<h2 class="k">Rules and facts for this page</h2><ul class="info">${l.info.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      <h2 class="k">Key words</h2>
      <dl class="keys">${keys.map(([, [t, d]]) => `<div><dt>${esc(t)}</dt> <dd>${esc(d)}</dd></div>`).join('')}</dl>
      ${l.needs.some(n => CONCEPTS[n]) ? `<h2 class="k">You will need</h2><p style="font-size:15px">${[...new Map(l.needs.filter(n => CONCEPTS[n]).map(n => [CONCEPTS[n].lesson, n])).keys()].sort((a, b) => lessonById[a].index - lessonById[b].index).map(id => `<a href="#/${id}">${id} ${esc(lessonById[id].title)}</a>`).join(' · ')}</p>` : ''}
    </section>
    <section class="page right">
      <div class="runhead"><span>${esc(l.figure)}</span><span>${l.index + 1} of ${LESSONS.length}</span></div>
      <div id="model"></div>
      <div class="step" id="predict"><h2><i>Predict</i> Before you read on</h2><p class="q">${esc(l.predict.q)}</p>
        <div class="opts">${l.predict.opts.map((o, i) => `<button type="button" data-i="${i}">${esc(o)}</button>`).join('')}</div><div class="out" aria-live="polite"></div></div>
      <div class="step" id="worked"><h2><i>Watch</i> A worked example</h2><p class="q">${esc(l.worked.q)}</p>
        <ol class="steps">${l.worked.steps.map((s, i) => `<li${i ? ' hidden' : ''}>${esc(s)}</li>`).join('')}</ol>
        <p class="ans" hidden>${esc(l.worked.ans)}</p>
        <p style="margin-top:8px"><button class="btn2 ghost" type="button" id="nextStep">Next step</button></p></div>
      <div class="step" id="try"><h2><i>Try</i> Your turn</h2><p class="q">${esc(l.try.q)}</p>
        ${l.try.opts ? `<div class="opts">${l.try.opts.map((o, i) => `<button type="button" data-i="${i}">${esc(o)}</button>`).join('')}</div>`
          : `<form class="tryrow"><label class="sr" for="ans">Your answer</label><input id="ans" inputmode="decimal" autocomplete="off" placeholder="your answer"><span class="unit">${esc(l.try.unit ?? '')}</span><button class="btn2" type="submit">Check</button></form>`}
        <div class="out" aria-live="polite"></div></div>
    </section></article>
    <nav class="turn" aria-label="Turn the page">${prev ? `<a href="#/${prev.id}" rel="prev">‹ ${prev.id} ${esc(prev.title)}</a>` : '<a href="#/">‹ Contents</a>'}<span></span>${next ? `<a href="#/${next.id}" rel="next">${next.id} ${esc(next.title)} ›</a>` : '<a href="#/glossary">Glossary ›</a>'}</nav>`;

  const stamp = () => { markDone(l.id); const t = book.querySelector('#try'); if (!t.querySelector('.stamp')) t.insertAdjacentHTML('beforeend', '<span class="stamp">DONE</span>'); };
  if (done()[l.id]) stamp();

  // the model: built for lesson 1.1, described for the rest
  const model = book.querySelector('#model');
  if (l.id === '1.1') mountModel(model, stamp);
  else model.innerHTML = `<div class="figure"><p class="cap">${esc(l.figure)}</p><p class="todo">The working model for this page is planned but not built yet. Lesson 1.1 shows what one looks like.</p></div>`;

  // predict, then lift the flap
  const pr = book.querySelector('#predict');
  pr.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const i = Number(b.dataset.i), ok = i === l.predict.a;
    pr.querySelectorAll('button').forEach((x, j) => { x.disabled = true; if (j === l.predict.a) x.classList.add('right-ans'); else if (j === i) x.classList.add('wrong-ans'); });
    pr.querySelector('.out').innerHTML = `<div class="flap"><b class="verdict ${ok ? 'ok' : 'no'}">${ok ? 'Yes.' : 'Not quite.'}</b>${esc(l.explain)}</div>`;
  }));

  // worked example, one step at a time
  const wk = book.querySelector('#worked'), nextBtn = wk.querySelector('#nextStep');
  nextBtn.addEventListener('click', () => {
    const hidden = wk.querySelector('li[hidden]');
    if (hidden) hidden.hidden = false;
    if (!wk.querySelector('li[hidden]')) { wk.querySelector('.ans').hidden = false; nextBtn.parentElement.remove(); }
  });

  // try it
  const tr = book.querySelector('#try'), out = tr.querySelector('.out');
  let misses = 0;
  const wrong = () => { misses++; out.innerHTML = `<p class="hint"><b style="color:var(--bad);font-style:normal">Not yet.</b> ${esc(l.try.hint ?? 'Look back at the worked example.')}${misses > 1 && !l.try.opts ? ` <button class="btn2 ghost" type="button" id="show" style="margin-left:6px;font-style:normal">Show the answer</button>` : ''}</p>`; out.querySelector('#show')?.addEventListener('click', () => { out.innerHTML = `<p class="ans">${esc(String(l.try.val))} ${esc(l.try.unit ?? '')}</p>`; }); };
  if (l.try.opts) tr.querySelectorAll('.opts button').forEach(b => b.addEventListener('click', () => {
    const i = Number(b.dataset.i);
    if (i === l.try.a) { tr.querySelectorAll('.opts button').forEach(x => { x.disabled = true; }); b.classList.add('right-ans'); out.innerHTML = '<div class="flap"><b class="verdict ok">Right.</b></div>'; stamp(); }
    else { b.classList.add('wrong-ans'); b.disabled = true; wrong(); }
  }));
  else tr.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const given = readNumber(tr.querySelector('#ans').value);
    if (closeEnough(given, l.try.val)) { out.innerHTML = `<div class="flap"><b class="verdict ok">Right: ${esc(String(l.try.val))} ${esc(l.try.unit ?? '')}</b></div>`; stamp(); }
    else wrong();
  });
}

function route() {
  const id = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  if (lessonById[id]) lesson(lessonById[id]); else if (id === 'glossary') glossary(); else cover();
  window.scrollTo(0, 0);
}
addEventListener('hashchange', route);
addEventListener('keydown', e => {
  if (e.target.closest('input, button, a, select, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
  const cur = lessonById[decodeURIComponent(location.hash.replace(/^#\/?/, ''))];
  if (e.key === 'ArrowRight') location.hash = cur ? (LESSONS[cur.index + 1] ? '#/' + LESSONS[cur.index + 1].id : '#/glossary') : '#/' + LESSONS[0].id;
  if (e.key === 'ArrowLeft' && cur) location.hash = cur.index ? '#/' + LESSONS[cur.index - 1].id : '#/';
});
route();
