// Working models for Part 1, lessons 1.2 to 1.7.
import { mm } from './chem.js';
import { esc, sci, subn, supn, chg, ionic, shell, chips, onChips, slider, SVGT } from './model-kit.js';

/* 1.2 Measured numbers: count significant figures; flip conversion factors until the units cancel. */
function sigfigs(text) {
  const man = text.trim().split(/[e×x]/i)[0], hasDot = man.includes('.');
  const digits = [...man].map((ch, i) => (/\d/.test(ch) ? i : -1)).filter(i => i >= 0);
  const first = digits.find(i => man[i] !== '0'), last = [...digits].reverse().find(i => man[i] !== '0');
  let n = 0, amb = 0;
  const html = [...man].map((ch, i) => {
    if (!/\d/.test(ch)) return esc(ch);
    if (first === undefined || i < first) return `<span class="ns">${ch}</span>`;
    if (!hasDot && i > last) { amb++; return `<b class="sf amb">${ch}</b>`; }
    n++; return `<b class="sf">${ch}</b>`;
  }).join('') + esc(text.trim().slice(man.length));
  return { html, n, amb, ok: digits.length > 0 && /^[-+−]?[\d.]+$/.test(man) };
}
const CONV = [
  { label: '143 pm → cm', start: ['143', 'pm'], target: 'cm', f: [[[1e-12, 'm'], [1, 'pm']], [[100, 'cm'], [1, 'm']]] },
  { label: '0.250 L → mL', start: ['0.250', 'L'], target: 'mL', f: [[[1000, 'mL'], [1, 'L']]] },
  { label: '5.20 nm → pm', start: ['5.20', 'nm'], target: 'pm', f: [[[1e-9, 'm'], [1, 'nm']], [[1, 'pm'], [1e-12, 'm']]] },
  { label: '2.5 kg → mg', start: ['2.5', 'kg'], target: 'mg', f: [[[1000, 'g'], [1, 'kg']], [[1000, 'mg'], [1, 'g']]] },
];
const fnum = v => (v >= 1 ? String(v) : '10' + supn(Math.round(Math.log10(v))));
function m12(host) {
  let p = 0, flip = CONV[0].f.map(() => true);
  const $ = shell(host, { label: 'measured numbers', title: 'Count the figures, cancel the units', sub: 'Two tools for every calculation in the book.',
    body: `<p class="lab">Significant figures: type any measurement</p>
      <div class="tryrow"><label class="sr" for="m12n">A measured number</label><input id="m12n" value="0.02050" autocomplete="off" inputmode="decimal">
      ${['0.02050', '250.', '250', '100.09'].map(v => `<button type="button" class="btn2 ghost sm" data-eg="${v}">${v}</button>`).join('')}</div>
      <p class="big" id="m12d"></p><p class="margin" id="m12c" aria-live="polite"></p>
      <p class="lab" style="margin-top:14px">Conversion factors: flip each one until every unwanted unit cancels</p>
      ${chips('p', CONV.map(c => c.label), 0, 'Conversion')}
      <div class="track" id="m12t"></div><p class="margin" id="m12r" aria-live="polite"></p>` });
  const sf = () => {
    const r = sigfigs($('m12n').value);
    $('m12d').innerHTML = r.ok ? r.html : '';
    $('m12c').innerHTML = !r.ok ? '<small>Type a number such as 0.0450 or 1200</small>'
      : `${r.n} significant figure${r.n === 1 ? '' : 's'}${r.amb ? ' for certain' : ''}<small>${r.amb ? `The ${r.amb} trailing zero${r.amb > 1 ? 's' : ''} may or may not count. A decimal point (“250.”) or 2.50 × 10² settles it.` : 'Count from the first digit that is not zero. Leading zeros only place the decimal point.'}</small>`;
  };
  const track = () => {
    const c = CONV[p], top = [c.start[1]], bot = [];
    let val = Number(c.start[0]);
    c.f.forEach(([a, b], i) => { const [t, d] = flip[i] ? [b, a] : [a, b]; top.push(t[1]); bot.push(d[1]); val *= t[0] / d[0]; });
    const tc = top.map(() => false), bc = bot.map(() => false);
    bot.forEach((u, j) => { const i = top.findIndex((t, k) => t === u && !tc[k]); if (i >= 0) { tc[i] = bc[j] = true; } });
    const unit = (u, cut) => (cut ? `<s>${u}</s>` : `<span>${u}</span>`);
    $('m12t').innerHTML = `<span class="qty">${c.start[0]} ${unit(c.start[1], tc[0])}</span>` + c.f.map(([a, b], i) => {
      const [t, d] = flip[i] ? [b, a] : [a, b];
      return `<span class="x">×</span><span class="fcol"><span class="frac"><span>${fnum(t[0])} ${unit(t[1], tc[i + 1])}</span><span>${fnum(d[0])} ${unit(d[1], bc[i])}</span></span><button type="button" class="btn2 ghost sm" data-flip="${i}" aria-label="Turn factor ${i + 1} upside down">flip ⇅</button></span>`;
    }).join('');
    const left = top.filter((_, i) => !tc[i]), under = bot.filter((_, i) => !bc[i]), ok = !under.length && left.length === 1 && left[0] === c.target;
    const sfn = sigfigs(c.start[0]).n;
    $('m12r').innerHTML = ok ? `= ${sci(val, sfn)} ${c.target} ✓<small>Every unwanted unit cancelled, and the answer keeps the ${sfn} significant figures of ${c.start[0]} ${c.start[1]}. Conversion factors are exact.</small>`
      : `units left: ${left.join('·') || '1'}${under.length ? ' ÷ ' + under.join('·') : ''}<small>That is not ${c.target}. A unit only cancels when it is on top in one place and underneath in another: flip a factor.</small>`;
    $('m12t').querySelectorAll('[data-flip]').forEach(b => b.addEventListener('click', () => { flip[b.dataset.flip] = !flip[b.dataset.flip]; track(); }));
  };
  $('m12n').addEventListener('input', sf);
  host.querySelectorAll('[data-eg]').forEach(b => b.addEventListener('click', () => { $('m12n').value = b.dataset.eg; sf(); }));
  onChips(host, 'p', i => { p = i; flip = CONV[i].f.map(() => true); track(); });
  sf(); track();
}

