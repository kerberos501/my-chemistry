// A review page: practice questions for one exam. Answer first, then show the working a step at a time.
import { lessonById } from './data/index.js';
import { esc, store } from './ui.js';

const readSigned = text => { const s = String(text).trim().replace(/[−–]/g, '-').replace(/^\+/, ''); return /^-?\d+$/.test(s) ? Number(s) : NaN; };

export function reviewPage(book, r, focus, nav) {
  document.title = `${r.title} · My Chemistry`;
  let first = store.get('rev:' + r.id) ?? {};   // question number → 1 if right at the first attempt, 0 if not
  const tag = n => (first[n] === 1 ? '<span class="tag fill">right first time</span>' : first[n] === 0 ? '<span class="tag">tried before</span>' : '');
  const card = q => `<section class="step rq" id="q${q.n}" data-n="${q.n}">
      <div class="meta"><b>Question ${q.n}</b><span>about ${q.min} min</span><a href="#/${q.lesson}">Lesson ${q.lesson}: ${esc(lessonById[q.lesson].title)}</a><span class="was">${tag(q.n)}</span></div>
      <p class="q">${esc(q.q)}</p>${q.rxn ? `<p class="rxn">${esc(q.rxn)}</p>` : ''}${q.given ? `<p class="given">${esc(q.given)}</p>` : ''}
      ${q.opts ? `<div class="opts">${q.opts.map((o, i) => `<button type="button" data-i="${i}"><b>${'ABCDE'[i]}.</b> ${esc(o)}</button>`).join('')}</div>`
        : `<form class="parts">${q.parts.map(([label], i) => `<label><input data-p="${i}" inputmode="text" autocomplete="off" aria-label="Oxidation number of ${esc(label)}" placeholder="e.g. +2"><span>${'abcde'[i]}. ${esc(label)}</span></label>`).join('')}<div><button class="btn2" type="submit">Check</button></div></form>`}
      <div class="out" aria-live="polite"></div>
      <ol class="steps" hidden>${q.steps.map(s => `<li hidden>${esc(s)}</li>`).join('')}</ol><p class="key" hidden>Key idea: ${esc(q.key)}</p>
      <div class="acts"><button class="btn2 ghost" type="button" data-show>Show the working</button></div>
    </section>`;
  book.innerHTML = `<article class="spread single" data-u="${r.unit}"><div class="page cover">
      <p class="lesson-no">Review · ${r.questions.length} questions</p>
      <div class="rev-head"><h1 class="title" style="margin-bottom:0">${esc(r.title)}</h1><span class="score" id="score" aria-live="polite"></span></div>
      <p style="max-width:44em">${esc(r.sub)}. Answer each question first, then show the working one step at a time. Every question links back to the lesson that teaches it. Your score is remembered on this device only.</p>
      <p style="margin-top:10px"><button class="btn2 ghost sm" type="button" id="again">Clear my answers and start again</button></p>
      <div class="rev-list">${r.questions.map(card).join('')}</div>
    </div></article>${nav}`;

  const score = () => { const v = Object.values(first); book.querySelector('#score').textContent = v.length ? `${v.filter(Boolean).length} right first time, ${v.length} of ${r.questions.length} tried` : ''; };
  const record = (n, ok) => { if (first[n] === undefined) { first[n] = ok ? 1 : 0; store.set('rev:' + r.id, first); score(); } };
  book.querySelector('#again').addEventListener('click', () => { store.set('rev:' + r.id, {}); reviewPage(book, r, null, nav); window.scrollTo(0, 0); });

  for (const q of r.questions) {
    const el = book.querySelector('#q' + q.n), out = el.querySelector('.out'), show = el.querySelector('[data-show]');
    const finish = () => {   // the working is fully shown: mark the answer and close the question
      el.querySelectorAll('.opts button').forEach((b, i) => { b.disabled = true; if (i === q.a) b.classList.add('right-ans'); });
      el.querySelectorAll('.parts input').forEach((inp, i) => { if (inp.value.trim() === '') inp.value = (q.parts[i][1] > 0 ? '+' : '') + String(q.parts[i][1]).replace('-', '−'); inp.disabled = true; });
      el.querySelector('.key').hidden = false; show.parentElement.remove();
    };
    show.addEventListener('click', () => {
      record(q.n, false);
      el.querySelector('.steps').hidden = false;
      const next = el.querySelector('.steps li[hidden]');
      if (next) next.hidden = false;
      if (el.querySelector('.steps li[hidden]')) show.textContent = 'Next step'; else finish();
    });
    el.querySelectorAll('.opts button').forEach(b => b.addEventListener('click', () => {
      const ok = Number(b.dataset.i) === q.a;
      record(q.n, ok);
      if (ok) { el.querySelectorAll('.opts button').forEach(x => { x.disabled = true; }); b.classList.add('right-ans'); out.innerHTML = '<div class="flap"><b class="verdict ok">Right.</b>Show the working to check your method.</div>'; }
      else { b.classList.add('wrong-ans'); b.disabled = true; out.innerHTML = '<p class="hint"><b style="color:var(--bad);font-style:normal">Not yet.</b> Try another, or show the working.</p>'; }
    }));
    el.querySelector('.parts')?.addEventListener('submit', e => {
      e.preventDefault();
      let right = 0;
      el.querySelectorAll('.parts input').forEach((inp, i) => { const ok = readSigned(inp.value) === q.parts[i][1]; right += ok; inp.classList.toggle('right-ans', ok); inp.classList.toggle('wrong-ans', !ok); });
      record(q.n, right === q.parts.length);
      out.innerHTML = right === q.parts.length ? '<div class="flap"><b class="verdict ok">All five right.</b>Show the working to check your method.</div>' : `<p class="hint"><b style="color:var(--bad);font-style:normal">${right} of ${q.parts.length} right.</b> Fix the ones outlined in red, or show the working.</p>`;
    });
  }
  score();
  if (focus) book.querySelector('#' + CSS.escape(focus))?.scrollIntoView();
}
