// Working models for Part 1, lessons 1.8 to 1.13.
import { mm } from './chem.js';
import { esc, sci, subn, chg, signed, ionic, shell, chips, onChips, slider, SVGT, still } from './model-kit.js';

/** A repeatable scatter: the i-th point of a fixed pattern, as two fractions between 0 and 1. */
const spot = i => [(i * 0.61803398875 + 0.13) % 1, (i * 0.41421356237 + 0.29) % 1];

/* 1.8 Yield: a jar with a line for the theoretical yield and the real level beside it. */
function m18(host) {
  let mg = 12.0, act = 16.0;
  const $ = shell(host, { label: 'percent yield', title: 'Theoretical line, actual level', sub: '2 Mg + O₂ → 2 MgO, with oxygen in excess. The dashed line is what the stoichiometry promises.',
    body: `<svg viewBox="0 0 520 210" role="img" aria-labelledby="m18t"><title id="m18t">A jar of product with a dashed line at the theoretical yield</title><g id="m18g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m18a', 'Magnesium burned', 5, 25, 0.1, mg)}${slider('m18b', 'MgO collected', 0, 45, 0.1, act)}</div>
      <p class="margin" id="m18e" aria-live="polite"></p>
      <p class="challenge"><b>Challenge.</b> Burn 12.0 g of magnesium. The reaction runs at a 75% yield: set the jar to the mass you would collect. <span id="m18d"></span></p>` });
  const draw = () => {
    const theo = mg / mm('Mg') * mm('MgO'), pct = act / theo * 100, S = 150 / 45, yT = 190 - theo * S, over = act > theo + 0.049;
    $('m18g').innerHTML = `<path d="M170 34v150a6 6 0 0 0 6 6h128a6 6 0 0 0 6-6V34" fill="var(--paper)" stroke="currentColor" stroke-width="1.6"/>
      <rect x="172" y="${190 - Math.min(act, theo) * S}" width="136" height="${Math.min(act, theo) * S}" rx="3" fill="var(--part)" opacity="0.6"/>
      ${over ? `<rect x="172" y="${190 - act * S}" width="136" height="${(act - theo) * S}" fill="var(--bad)" opacity="0.75"/>` : ''}
      <path d="M150 ${yT}h180" stroke="currentColor" stroke-width="1.6" stroke-dasharray="6 4"/>
      <text x="338" y="${yT + 4}">theoretical ${theo.toFixed(1)} g</text><text x="142" y="${Math.min(186, 190 - act * S + 4)}" text-anchor="end">actual ${act.toFixed(1)} g</text>
      <text x="240" y="22" text-anchor="middle" font-size="19" font-weight="650" ${over ? 'fill="var(--bad)"' : ''}>${pct.toFixed(1)}%</text>
      <text x="338" y="${yT + 22}" font-size="12" font-style="italic">${mg.toFixed(1)} g ÷ ${mm('Mg').toFixed(2)} × ${mm('MgO').toFixed(2)}</text>`;
    $('m18a' + 'o').textContent = `${mg.toFixed(1)} g Mg`; $('m18b' + 'o').textContent = `${act.toFixed(1)} g MgO`;
    $('m18e').innerHTML = `% yield = ${act.toFixed(1)} g ÷ ${theo.toFixed(1)} g × 100 = ${pct.toFixed(1)}%<small>${over ? 'More than 100% cannot be real product. The sample is wet or impure, or the fraction is upside down.' : 'Some product is always lost: it sticks to the glass, the reaction stops short, or side reactions use up reactant.'}</small>`;
    if (Math.abs(mg - 12) < 0.05 && Math.abs(pct - 75) < 0.5) host.dataset.hit = '1';
    $('m18d').textContent = host.dataset.hit ? 'Done: 0.75 × 19.9 g = 14.9 g. Percent yield works in both directions.' : '';
  };
  $('m18a').addEventListener('input', e => { mg = Number(e.target.value); draw(); });
  $('m18b').addEventListener('input', e => { act = Number(e.target.value); draw(); });
  draw();
}