/* 1.3 Names and formulas: ion tiles as wide as their charge; the formula is right when the two rows are the same length. */
const CAT = [
  { f: 'Na', ch: 1, name: 'sodium' }, { f: 'K', ch: 1, name: 'potassium' }, { f: 'NH₄', ch: 1, name: 'ammonium', poly: true },
  { f: 'Mg', ch: 2, name: 'magnesium' }, { f: 'Ca', ch: 2, name: 'calcium' }, { f: 'Fe', ch: 2, name: 'iron(II)' },
  { f: 'Al', ch: 3, name: 'aluminum' }, { f: 'Fe', ch: 3, name: 'iron(III)' },
];
const AN = [
  { f: 'Cl', ch: 1, name: 'chloride' }, { f: 'OH', ch: 1, name: 'hydroxide', poly: true }, { f: 'NO₃', ch: 1, name: 'nitrate', poly: true },
  { f: 'O', ch: 2, name: 'oxide' }, { f: 'SO₄', ch: 2, name: 'sulfate', poly: true }, { f: 'CO₃', ch: 2, name: 'carbonate', poly: true },
  { f: 'N', ch: 3, name: 'nitride' }, { f: 'PO₄', ch: 3, name: 'phosphate', poly: true },
];
function m13(host) {
  let c = 6, a = 3, nc = 1, na = 1;
  const opt = (list, cur, s) => list.map((x, i) => `<option value="${i}"${i === cur ? ' selected' : ''}>${x.f}${chg(s * x.ch)}  ${x.name}</option>`).join('');
  const step = (id, lab) => `<span class="stepper"><button type="button" data-d="${id}-" aria-label="One fewer ${lab}">−</button><output id="m13n${id}"></output><button type="button" data-d="${id}+" aria-label="One more ${lab}">+</button></span>`;
  const $ = shell(host, { label: 'ion tiles', title: 'Build a formula from ion tiles', sub: 'Each tile is as wide as its charge. Add tiles until the two rows are the same length.',
    body: `<div class="pick"><label>Cation <select id="m13c">${opt(CAT, c, 1)}</select></label>${step('c', 'cation')}
      <label>Anion <select id="m13a">${opt(AN, a, -1)}</select></label>${step('a', 'anion')}</div>
      <svg viewBox="0 0 520 132" role="img" aria-labelledby="m13t"><title id="m13t">A row of cation tiles above a row of anion tiles</title><g id="m13g" ${SVGT}></g></svg>
      <p class="margin" id="m13r" aria-live="polite"></p>
      <p class="challenge"><b>Challenge.</b> Build aluminum sulfate. How many of each ion does one formula unit need, and where do the brackets go? <span id="m13d"></span></p>` });
  const U = 27, X0 = 16;
  const draw = () => {
    const C = CAT[c], A = AN[a], pos = nc * C.ch, neg = na * A.ch;
    const row = (ion, n, y, s, col) => Array.from({ length: n }, (_, i) => `<g transform="translate(${X0 + i * ion.ch * U} ${y})"><rect x="1" width="${ion.ch * U - 2}" height="40" rx="5" fill="${col}" opacity="${s > 0 ? 0.92 : 0.5}"/><rect x="1" width="${ion.ch * U - 2}" height="40" rx="5" fill="none" stroke="currentColor" stroke-width="1.2"/><text x="${ion.ch * U / 2}" y="25" text-anchor="middle" font-size="${ion.ch === 1 ? 10.5 : 13.5}" font-weight="600" ${s > 0 ? 'fill="var(--paper)"' : ''}>${ion.f}${chg(s * ion.ch)}</text></g>`).join('');
    const end = X0 + Math.min(pos, neg) * U;
    $('m13g').innerHTML = row(C, nc, 14, 1, 'var(--part)') + row(A, na, 70, -1, 'var(--part)')
      + `<text x="${X0 + pos * U + 8}" y="39">+${pos}</text><text x="${X0 + neg * U + 8}" y="95">−${neg}</text>`
      + (pos === neg ? `<path d="M${end} 6v118" stroke="var(--good)" stroke-width="2" stroke-dasharray="5 4"/>` : '');
    $('m13nc').textContent = nc; $('m13na').textContent = na;
    const best = ionic(C, A);
    $('m13r').innerHTML = pos !== neg ? `charge left over: ${pos > neg ? '+' : '−'}${Math.abs(pos - neg)}<small>${pos > neg ? 'Too much positive charge: add an anion or take away a cation.' : 'Too much negative charge: add a cation or take away an anion.'}</small>`
      : nc !== best.nc ? `charges cancel, but ${nc} : ${na} is not the smallest ratio<small>Divide both by ${nc / best.nc}: the formula is ${best.f}.</small>`
      : `${best.f} ✓ ${esc(C.name)} ${esc(A.name)}<small>(${nc} × ${C.ch}+) + (${na} × ${A.ch}−) = 0.${A.poly && na > 1 || C.poly && nc > 1 ? ' The brackets keep the polyatomic ion together; the subscript outside counts whole ions.' : ''}</small>`;
    if (C.name === 'aluminum' && A.name === 'sulfate' && nc === 2 && na === 3) host.dataset.hit = '1';
    $('m13d').textContent = host.dataset.hit ? 'Done: Al₂(SO₄)₃, two Al³⁺ and three SO₄²⁻.' : '';
  };
  $('m13c').addEventListener('change', e => { c = Number(e.target.value); nc = na = 1; draw(); });
  $('m13a').addEventListener('change', e => { a = Number(e.target.value); nc = na = 1; draw(); });
  host.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => {
    const up = b.dataset.d.endsWith('+') ? 1 : -1, isC = b.dataset.d.startsWith('c');
    const n = Math.max(1, Math.min(6, (isC ? nc : na) + up));
    if (n * (isC ? CAT[c] : AN[a]).ch > 12) return;
    if (isC) nc = n; else na = n;
    draw();
  }));
  draw();
}

/* 1.4 The mole: the same mass of two substances holds different numbers of particles. */
const SUBS = [
  { f: 'C', name: 'carbon', unit: 'atoms' }, { f: 'Mg', name: 'magnesium', unit: 'atoms' }, { f: 'Fe', name: 'iron', unit: 'atoms' },
  { f: 'H2O', name: 'water', unit: 'molecules' }, { f: 'NaCl', name: 'sodium chloride', unit: 'formula units' }, { f: 'CaCO3', name: 'calcium carbonate', unit: 'formula units' },
];
function m14(host) {
  let sel = [0, 1], mass = 12.0;
  const pick = k => `<label>${k ? 'Right' : 'Left'} pan <select data-s="${k}">${SUBS.map((s, i) => `<option value="${i}"${i === sel[k] ? ' selected' : ''}>${s.name} (${subn(s.f)})</option>`).join('')}</select></label>`;
  const $ = shell(host, { label: 'counting by weighing', title: 'Same mass, different count', sub: 'Both pans hold the same mass. Each dot is 0.1 mol: 6.022 × 10²² particles.',
    body: `<div class="pick">${pick(0)}${pick(1)}</div>
      <svg viewBox="0 0 520 220" role="img" aria-labelledby="m14t"><title id="m14t">Two pans holding the same mass of two substances, drawn as dots of 0.1 mol each</title><g id="m14g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m14r', 'Mass in each pan', 1, 100, 0.1, mass)}</div>
      <p class="margin" id="m14e" aria-live="polite"></p>
      <p class="challenge"><b>Challenge.</b> Put magnesium in one pan and find the mass that is exactly 1.00 mol of it. How many moles is the same mass of the other substance? <span id="m14d"></span></p>` });
  const draw = () => {
    const out = sel.map((si, k) => {
      const s = SUBS[si], M = mm(s.f), n = mass / M, dots = Math.round(n * 10), x0 = 40 + k * 250;
      let g = `<g transform="translate(${x0} 0)"><path d="M0 60v118a6 6 0 0 0 6 6h178a6 6 0 0 0 6-6V60" fill="var(--paper)" stroke="currentColor" stroke-width="1.6"/>`;
      for (let i = 0; i < dots; i++) g += `<circle cx="${14 + (i % 12) * 14.7}" cy="${172 - Math.floor(i / 12) * 14.7}" r="5.6" fill="var(--part)" opacity="${k ? 0.5 : 0.9}"/>`;
      return { g: g + `<text x="95" y="24" text-anchor="middle" font-weight="650" font-size="16">${n.toPrecision(3)} mol</text><text x="95" y="44" text-anchor="middle" font-size="12.5">${sci(n * 6.022e23)} ${s.unit}</text><text x="95" y="204" text-anchor="middle">${mass.toFixed(1)} g ${subn(s.f)}  (M = ${M.toFixed(2)})</text></g>`, s, M, n };
    });
    $('m14g').innerHTML = out.map(o => o.g).join('');
    $('m14r' + 'o').textContent = `${mass.toFixed(1)} g`;
    const [L, R] = out;
    $('m14e').innerHTML = `n = m ÷ M = ${mass.toFixed(1)} g ÷ ${L.M.toFixed(2)} g/mol = ${L.n.toPrecision(3)} mol ${subn(L.s.f)}<small>${Math.abs(L.M - R.M) < 0.01 ? 'Same molar mass, same count.' : `${L.M < R.M ? esc(L.s.name) : esc(R.s.name)} has the lighter particles, so the same mass holds more of them: ${(Math.max(L.n, R.n) / Math.min(L.n, R.n)).toPrecision(3)} times as many.`}</small>`;
    if (out.some(o => o.s.f === 'Mg' && Math.abs(mass - o.M) < 0.06)) host.dataset.hit = '1';
    $('m14d').textContent = host.dataset.hit ? 'Done: 24.3 g of magnesium is 1.00 mol.' : '';
  };
  host.querySelectorAll('[data-s]').forEach(el => el.addEventListener('change', () => { sel[el.dataset.s] = Number(el.value); draw(); }));
  $('m14r').addEventListener('input', e => { mass = Number(e.target.value); draw(); });
  draw();
}