/* 1.9 Solutions: the same ions in more water. Moles stay, molarity falls. */
const SOLN = [
  { f: 'NaCl', c: ['Na⁺', 1], a: ['Cl⁻', 1] }, { f: 'MgCl₂', c: ['Mg²⁺', 1], a: ['Cl⁻', 2] },
  { f: 'Fe(NO₃)₃', c: ['Fe³⁺', 1], a: ['NO₃⁻', 3] }, { f: 'Al₂(SO₄)₃', c: ['Al³⁺', 2], a: ['SO₄²⁻', 3] },
];
function m19(host) {
  let s = 0, n = 0.15, V = 500;
  const $ = shell(host, { label: 'molarity', title: 'Dissolve, then dilute', sub: 'Filled dots are cations, open dots are anions. Change the moles dissolved or the volume of solution.',
    body: `${chips('s', SOLN.map(x => x.f), 0, 'Compound')}
      <svg viewBox="0 0 520 214" role="img" aria-labelledby="m19t"><title id="m19t">A beaker of solution with its dissolved ions drawn as dots</title><g id="m19g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m19n', 'Compound dissolved', 0.05, 0.5, 0.01, n)}${slider('m19v', 'Volume of solution', 100, 1000, 10, V)}</div>
      <p class="margin" id="m19e" aria-live="polite"></p>
      <p class="challenge"><b>Challenge.</b> Make 0.30 M NaCl and note the chloride concentration. Then make 0.20 M MgCl₂. Which solution has more chloride ions per litre?</p>` });
  const draw = () => {
    const x = SOLN[s], M = n / (V / 1000), h = 24 + 140 * V / 1000, nc = Math.round(n * 40 * x.c[1]), na = Math.round(n * 40 * x.a[1]);
    let dots = '';
    for (let i = 0; i < nc + na; i++) { const [rx, ry] = spot(i * 7 + (i < nc ? 0 : 3)); dots += `<circle cx="${(40 + rx * 200).toFixed(1)}" cy="${(190 - 7 - ry * (h - 14)).toFixed(1)}" r="4.4" ${i < nc ? 'fill="var(--part)"' : 'fill="var(--paper)" stroke="var(--part)" stroke-width="1.6"'}/>`; }
    $('m19g').innerHTML = `<rect x="32" y="${190 - h}" width="216" height="${h}" fill="color-mix(in srgb, var(--part) 9%, var(--paper))"/><path d="M30 20v166a6 6 0 0 0 6 6h208a6 6 0 0 0 6-6V20" fill="none" stroke="currentColor" stroke-width="1.6"/>${dots}
      <path d="M250 ${190 - h}h14" stroke="currentColor" stroke-width="1.2"/><text x="268" y="${190 - h + 4}" font-size="12.5">${V} mL</text>
      <text x="300" y="52" font-size="20" font-weight="650">${M.toFixed(3)} M ${x.f}</text>
      <circle cx="308" cy="84" r="5" fill="var(--part)"/><text x="322" y="89">[${x.c[0]}] = ${(M * x.c[1]).toFixed(3)} M</text>
      <circle cx="308" cy="110" r="5" fill="var(--paper)" stroke="var(--part)" stroke-width="1.6"/><text x="322" y="115">[${x.a[0]}] = ${(M * x.a[1]).toFixed(3)} M</text>
      <text x="300" y="150" font-size="12.5" font-style="italic">1 ${x.f} → ${x.c[1] > 1 ? x.c[1] + ' ' : ''}${x.c[0]} + ${x.a[1] > 1 ? x.a[1] + ' ' : ''}${x.a[0]}</text>`;
    $('m19n' + 'o').textContent = `${n.toFixed(2)} mol`; $('m19v' + 'o').textContent = `${V} mL`;
    $('m19e').innerHTML = `M = n ÷ V = ${n.toFixed(2)} mol ÷ ${(V / 1000).toFixed(3)} L = ${M.toFixed(3)} M<small>Slide the volume: the number of dots does not change, only how crowded they are. That is why M₁V₁ = M₂V₂ for a dilution.</small>`;
  };
  onChips(host, 's', i => { s = i; draw(); });
  $('m19n').addEventListener('input', e => { n = Number(e.target.value); draw(); });
  $('m19v').addEventListener('input', e => { V = Number(e.target.value); draw(); });
  draw();
}