/* 1.5 Balanced equations: change coefficients and watch the atom count on each side. */
const ELC = { H: '#7d8894', O: '#c8452c', C: '#4a5262', N: '#2f6fb5', Al: '#8a4fa3', Fe: '#9a6b2f', Mg: '#23794c' };
export const molecule = (atoms, cls = '') => `<span class="mol ${cls}">${Object.entries(atoms).flatMap(([el, n]) => Array.from({ length: n }, () => `<i style="background:${ELC[el]}">${el}</i>`)).join('')}</span>`;
const EQS = [
  { L: [['H₂', { H: 2 }], ['O₂', { O: 2 }]], R: [['H₂O', { H: 2, O: 1 }]], ans: [2, 1, 2] },
  { L: [['N₂', { N: 2 }], ['H₂', { H: 2 }]], R: [['NH₃', { N: 1, H: 3 }]], ans: [1, 3, 2] },
  { L: [['Al', { Al: 1 }], ['O₂', { O: 2 }]], R: [['Al₂O₃', { Al: 2, O: 3 }]], ans: [4, 3, 2] },
  { L: [['CH₄', { C: 1, H: 4 }], ['O₂', { O: 2 }]], R: [['CO₂', { C: 1, O: 2 }], ['H₂O', { H: 2, O: 1 }]], ans: [1, 2, 1, 2] },
  { L: [['Fe', { Fe: 1 }], ['O₂', { O: 2 }]], R: [['Fe₂O₃', { Fe: 2, O: 3 }]], ans: [4, 3, 2] },
];
function m15(host) {
  let e = 0, k = [1, 1, 1];
  const $ = shell(host, { label: 'balancing equations', title: 'Balance it: atoms in, atoms out', sub: 'Change the coefficients (never the formulas) until every element has the same count on both sides.',
    body: `${chips('e', EQS.map(q => [...q.L, ...q.R].map(s => s[0]).join(' · ')), 0, 'Equation')}
      <div class="eqrow" id="m15q"></div>
      <div class="pans"><div><p class="lab">Reactants</p><div class="pan" id="m15l"></div></div><div><p class="lab">Products</p><div class="pan" id="m15p"></div></div></div>
      <table class="tally" id="m15t"></table><p class="margin" id="m15r" aria-live="polite"></p>` });
  const draw = () => {
    const q = EQS[e], sp = [...q.L, ...q.R], nL = q.L.length;
    $('m15q').innerHTML = sp.map(([f], i) => `${i === nL ? '<span class="arrow">→</span>' : i ? '<span class="arrow">+</span>' : ''}<span class="term"><span class="stepper"><button type="button" data-k="${i}-" aria-label="Lower the coefficient of ${f}">−</button><output>${k[i]}</output><button type="button" data-k="${i}+" aria-label="Raise the coefficient of ${f}">+</button></span><b>${f}</b></span>`).join('');
    const pan = (list, off) => list.map(([, atoms], i) => Array.from({ length: k[off + i] }, () => molecule(atoms)).join('')).join('<span class="gap"></span>');
    $('m15l').innerHTML = pan(q.L, 0); $('m15p').innerHTML = pan(q.R, nL);
    const count = (list, off) => { const t = {}; list.forEach(([, atoms], i) => { for (const [el, n] of Object.entries(atoms)) t[el] = (t[el] ?? 0) + n * k[off + i]; }); return t; };
    const l = count(q.L, 0), r = count(q.R, nL), els = Object.keys(l), ok = els.every(el => l[el] === r[el]);
    $('m15t').innerHTML = `<tr><th>Element</th><th>Reactant side</th><th>Product side</th><th></th></tr>` + els.map(el => `<tr><td><i class="dot" style="background:${ELC[el]}"></i>${el}</td><td>${l[el]}</td><td>${r[el]}</td><td class="${l[el] === r[el] ? 'ok' : 'no'}">${l[el] === r[el] ? '✓ equal' : '✗ ' + (l[el] > r[el] ? 'short on the right' : 'short on the left')}</td></tr>`).join('');
    const g = k.reduce((a, b) => { while (b) [a, b] = [b, a % b]; return a; });
    $('m15r').innerHTML = !ok ? `not balanced yet<small>Start with an element that appears in only one formula on each side. Leave O₂ or H₂ until last.</small>`
      : g > 1 ? `balanced, but not the simplest recipe<small>Divide every coefficient by ${g}.</small>`
      : `balanced ✓  ${sp.map(([f], i) => `${k[i]} mol ${f}`).join(' : ')}<small>The coefficients are a recipe in moles: any two of them make a mole ratio.</small>`;
    $('m15q').querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.k, 10); k[i] = Math.max(1, Math.min(6, k[i] + (b.dataset.k.endsWith('+') ? 1 : -1))); draw(); }));
  };
  onChips(host, 'e', i => { e = i; k = [...EQS[i].L, ...EQS[i].R].map(() => 1); draw(); });
  draw();
}

/* 1.6 Mass to mass: a bridge of three spans. Only the middle span crosses from one substance to the other. */
const BR = [
  { eq: 'CaCO₃ → CaO + CO₂', A: 'CaCO3', B: 'CO2', a: 1, b: 1 },
  { eq: 'N₂ + 3 H₂ → 2 NH₃', A: 'N2', B: 'NH3', a: 1, b: 2 },
  { eq: '2 Mg + O₂ → 2 MgO', A: 'Mg', B: 'MgO', a: 2, b: 2 },
  { eq: '4 Al + 3 O₂ → 2 Al₂O₃', A: 'Al', B: 'Al2O3', a: 4, b: 2 },
];
function m16(host) {
  let p = 0, g = 10.0;
  const $ = shell(host, { label: 'the mole bridge', title: 'Cross the bridge: grams, moles, moles, grams', sub: 'Pick a reaction and a starting mass. Every mass-to-mass problem crosses the same three spans.',
    body: `${chips('p', BR.map(r => r.eq), 0, 'Reaction')}
      <svg viewBox="0 0 520 190" role="img" aria-labelledby="m16t"><title id="m16t">A bridge of four piers: grams of A, moles of A, moles of B, grams of B</title><g id="m16g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m16r', 'Starting mass', 1, 100, 0.1, g)}</div>
      <p class="margin" id="m16e" aria-live="polite"></p>
      <p class="challenge"><b>Challenge.</b> Choose N₂ + 3 H₂ → 2 NH₃ and start with 1.0 g of N₂. The equation says “1 N₂ makes 2 NH₃”. Does 1 g make 2 g?</p>` });
  const draw = () => {
    const r = BR[p], MA = mm(r.A), MB = mm(r.B), nA = g / MA, nB = nA * r.b / r.a, gB = nB * MB, fa = subn(r.A), fb = subn(r.B);
    const pier = (x, top, val, unit, f, B) => `<g transform="translate(${x} 0)"><rect y="92" width="104" height="64" rx="5" fill="${B ? 'color-mix(in srgb, var(--part) 16%, var(--paper))' : 'var(--paper-2)'}" stroke="currentColor" stroke-width="1.5"/><text x="52" y="118" text-anchor="middle" font-size="17" font-weight="650">${val}</text><text x="52" y="140" text-anchor="middle">${unit} ${f}</text><text x="52" y="176" text-anchor="middle" font-size="12" font-style="italic">${top}</text></g>`;
    const span = (x, l1, l2, hot) => `<path d="M${x} 90q43 -52 86 0" fill="none" stroke="${hot ? 'var(--part)' : 'currentColor'}" stroke-width="${hot ? 2.6 : 1.6}"/><path d="M${x + 78} 78l8 12 5-14" fill="none" stroke="${hot ? 'var(--part)' : 'currentColor'}" stroke-width="${hot ? 2.6 : 1.6}" stroke-linecap="round" stroke-linejoin="round"/><text x="${x + 43}" y="${l2 ? 30 : 44}" text-anchor="middle" font-size="12.5" ${hot ? 'fill="var(--part)" font-weight="650"' : ''}>${l1}</text>${l2 ? `<text x="${x + 43}" y="46" text-anchor="middle" font-size="12.5" ${hot ? 'fill="var(--part)" font-weight="650"' : ''}>${l2}</text>` : ''}`;
    $('m16g').innerHTML = pier(4, 'mass of A', g.toFixed(1), 'g', fa) + pier(140, 'moles of A', nA.toPrecision(3), 'mol', fa) + pier(276, 'moles of B', nB.toPrecision(3), 'mol', fb, 1) + pier(412, 'mass of B', gB.toPrecision(3), 'g', fb, 1)
      + span(65, `÷ ${MA.toFixed(2)} g/mol`) + span(201, `× ${r.b} mol ${fb}`, `÷ ${r.a} mol ${fa}`, 1) + span(337, `× ${MB.toFixed(2)} g/mol`);
    $('m16r' + 'o').textContent = `${g.toFixed(1)} g ${fa}`;
    $('m16e').innerHTML = `${g.toFixed(1)} g ${fa} → ${gB.toPrecision(3)} g ${fb}<small>The coloured span is the mole ratio from the equation: the only step that crosses from ${fa} to ${fb}. The ratio counts moles, not grams, so the masses are not in the ratio ${r.a} : ${r.b}.</small>`;
  };
  onChips(host, 'p', i => { p = i; draw(); });
  $('m16r').addEventListener('input', e => { g = Number(e.target.value); draw(); });
  draw();
}