/* 1.10 What dissolves: the solubility rules as a grid, and a mixer that swaps partners. */
const GC = [{ f: 'Na', ch: 1, g1: 1 }, { f: 'K', ch: 1, g1: 1 }, { f: 'NH₄', ch: 1, g1: 1, poly: 1 }, { f: 'Mg', ch: 2 }, { f: 'Ca', ch: 2 }, { f: 'Ba', ch: 2 }, { f: 'Cu', ch: 2 }, { f: 'Ag', ch: 1 }, { f: 'Pb', ch: 2 }];
const GA = [{ f: 'NO₃', ch: 1, poly: 1 }, { f: 'Cl', ch: 1 }, { f: 'I', ch: 1 }, { f: 'SO₄', ch: 2, poly: 1 }, { f: 'CO₃', ch: 2, poly: 1 }, { f: 'PO₄', ch: 3, poly: 1 }, { f: 'OH', ch: 1, poly: 1 }];
export function soluble(c, a) {
  if (c.f === 'Cu' && a.f === 'I') return ['na', 'Cu²⁺ and I⁻ react in a different way, so this pair is left out.'];
  if (a.f === 'NO₃') return ['aq', 'All nitrates are soluble.'];
  if (c.g1) return ['aq', 'Compounds of Group 1 ions and NH₄⁺ are always soluble.'];
  if (a.f === 'Cl' || a.f === 'I') return [['Ag', 'Pb'].includes(c.f) ? 's' : 'aq', 'Chlorides, bromides and iodides are soluble, except with Ag⁺, Pb²⁺ and Hg₂²⁺.'];
  if (a.f === 'SO₄') return [['Ba', 'Pb', 'Ca', 'Ag'].includes(c.f) ? 's' : 'aq', 'Sulfates are soluble, except with Ba²⁺, Sr²⁺, Pb²⁺, Ca²⁺ and Ag⁺.'];
  if (a.f === 'OH') return [c.f === 'Ba' ? 'aq' : c.f === 'Ca' ? 'sl' : 's', 'Hydroxides are insoluble, except with Group 1 ions; Ba(OH)₂ and Sr(OH)₂ are soluble and Ca(OH)₂ slightly.'];
  return ['s', 'Carbonates and phosphates are insoluble, except with Group 1 ions and NH₄⁺.'];
}
const SALTS = [[7, 0], [0, 1], [8, 0], [1, 2], [1, 4], [2, 1], [6, 3], [0, 6], [5, 1], [0, 3], [4, 0], [0, 5], [3, 1], [1, 0]];
const WORD = { aq: 'soluble', s: 'insoluble', sl: 'slightly soluble', na: 'not used' };
function m110(host) {
  let s1 = 0, s2 = 1, cell = null;
  const name = ([c, a]) => ionic(GC[c], GA[a]).f;
  const sel = (id, cur) => `<select id="${id}">${SALTS.map((p, i) => `<option value="${i}"${i === cur ? ' selected' : ''}>${name(p)}(aq)</option>`).join('')}</select>`;
  const $ = shell(host, { label: 'solubility grid', title: 'Mix two solutions: do the ions swap and sink?', sub: 'Choose two solutions. The grid shows every pairing of their ions: “aq” stays dissolved, “s” leaves as a solid.',
    body: `<div class="pick"><label>Solution 1 ${sel('m110a', s1)}</label><label>Solution 2 ${sel('m110b', s2)}</label></div>
      <div class="mixout"><svg viewBox="0 0 120 110" role="img" aria-labelledby="m110t" style="width:112px;flex:none"><title id="m110t">The mixture in a beaker</title><g id="m110g"></g></svg><p class="margin" id="m110r" aria-live="polite" style="margin-top:0"></p></div>
      <div class="scroll"><table class="solgrid" id="m110tb"></table></div><p class="hint" id="m110i" aria-live="polite">Press any square to see the compound and the rule that decides it.</p>` });
  const draw = () => {
    const [c1, a1] = SALTS[s1], [c2, a2] = SALTS[s2], same = c1 === c2 || a1 === a2;
    const prods = same ? [] : [[c1, a2], [c2, a1]].map(p => ({ p, f: name(p), st: soluble(GC[p[0]], GA[p[1]]) }));
    const ppt = prods.filter(x => x.st[0] === 's'), faint = prods.filter(x => x.st[0] === 'sl'), odd = prods.some(x => x.st[0] === 'na');
    $('m110g').innerHTML = `<rect x="12" y="34" width="96" height="66" fill="${ppt.length ? 'color-mix(in srgb, var(--ink-2) 34%, var(--paper))' : faint.length ? 'color-mix(in srgb, var(--ink-2) 12%, var(--paper))' : 'color-mix(in srgb, var(--part) 8%, var(--paper))'}"/>
      ${ppt.length ? '<path d="M12 100v-9q10-9 22-4t24-3 26 2 24-2v16z" fill="var(--ink-2)"/>' : ''}<path d="M10 12v84a6 6 0 0 0 6 6h88a6 6 0 0 0 6-6V12" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
    $('m110r').innerHTML = same ? `no new pairing<small>The two solutions share an ion, so swapping partners gives back the same two compounds.</small>`
      : odd ? `not a simple swap<small>${esc(soluble(GC[6], GA[2])[1])} Try another pair.</small>`
      : ppt.length ? `${ppt.map(x => x.f + '(s)').join(' and ')} precipitate${ppt.length > 1 ? '' : 's'}<small>Swap partners: ${prods.map(x => `${x.f} is ${WORD[x.st[0]]}`).join('; ')}. ${esc(ppt[0].st[1])}</small>`
      : `no precipitate${faint.length ? ' to speak of' : ''}<small>Swap partners: ${prods.map(x => `${x.f} is ${WORD[x.st[0]]}`).join('; ')}. ${faint.length ? 'The mixture may turn faintly cloudy.' : 'All four ions stay dissolved: no reaction.'}</small>`;
    const mark = (ci, ai) => (ci === c1 && ai === a1 || ci === c2 && ai === a2 ? ' was' : !same && (ci === c1 && ai === a2 || ci === c2 && ai === a1) ? ' new' : '');
    $('m110tb').innerHTML = `<tr><td></td>${GA.map(a => `<th scope="col">${a.f}${chg(-a.ch)}</th>`).join('')}</tr>` + GC.map((c, ci) => `<tr><th scope="row">${c.f}${chg(c.ch)}</th>${GA.map((a, ai) => { const st = soluble(c, a)[0]; return `<td><button type="button" class="${st}${mark(ci, ai)}" data-c="${ci}" data-a="${ai}" aria-label="${ionic(c, a).f}: ${WORD[st]}">${st === 'na' ? '–' : st === 'sl' ? 'aq/s' : st}</button></td>`; }).join('')}</tr>`).join('');
    $('m110tb').querySelectorAll('button').forEach(b => b.addEventListener('click', () => { cell = [Number(b.dataset.c), Number(b.dataset.a)]; info(); }));
    info();
  };
  const info = () => { if (!cell) return; const c = GC[cell[0]], a = GA[cell[1]], st = soluble(c, a); $('m110i').innerHTML = `<b style="font-style:normal;color:var(--ink)">${ionic(c, a).f}: ${WORD[st[0]]}.</b> ${esc(st[1])}`; };
  $('m110a').addEventListener('change', e => { s1 = Number(e.target.value); draw(); });
  $('m110b').addEventListener('change', e => { s2 = Number(e.target.value); draw(); });
  draw();
}

/* 1.11 Ionic equations: four kinds of ion drift in a beaker; two kinds find each other and sink. */
const NET = [
  { label: 'AgNO₃ + NaCl', ions: [['Ag⁺', 4, 'c'], ['NO₃⁻', 4], ['Na⁺', 4], ['Cl⁻', 4, 'a']], per: [1, 1], units: 4,
    mol: 'AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)', L: ['Ag⁺(aq)', '*NO₃⁻(aq)', '*Na⁺(aq)', 'Cl⁻(aq)'], R: ['AgCl(s)', '*Na⁺(aq)', '*NO₃⁻(aq)'], net: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)' },
  { label: 'Pb(NO₃)₂ + KI', ions: [['Pb²⁺', 3, 'c'], ['NO₃⁻', 6], ['K⁺', 6], ['I⁻', 6, 'a']], per: [1, 2], units: 3,
    mol: 'Pb(NO₃)₂(aq) + 2 KI(aq) → PbI₂(s) + 2 KNO₃(aq)', L: ['Pb²⁺(aq)', '*2 NO₃⁻(aq)', '*2 K⁺(aq)', '2 I⁻(aq)'], R: ['PbI₂(s)', '*2 K⁺(aq)', '*2 NO₃⁻(aq)'], net: 'Pb²⁺(aq) + 2 I⁻(aq) → PbI₂(s)' },
  { label: 'K₂CO₃ + Ca(NO₃)₂', ions: [['Ca²⁺', 3, 'c'], ['NO₃⁻', 6], ['K⁺', 6], ['CO₃²⁻', 3, 'a']], per: [1, 1], units: 3,
    mol: 'K₂CO₃(aq) + Ca(NO₃)₂(aq) → CaCO₃(s) + 2 KNO₃(aq)', L: ['*2 K⁺(aq)', 'CO₃²⁻(aq)', 'Ca²⁺(aq)', '*2 NO₃⁻(aq)'], R: ['CaCO₃(s)', '*2 K⁺(aq)', '*2 NO₃⁻(aq)'], net: 'Ca²⁺(aq) + CO₃²⁻(aq) → CaCO₃(s)' },
  { label: 'NaCl + KNO₃', ions: [['Na⁺', 4], ['Cl⁻', 4], ['K⁺', 4], ['NO₃⁻', 4]], per: [0, 0], units: 0,
    mol: 'NaCl(aq) + KNO₃(aq) → no reaction', L: ['*Na⁺(aq)', '*Cl⁻(aq)', '*K⁺(aq)', '*NO₃⁻(aq)'], R: ['*Na⁺(aq)', '*Cl⁻(aq)', '*K⁺(aq)', '*NO₃⁻(aq)'], net: 'nothing is left: no reaction' },
];
function m111(host) {
  let q = NET[0], mixed = false, ions = [];
  const COL = ['var(--u1)', 'var(--u2)', 'var(--u3)', 'var(--u4)'];
  const $ = shell(host, { label: 'spectator ions', title: 'Who reacts, and who only watches?', sub: 'Four kinds of ion drift in the beaker. Mix them and see which ones find each other.',
    body: `${chips('q', NET.map(x => x.label), 0, 'Solutions')}
      <svg viewBox="0 0 520 220" role="img" aria-labelledby="m111t"><title id="m111t">Ions drifting in a beaker; the ones that form an insoluble compound sink</title>
        <rect x="42" y="28" width="436" height="174" fill="color-mix(in srgb, var(--part) 7%, var(--paper))"/><path d="M40 10v188a6 6 0 0 0 6 6h428a6 6 0 0 0 6-6V10" fill="none" stroke="currentColor" stroke-width="1.6"/><g id="m111g" font-family="Source Serif 4, Georgia, serif" font-size="10" font-weight="650" text-anchor="middle"></g></svg>
      <p style="margin:8px 0"><button type="button" class="btn2" id="m111b"></button></p>
      <dl class="eqs" id="m111e" aria-live="polite"></dl>` });
  const setup = () => {
    ions = []; const seen = { c: 0, a: 0 };
    q.ions.forEach(([label, n, role], kind) => { for (let i = 0; i < n; i++) {
      const [rx, ry] = spot(ions.length * 3 + 1), ion = { label, kind, role, x: 62 + rx * 396, y: 46 + ry * 136, vx: (Math.random() - 0.5) * 1.1, vy: (Math.random() - 0.5) * 1.1 };
      if (role) { const k = seen[role]++, unit = Math.floor(k / q.per[role === 'c' ? 0 : 1]), cx = q.units > 1 ? 110 + unit * 300 / (q.units - 1) : 260;
        ion.tx = role === 'c' ? cx : cx + (q.per[1] === 2 ? (k % 2 ? 25 : -25) : 25); ion.ty = 186; }
      ions.push(ion);
    } });
    $('m111g').innerHTML = ions.map((o, i) => `<g id="m111i${i}"><circle r="13.5" fill="${COL[o.kind]}"/><text y="3.5" fill="var(--paper)">${o.label}</text></g>`).join('');
    place();
  };
  const place = () => ions.forEach((o, i) => { $('m111i' + i).setAttribute('transform', `translate(${o.x.toFixed(1)} ${o.y.toFixed(1)})`); $('m111i' + i).firstChild.setAttribute('stroke', mixed && o.role ? 'currentColor' : 'none'); });
  const text = () => {
    const side = list => list.map(t => (t[0] === '*' ? `<span class="spec${mixed ? ' cut' : ''}">${t.slice(1)}</span>` : `<span>${t}</span>`)).join(' + ');
    $('m111b').textContent = mixed ? 'Start again' : 'Mix: let the ions meet';
    $('m111e').innerHTML = `<div><dt>Molecular</dt><dd>${q.mol}</dd></div><div><dt>Complete ionic</dt><dd>${side(q.L)} → ${side(q.R)}</dd></div>
      <div><dt>Net ionic</dt><dd>${mixed ? `<b>${q.net}</b>` : '<i>mix the solutions, then cancel the ions that did nothing</i>'}</dd></div>`
      + (mixed ? `<p class="hint" style="margin-top:6px">${q.units ? 'The ions still drifting are spectators: they are crossed out on both sides. What is left is the net ionic equation.' : 'Every new pairing is soluble, so no ion leaves the solution. All four are spectators.'}</p>` : '');
  };
  const tick = () => {
    if (!host.isConnected) return;
    for (const o of ions) {
      if (mixed && o.role) { o.x += (o.tx - o.x) * 0.05; o.y += (o.ty - o.y) * 0.05; continue; }
      o.x += o.vx; o.y += o.vy;
      if (o.x < 58 || o.x > 462) o.vx = (o.x < 58 ? 1 : -1) * Math.abs(o.vx);
      if (o.y < 44 || o.y > (mixed ? 158 : 186)) o.vy = (o.y < 44 ? 1 : -1) * Math.abs(o.vy);
    }
    place(); requestAnimationFrame(tick);
  };
  const settle = () => { if (still()) { for (const o of ions) if (mixed && o.role) { o.x = o.tx; o.y = o.ty; } place(); } };
  $('m111b').addEventListener('click', () => { mixed = !mixed; if (!mixed) setup(); text(); settle(); });
  onChips(host, 'q', i => { q = NET[i]; mixed = false; setup(); text(); });
  setup(); text();
  if (!still()) requestAnimationFrame(tick);
}

/* 1.12 Acids and bases: a titration. Find the equivalence point, then work out the unknown molarity. */
const TIT = [
  { f: 'HCl', name: 'hydrochloric acid', p: 1, Va: 25.0, Ma: 0.100 },
  { f: 'H₂SO₄', name: 'sulfuric acid', p: 2, Va: 20.0, Ma: 0.150 },
  { f: 'HNO₃', name: 'nitric acid', p: 1, Va: 20.0, Ma: 0.250 },
];
const MB = 0.200;
function m112(host) {
  let t = TIT[0], V = 0;
  const $ = shell(host, { label: 'titration', title: 'Titrate an acid of unknown strength', sub: `The burette holds ${MB.toFixed(3)} M NaOH. The flask holds acid and an indicator that turns pink when base is in excess.`,
    body: `${chips('t', TIT.map(x => `${x.Va.toFixed(1)} mL of ${x.f}`), 0, 'Acid in the flask')}
      <svg viewBox="0 0 520 250" role="img" aria-labelledby="m112t"><title id="m112t">A burette above a flask; the solution in the flask turns pink at the equivalence point</title><g id="m112g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m112v', 'NaOH added', 0, 40, 0.1, 0)}</div>
      <p class="margin" id="m112e" aria-live="polite"></p>
      <form class="challenge tryrow" id="m112f"><span><b>Challenge.</b> Stop at the first pink that stays, then work out the molarity of the acid:</span><label class="sr" for="m112a">Molarity of the acid</label><input id="m112a" inputmode="decimal" autocomplete="off" placeholder="molarity" style="width:7em"><span class="unit">M</span><button class="btn2" type="submit">Check</button></form>
      <p class="hint" id="m112d" aria-live="polite"></p>` });
  const draw = () => {
    const H0 = t.Ma * t.Va / 1000 * t.p, OH = MB * V / 1000, Veq = H0 / MB * 1000, d = V - Veq;
    const left = Math.max(0, H0 - OH), xs = Math.max(0, OH - H0), at = Math.abs(d) < 0.051, pink = at ? 0.22 : d > 0 ? Math.min(0.85, 0.3 + d * 0.08) : 0;
    let dots = '';
    const nH = Math.round(left * 4000), nO = Math.min(24, Math.round(xs * 4000));
    for (let i = 0; i < nH + nO; i++) dots += `<circle cx="${72 + (i % 12) * 8.8}" cy="${221 + Math.floor(i / 12) * 9.5}" r="3.4" ${i < nH ? 'fill="var(--part)"' : 'fill="var(--paper)" stroke="currentColor" stroke-width="1.3"'}/>`;
    $('m112g').innerHTML = `<rect x="111" y="${14 + V / 40 * 118}" width="18" height="${132 - V / 40 * 118}" fill="color-mix(in srgb, var(--part) 30%, var(--paper))"/><path d="M110 8v140l7 12h6l7-12V8" fill="none" stroke="currentColor" stroke-width="1.5"/>
      ${[0, 10, 20, 30, 40].map(m => `<path d="M130 ${14 + m / 40 * 118}h7" stroke="currentColor"/><text x="141" y="${18 + m / 40 * 118}" font-size="11">${m}</text>`).join('')}
      <path d="M104 172h32v14l54 50a6 6 0 0 1-4 10H54a6 6 0 0 1-4-10l54-50z" fill="var(--paper)" stroke="currentColor" stroke-width="1.6"/>
      <path d="M83.5 205h73l33.5 31a6 6 0 0 1-4 10H54a6 6 0 0 1-4-10z" fill="${pink ? '#d6336c' : 'color-mix(in srgb, var(--part) 8%, var(--paper))'}" opacity="${pink || 1}"/>${dots}
      ${V > 0 && V < 40 ? '<path d="M120 160v8" stroke="var(--part)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 6"/>' : ''}
      <text x="240" y="40" font-size="18" font-weight="650">${V.toFixed(1)} mL NaOH added</text>
      <text x="240" y="68">OH⁻ added = ${MB.toFixed(3)} M × ${(V / 1000).toFixed(4)} L</text><text x="240" y="88">= ${(OH).toFixed(5)} mol</text>
      <rect x="240" y="100" width="${Math.min(260, OH * 26000)}" height="10" rx="2" fill="var(--part)" opacity="0.7"/>
      <text x="240" y="136" font-weight="650" ${pink ? 'fill="#d6336c"' : ''}>${at ? 'Faint pink, and it stays:' : d > 0 ? 'Deep pink: too much base,' : 'Colourless:'}</text><text x="240" y="154" font-weight="650" ${pink ? 'fill="#d6336c"' : ''}>${at ? 'the equivalence point' : d > 0 ? 'you have overshot' : 'acid is still in excess'}</text>
      <circle cx="246" cy="178" r="4" fill="var(--part)"/><text x="258" y="182" font-size="12.5">H⁺ not yet neutralized</text>
      <circle cx="246" cy="198" r="4" fill="var(--paper)" stroke="currentColor" stroke-width="1.3"/><text x="258" y="202" font-size="12.5">OH⁻ in excess</text>
      <text x="240" y="230" font-size="12.5" font-style="italic">H⁺(aq) + OH⁻(aq) → H₂O(l)</text>`;
    $('m112v' + 'o').textContent = `${V.toFixed(1)} mL`;
    $('m112e').innerHTML = at ? `equivalence: moles of OH⁻ added = moles of H⁺ the acid could supply<small>${t.p === 2 ? 'Each H₂SO₄ supplies two H⁺, so the moles of acid are half the moles of OH⁻.' : `Each ${t.f} supplies one H⁺, so the moles of acid equal the moles of OH⁻.`}</small>`
      : `<small>Every OH⁻ that lands removes one H⁺ as water. The dots in the flask are the H⁺ still waiting.</small>`;
  };
  $('m112f').addEventListener('submit', e => {
    e.preventDefault();
    const g = Number($('m112a').value.replace(',', '.')), Veq = t.Ma * t.Va * t.p / MB, ok = Math.abs(g - t.Ma) <= t.Ma * 0.015;
    $('m112d').innerHTML = ok ? `<b style="font-style:normal;color:var(--good)">Right.</b> mol OH⁻ = ${MB.toFixed(3)} M × ${(Veq / 1000).toFixed(4)} L = ${(MB * Veq / 1000).toFixed(5)} mol; mol ${t.f} = ${(t.Ma * t.Va / 1000).toFixed(5)} mol; ÷ ${(t.Va / 1000).toFixed(4)} L = ${t.Ma.toFixed(3)} M.`
      : `<b style="font-style:normal;color:var(--bad)">Not yet.</b> Read the volume at the first faint pink. Moles of OH⁻ = M × V${t.p === 2 ? '; each H₂SO₄ needs two OH⁻' : ''}; then divide the moles of acid by ${(t.Va / 1000).toFixed(4)} L.`;
  });
  onChips(host, 't', i => { t = TIT[i]; V = 0; $('m112v').value = 0; $('m112a').value = ''; $('m112d').textContent = ''; draw(); });
  $('m112v').addEventListener('input', e => { V = Number(e.target.value); draw(); });
  draw();
}

/* 1.13 Redox: electrons hop from a metal strip to ions in solution; then the bookkeeping for one formula. */
const RED = [
  { label: 'Zn + Cu²⁺', eq: 'Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)', M: 'Zn', ox: 2, ion: 'Cu²⁺', el: 'Cu', q: 2, prod: 'Cu atoms', m: 1, i: 1, steps: 6, blue: [1, 0], dep: 'var(--u2)' },
  { label: 'Cu + Ag⁺', eq: 'Cu(s) + 2 Ag⁺(aq) → Cu²⁺(aq) + 2 Ag(s)', M: 'Cu', ox: 2, ion: 'Ag⁺', el: 'Ag', q: 1, prod: 'Ag atoms', m: 1, i: 2, steps: 6, blue: [0, 1], dep: 'var(--ink-2)' },
  { label: 'Al + Cu²⁺', eq: '2 Al(s) + 3 Cu²⁺(aq) → 2 Al³⁺(aq) + 3 Cu(s)', M: 'Al', ox: 3, ion: 'Cu²⁺', el: 'Cu', q: 2, prod: 'Cu atoms', m: 2, i: 3, steps: 4, blue: [1, 0], dep: 'var(--u2)' },
  { label: 'Zn + H⁺', eq: 'Zn(s) + 2 H⁺(aq) → Zn²⁺(aq) + H₂(g)', M: 'Zn', ox: 2, ion: 'H⁺', el: 'H', q: 1, prod: 'H atoms (as H₂ gas)', m: 1, i: 2, steps: 6, blue: [0, 0], gas: 1 },
];
const OXN = [
  { f: 'SO₄²⁻', ch: -2, known: [['O', 4, -2, 'rule 5']], find: ['S', 1] },
  { f: 'Cr₂O₇²⁻', ch: -2, known: [['O', 7, -2, 'rule 5']], find: ['Cr', 2] },
  { f: 'HNO₃', ch: 0, known: [['H', 1, 1, 'rule 4'], ['O', 3, -2, 'rule 5']], find: ['N', 1] },
  { f: 'KClO₃', ch: 0, known: [['K', 1, 1, 'rule 3'], ['O', 3, -2, 'rule 5']], find: ['Cl', 1] },
  { f: 'NH₄⁺', ch: 1, known: [['H', 4, 1, 'rule 4']], find: ['N', 1] },
  { f: 'H₂O₂', ch: 0, known: [['H', 2, 1, 'rule 4, which comes before rule 5']], find: ['O', 2] },
  { f: 'S₈', ch: 0, known: [], find: ['S', 8], free: 1 },
];
function m113(host) {
  let r = RED[0], k = 0, o = 0;
  const $ = shell(host, { label: 'electron transfer', title: 'Follow the electrons', sub: 'A metal strip stands in a solution. Run the reaction and count what each side loses and gains.',
    body: `${chips('r', RED.map(x => x.label), 0, 'Reaction')}
      <svg viewBox="0 0 520 226" role="img" aria-labelledby="m113t"><title id="m113t">A metal strip in a solution, beside a number line of oxidation numbers</title><g id="m113g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m113k', 'Run the reaction', 0, 6, 1, 0)}</div>
      <p class="margin" id="m113e" aria-live="polite"></p>
      <p class="lab" style="margin-top:14px">Bookkeeping: find the oxidation number that is not given by a rule</p>
      ${chips('o', OXN.map(x => x.f), 0, 'Species')}<table class="tally" id="m113o"></table><p class="hint" id="m113h"></p>` });
  const draw = () => {
    const f = k / r.steps, blue = r.blue[0] + (r.blue[1] - r.blue[0]) * f, w = 30 - 9 * f, d = r.gas ? 0 : 8 * f;
    const nIon = r.i * (r.steps - k), nNew = r.m * k;
    let dots = '';
    for (let j = 0; j < r.i * r.steps; j++) { const [rx, ry] = spot(j * 5 + 2), x = 40 + rx * 84 + (j % 2 ? 122 : 0); if (j < nIon) dots += `<circle cx="${x.toFixed(1)}" cy="${(84 + ry * 96).toFixed(1)}" r="4.6" fill="var(--part)"/>`; }
    for (let j = 0; j < nNew; j++) { const [rx, ry] = spot(j * 11 + 7), x = 40 + rx * 84 + (j % 2 ? 0 : 122); dots += `<circle cx="${x.toFixed(1)}" cy="${(84 + ry * 96).toFixed(1)}" r="4.6" fill="var(--paper)" stroke="currentColor" stroke-width="1.4"/>`; }
    if (r.gas) for (let j = 0; j < k * 2; j++) { const [rx, ry] = spot(j * 13 + 5); dots += `<circle cx="${(118 + rx * 14 + (j % 2 ? 34 : 0)).toFixed(1)}" cy="${(80 + ry * 70).toFixed(1)}" r="3" fill="none" stroke="currentColor" stroke-width="1"/>`; }
    const ax = n => 330 + (n + 1) * 42, yA = 78, yB = 150;
    const arrow = (y, from, to, col) => `<path d="M${ax(from)} ${y}H${ax(to) + (to > from ? -3 : 3)}" stroke="${col}" stroke-width="2.6"/><path d="M${ax(to) + (to > from ? -10 : 10)} ${y - 6}l${to > from ? 9 : -9} 6 ${to > from ? -9 : 9} 6" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${ax(from)}" cy="${y}" r="4" fill="${col}"/>`;
    $('m113g').innerHTML = `<rect x="32" y="66" width="216" height="124" fill="color-mix(in srgb, var(--part) 6%, var(--paper))"/><rect x="32" y="66" width="216" height="124" fill="#2f7fd0" opacity="${(blue * 0.42).toFixed(2)}"/>
      <path d="M30 30v156a6 6 0 0 0 6 6h208a6 6 0 0 0 6-6V30" fill="none" stroke="currentColor" stroke-width="1.6"/>
      ${d ? `<rect x="${140 - w / 2 - d}" y="72" width="${w + 2 * d}" height="${104 + d}" rx="3" fill="${r.dep}"/>` : ''}
      <rect x="125" y="8" width="30" height="64" fill="var(--ink-2)"/><rect x="${140 - w / 2}" y="70" width="${w}" height="104" fill="var(--ink-2)"/><text x="140" y="24" text-anchor="middle" fill="var(--paper)" font-weight="650" font-size="12.5">${r.M}</text>${dots}
      <circle cx="40" cy="208" r="4.6" fill="var(--part)"/><text x="50" y="212" font-size="12.5">${r.ion}</text><circle cx="100" cy="208" r="4.6" fill="var(--paper)" stroke="currentColor" stroke-width="1.4"/><text x="110" y="212" font-size="12.5">${r.M}${chg(r.ox)}</text>
      ${d ? `<rect x="158" y="203" width="12" height="10" rx="2" fill="${r.dep}"/><text x="175" y="212" font-size="12.5">${r.el} metal</text>` : r.gas ? '<circle cx="164" cy="208" r="3" fill="none" stroke="currentColor"/><text x="175" y="212" font-size="12.5">H₂ gas</text>' : ''}
      <path d="M${ax(-1) - 10} 114H${ax(3) + 10}" stroke="currentColor" stroke-width="1.3"/>${[-1, 0, 1, 2, 3].map(n => `<path d="M${ax(n)} 109v10" stroke="currentColor" stroke-width="1.3"/><text x="${ax(n)}" y="134" text-anchor="middle" font-size="12.5">${signed(n)}</text>`).join('')}
      <text x="${ax(1)}" y="22" text-anchor="middle" font-size="12" font-style="italic">oxidation number</text>
      ${arrow(yA, 0, r.ox, 'var(--bad)')}<text x="${ax(1)}" y="${yA - 26}" text-anchor="middle" font-weight="650">${r.M}: 0 → ${signed(r.ox)}, loses ${r.ox} e⁻</text><text x="${ax(1)}" y="${yA - 10}" text-anchor="middle" font-size="12.5">oxidized: the reducing agent</text>
      ${arrow(yB, r.q, 0, 'var(--good)')}<text x="${ax(1)}" y="${yB + 22}" text-anchor="middle" font-weight="650">${r.el}: ${signed(r.q)} → 0, gains ${r.q} e⁻</text><text x="${ax(1)}" y="${yB + 38}" text-anchor="middle" font-size="12.5">reduced: ${r.ion} is the oxidizing agent</text>`;
    $('m113k' + 'o').textContent = `${k} of ${r.steps}`;
    $('m113e').innerHTML = `${esc(r.eq)}<small>So far: ${r.m * k} ${r.M} atom${r.m * k === 1 ? ' has' : 's have'} given up ${r.m * k * r.ox} e⁻, and ${r.i * k} ${r.ion} ion${r.i * k === 1 ? ' has' : 's have'} taken ${r.i * k * r.q} e⁻. Electrons lost always equal electrons gained: that is what fixes the coefficients.</small>`;
  };
  const book = () => {
    const s = OXN[o], sum = s.known.reduce((t, [, n, v]) => t + n * v, 0), x = s.free ? 0 : (s.ch - sum) / s.find[1];
    $('m113o').innerHTML = `<tr><th>Atom</th><th>How many</th><th>Each</th><th>Total</th></tr>` + s.known.map(([el, n, v, why]) => `<tr><td>${el} <small>(${why})</small></td><td>${n}</td><td>${signed(v)}</td><td>${signed(n * v)}</td></tr>`).join('')
      + `<tr class="find"><td>${s.find[0]}${s.free ? ' <small>(rule 1: a free element)</small>' : ''}</td><td>${s.find[1]}</td><td><b>${signed(x)}</b></td><td>${signed(x * s.find[1])}</td></tr><tr><td colspan="3">Must add up to the charge on ${s.f}</td><td>${signed(s.ch)}</td></tr>`;
    $('m113h').textContent = s.free ? 'An element on its own is always 0, however many atoms are in the molecule.' : `${s.find[1] > 1 ? `${s.find[1]} × ` : ''}${s.find[0]} + (${signed(sum)}) = ${signed(s.ch)}, so each ${s.find[0]} is ${signed(x)}.`;
  };
  onChips(host, 'r', i => { r = RED[i]; k = 0; $('m113k').max = r.steps; $('m113k').value = 0; draw(); });
  onChips(host, 'o', i => { o = i; book(); });
  $('m113k').addEventListener('input', e => { k = Number(e.target.value); draw(); });
  draw(); book();
}

export default { '1.8': m18, '1.9': m19, '1.10': m110, '1.11': m111, '1.12': m112, '1.13': m113 };