/* 1.7 Limiting reactant: two hoppers drain in the ratio of the equation; one empties first. */
const LIM = [
  { eq: 'N₂ + 3 H₂ → 2 NH₃', A: 'N₂', B: 'H₂', P: 'NH₃', a: 1, b: 3, c: 2, nA: 2, nB: 3 },
  { eq: '2 H₂ + O₂ → 2 H₂O', A: 'H₂', B: 'O₂', P: 'H₂O', a: 2, b: 1, c: 2, nA: 3, nB: 2 },
  { eq: '2 Al + 3 Cl₂ → 2 AlCl₃', A: 'Al', B: 'Cl₂', P: 'AlCl₃', a: 2, b: 3, c: 2, nA: 3, nB: 3 },
];
function m17(host) {
  let r = LIM[0], nA = r.nA, nB = r.nB, prog = 0;
  const $ = shell(host, { label: 'limiting reactant', title: 'Which hopper empties first?', sub: 'Set the moles of each reactant, then run the reaction. The hoppers drain in the ratio of the equation.',
    body: `${chips('r', LIM.map(x => x.eq), 0, 'Reaction')}
      <svg viewBox="0 0 520 226" role="img" aria-labelledby="m17t"><title id="m17t">Two reactant hoppers and a product jar, with a bar for moles divided by coefficient under each reactant</title><g id="m17g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m17a', 'Reactant 1', 0.5, 5, 0.1, nA)}${slider('m17b', 'Reactant 2', 0.5, 5, 0.1, nB)}${slider('m17p', 'Run the reaction', 0, 100, 1, 0)}</div>
      <p class="margin" id="m17e" aria-live="polite"></p>
      <p class="challenge"><b>Challenge.</b> Find amounts where both hoppers empty together and nothing is left over. What is special about their ratio? <span id="m17d"></span></p>` });
  const draw = () => {
    const qa = nA / r.a, qb = nB / r.b, xi = Math.min(qa, qb) * prog / 100, la = nA - r.a * xi, lb = nB - r.b * xi, lp = r.c * xi;
    const lim = Math.abs(qa - qb) < 0.005 ? null : qa < qb ? 'A' : 'B', end = prog === 100, S = 26;
    const jar = (x, n, n0, f, hot, prod) => `<g transform="translate(${x} 0)"><path d="M0 22v134a5 5 0 0 0 5 5h80a5 5 0 0 0 5-5V22" fill="var(--paper)" stroke="currentColor" stroke-width="1.6"/>
      ${n0 !== null ? `<path d="M2 ${160 - n0 * S}h86" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" opacity="0.6"/>` : ''}
      <rect x="2" y="${160 - n * S}" width="86" height="${n * S}" rx="3" fill="${hot ? 'var(--bad)' : 'var(--part)'}" opacity="${prod ? 0.9 : 0.55}"/>
      <text x="45" y="14" text-anchor="middle" font-weight="650" font-size="15">${n.toFixed(2)} mol</text><text x="45" y="178" text-anchor="middle">${f}${hot ? ' (used up)' : ''}</text></g>`;
    const bar = (x, q, f, co, win) => `<g transform="translate(${x} 0)"><text x="45" y="198" text-anchor="middle" font-size="12.5">${f}: ${(q * co).toFixed(1)} ÷ ${co} = ${q.toFixed(2)}</text><rect x="0" y="206" width="${Math.min(90, q * 18)}" height="9" rx="2" fill="${win ? 'var(--bad)' : 'currentColor'}" opacity="${win ? 0.9 : 0.4}"/></g>`;
    $('m17g').innerHTML = jar(30, la, nA, r.A, end && lim === 'A') + jar(170, lb, nB, r.B, end && lim === 'B')
      + `<path d="M285 92h64m-10-8 10 8-10 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><text x="317" y="80" text-anchor="middle" font-size="12.5" font-style="italic">${r.a} : ${r.b} : ${r.c}</text>`
      + jar(380, lp, null, r.P, false, true) + bar(30, qa, r.A, r.a, lim === 'A') + bar(170, qb, r.B, r.b, lim === 'B');
    $('m17a' + 'o').textContent = `${nA.toFixed(1)} mol ${r.A}`; $('m17b' + 'o').textContent = `${nB.toFixed(1)} mol ${r.B}`; $('m17p' + 'o').textContent = `${prog}%`;
    const limF = lim === 'A' ? r.A : r.B, exF = lim === 'A' ? r.B : r.A, exLeft = lim === 'A' ? nB - r.b * qa : nA - r.a * qb;
    $('m17e').innerHTML = lim ? `${limF} is limiting: it has the smaller moles ÷ coefficient<small>${lim === 'A' && nA > nB || lim === 'B' && nB > nA ? `There are more moles of ${limF} than of ${exF}, and it still runs out first. Compare moles ÷ coefficient, never raw moles. ` : ''}At the end: ${(r.c * Math.min(qa, qb)).toFixed(2)} mol ${r.P} formed, ${exLeft.toFixed(2)} mol ${exF} left over.</small>`
      : `neither is limiting: the reactants are in exactly the ratio ${r.a} : ${r.b}<small>Both hoppers empty together and ${(r.c * qa).toFixed(2)} mol ${r.P} forms.</small>`;
    if (!lim) host.dataset.hit = '1';
    $('m17d').textContent = host.dataset.hit ? 'Done: nothing is left over when the moles are in the ratio of the coefficients.' : '';
  };
  onChips(host, 'r', i => { r = LIM[i]; nA = r.nA; nB = r.nB; prog = 0; $('m17a').value = nA; $('m17b').value = nB; $('m17p').value = 0; draw(); });
  $('m17a').addEventListener('input', e => { nA = Number(e.target.value); draw(); });
  $('m17b').addEventListener('input', e => { nB = Number(e.target.value); draw(); });
  $('m17p').addEventListener('input', e => { prog = Number(e.target.value); draw(); });
  draw();
}

export default { '1.2': m12, '1.3': m13, '1.4': m14, '1.5': m15, '1.6': m16, '1.7': m17 };
