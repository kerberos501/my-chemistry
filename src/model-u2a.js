// Working models for Part 2, lessons 2.1 to 2.7: heat, work, enthalpy and light.
import { esc, sci, shell, chips, onChips, slider, SVGT } from './model-kit.js';

const sj = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(Math.round(n * 10) / 10);
const spot = i => [(i * 0.61803398875 + 0.13) % 1, (i * 0.41421356237 + 0.29) % 1];
/** A coefficient: 1 is left out, halves are written as fractions. */
export const co = n => (Math.abs(n - 1) < 1e-9 ? '' : (Number.isInteger(n) ? n : n === 0.5 ? '½' : Number.isInteger(n - 0.5) ? `${n - 0.5}½` : n) + ' ');
const arrow = (x1, y1, x2, y2, col, w = 2.4) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 9; return `<path d="M${x1} ${y1}L${x2} ${y2}M${x2 - h * Math.cos(a - 0.5)} ${y2 - h * Math.sin(a - 0.5)}L${x2} ${y2}L${x2 - h * Math.cos(a + 0.5)} ${y2 - h * Math.sin(a + 0.5)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; };
const HOT = 'var(--bad)', COLD = 'var(--u1)';

/* 2.1 System and surroundings: a gas under a piston. Heat crosses the wall, work moves the piston. */
function m21(host) {
  let q = 250, w = -90;
  const $ = shell(host, { label: 'heat and work', title: 'Heat and work: keep the books', sub: 'The gas in the cylinder is the system. Everything else is the surroundings. Arrows pointing into the gas are positive.',
    body: `<svg viewBox="0 0 520 236" role="img" aria-labelledby="m21t"><title id="m21t">A gas under a piston, with arrows for heat and work, and bars for q, w and the change in energy</title><g id="m21g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m21q', 'Heat, q', -300, 300, 10, q)}${slider('m21w', 'Work, w', -300, 300, 10, w)}</div>
      <p class="margin" id="m21e" aria-live="polite"></p>
      <p class="challenge"><b>Challenge.</b> Make the gas absorb heat and expand, and still finish with exactly the energy it started with. <span id="m21d"></span></p>` });
  const draw = () => {
    const pist = 112 + w * 0.16, dE = q + w, S = 0.14, y0 = 122;
    let dots = '';
    for (let i = 0; i < 18; i++) { const [rx, ry] = spot(i * 3 + 1); dots += `<circle cx="${(74 + rx * 132).toFixed(1)}" cy="${(pist + 9 + ry * (200 - pist - 18)).toFixed(1)}" r="4" fill="var(--part)" opacity="0.75"/>`; }
    const bar = (x, v, label, col) => `<rect x="${x}" y="${v >= 0 ? y0 - v * S : y0}" width="44" height="${Math.abs(v) * S}" fill="${col}" opacity="0.8"/><text x="${x + 22}" y="${v >= 0 ? y0 - v * S - 6 : y0 + Math.abs(v) * S + 15}" text-anchor="middle" font-weight="650">${sj(v)} J</text><text x="${x + 22}" y="222" text-anchor="middle">${label}</text>`;
    $('m21g').innerHTML = `<rect x="62" y="${pist}" width="156" height="${200 - pist}" fill="color-mix(in srgb, var(--part) 10%, var(--paper))"/>${dots}
      <path d="M60 22v176a4 4 0 0 0 4 4h152a4 4 0 0 0 4-4V22" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="62" y="${pist - 12}" width="156" height="12" fill="var(--ink-2)"/><rect x="134" y="${pist - 46}" width="12" height="34" fill="var(--ink-2)"/>
      ${w > 0 ? arrow(176, pist - 50, 176, pist - 18, 'currentColor', 3) : w < 0 ? arrow(176, pist - 18, 176, pist - 50, 'currentColor', 3) : ''}
      <text x="140" y="222" text-anchor="middle" font-size="12.5">${q > 0 ? 'heat in' : q < 0 ? 'heat out' : 'no heat'}; ${w > 0 ? 'the piston is pushed in' : w < 0 ? 'the gas pushes the piston out' : 'the piston does not move'}</text>
      ${q > 0 ? arrow(8, 170, 54, 170, HOT, 2 + q / 90) : q < 0 ? arrow(54, 170, 8, 170, COLD, 2 - q / 90) : ''}
      <path d="M262 ${y0}h240" stroke="currentColor" stroke-width="1.2"/><text x="508" y="${y0 - 5}" text-anchor="end" font-size="11.5" font-style="italic">in (+)</text><text x="508" y="${y0 + 14}" text-anchor="end" font-size="11.5" font-style="italic">out (−)</text>
      ${bar(276, q, 'q', q >= 0 ? HOT : COLD)}${bar(346, w, 'w', 'var(--ink-2)')}${bar(416, dE, 'ΔE', 'var(--part)')}`;
    $('m21q' + 'o').textContent = `${sj(q)} J`; $('m21w' + 'o').textContent = `${sj(w)} J`;
    $('m21e').innerHTML = `ΔE = q + w = (${sj(q)} J) + (${sj(w)} J) = ${sj(dE)} J<small>${q > 0 ? 'The gas gains heat, so q is positive.' : q < 0 ? 'The gas loses heat, so q is negative.' : 'No heat crosses the wall.'} ${w > 0 ? 'It is compressed: work is done on it, so w is positive.' : w < 0 ? 'It expands: it does work on the surroundings, so w is negative.' : 'No work is done.'}</small>`;
    if (q > 0 && w < 0 && dE === 0) host.dataset.hit = '1';
    $('m21d').textContent = host.dataset.hit ? 'Done: all the heat that came in left again as work, so ΔE = 0.' : '';
  };
  $('m21q').addEventListener('input', e => { q = Number(e.target.value); draw(); });
  $('m21w').addEventListener('input', e => { w = Number(e.target.value); draw(); });
  draw();
}

/* 2.2 Specific heat: the same heat into the same mass of two materials. */
const MAT = [['water', 4.18], ['ethanol', 2.44], ['aluminum', 0.897], ['iron', 0.449], ['copper', 0.385], ['gold', 0.129]];
function m22(host) {
  let sel = [0, 4], m = 50, q = 1000;
  const pick = k => `<label>${k ? 'Right' : 'Left'} <select data-s="${k}">${MAT.map(([n, c], i) => `<option value="${i}"${i === sel[k] ? ' selected' : ''}>${n} (${c} J/g·°C)</option>`).join('')}</select></label>`;
  const $ = shell(host, { label: 'specific heat', title: 'Same heat, different rise', sub: 'Both samples have the same mass, start at 20.0 °C and absorb the same heat.',
    body: `<div class="pick">${pick(0)}${pick(1)}</div>
      <svg viewBox="0 0 520 216" role="img" aria-labelledby="m22t"><title id="m22t">Two samples on burners, each with a thermometer</title><g id="m22g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m22m', 'Mass of each', 10, 200, 5, m)}${slider('m22q', 'Heat added to each', 0, 5000, 50, q)}</div>
      <p class="margin" id="m22e" aria-live="polite"></p>` });
  const draw = () => {
    const out = sel.map((si, k) => {
      const [name, c] = MAT[si], dT = q / (m * c), T = 20 + dT, x = 40 + k * 250, lvl = Math.min(1, dT / 80), off = T > 100;
      return { name, c, dT, g: `<g transform="translate(${x} 0)"><rect x="0" y="118" width="120" height="62" rx="4" fill="color-mix(in srgb, var(--part) ${k ? 22 : 40}%, var(--paper))" stroke="currentColor" stroke-width="1.5"/><text x="60" y="146" text-anchor="middle" font-weight="650">${name}</text><text x="60" y="165" text-anchor="middle" font-size="12.5">${m} g</text>
        ${[0, 1, 2].map(i => arrow(30 + i * 30, 208, 30 + i * 30, 186, HOT, 1 + q / 2500)).join('')}
        <rect x="150" y="28" width="14" height="152" rx="7" fill="var(--paper)" stroke="currentColor" stroke-width="1.4"/><rect x="153" y="${176 - 26 - lvl * 120}" width="8" height="${26 + lvl * 120}" rx="4" fill="${HOT}"/><circle cx="157" cy="180" r="11" fill="${HOT}"/>
        ${[20, 60, 100].map(t => `<path d="M166 ${150 - (t - 20) * 1.5}h6" stroke="currentColor"/><text x="175" y="${154 - (t - 20) * 1.5}" font-size="11">${t}</text>`).join('')}
        <text x="60" y="60" text-anchor="middle" font-size="19" font-weight="650">${off ? 'over 100 °C' : T.toFixed(1) + ' °C'}</text><text x="60" y="82" text-anchor="middle">ΔT = +${dT.toFixed(1)} °C</text></g>` };
    });
    $('m22g').innerHTML = out.map(o => o.g).join('');
    $('m22m' + 'o').textContent = `${m} g`; $('m22q' + 'o').textContent = `${q} J`;
    const [a, b] = out, big = a.dT >= b.dT ? a : b, small = a.dT >= b.dT ? b : a;
    $('m22e').innerHTML = `ΔT = q ÷ (m × Cₛ) = ${q} J ÷ (${m} g × ${big.c}) = ${big.dT.toFixed(1)} °C for ${esc(big.name)}<small>${a.c === b.c ? 'Same material, same rise.' : `${esc(small.name)} needs ${small.c} J to warm each gram by one degree, ${(small.c / big.c).toFixed(1)} times as much as ${esc(big.name)}, so the same heat warms it ${(small.c / big.c).toFixed(1)} times less.`}</small>`;
  };
  host.querySelectorAll('[data-s]').forEach(el => el.addEventListener('change', () => { sel[el.dataset.s] = Number(el.value); draw(); }));
  $('m22m').addEventListener('input', e => { m = Number(e.target.value); draw(); });
  $('m22q').addEventListener('input', e => { q = Number(e.target.value); draw(); });
  draw();
}

/* 2.3 Calorimetry: a hot block in cool water. Two temperature traces meet; heat lost equals heat gained. */
const METAL = [['aluminum', 0.897], ['iron', 0.449], ['copper', 0.385], ['lead', 0.129]];
function m23(host) {
  let k = 1, mm = 50, Tm = 95, mw = 100;
  const $ = shell(host, { label: 'calorimetry', title: 'Hot metal into cool water', sub: 'The water starts at 20.0 °C in an insulated cup. Watch the two temperatures meet.',
    body: `${chips('k', METAL.map(x => x[0]), k, 'Metal')}
      <svg viewBox="0 0 520 226" role="img" aria-labelledby="m23t"><title id="m23t">Temperature against time for the metal and the water, and bars for the heat each one loses or gains</title><g id="m23g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m23a', 'Mass of metal', 10, 100, 1, mm)}${slider('m23b', 'Metal starts at', 40, 100, 1, Tm)}${slider('m23c', 'Mass of water', 50, 200, 5, mw)}</div>
      <p class="margin" id="m23e" aria-live="polite"></p>` });
  const draw = () => {
    const c = METAL[k][1], Tf = (mm * c * Tm + mw * 4.184 * 20) / (mm * c + mw * 4.184), qw = mw * 4.184 * (Tf - 20), y = T => 196 - T * 1.7, X = t => 44 + t * 250;
    const curve = T0 => Array.from({ length: 41 }, (_, i) => { const t = i / 40; return `${X(t).toFixed(1)},${y(Tf + (T0 - Tf) * Math.exp(-t / 0.16)).toFixed(1)}`; }).join(' ');
    const L = Math.min(84, 14 + qw / 60);
    $('m23g').innerHTML = `<path d="M44 20v176h256" fill="none" stroke="currentColor" stroke-width="1.3"/>${[0, 20, 40, 60, 80, 100].map(t => `<path d="M40 ${y(t)}h4" stroke="currentColor"/><text x="36" y="${y(t) + 4}" text-anchor="end" font-size="11">${t}</text>`).join('')}
      <text x="170" y="214" text-anchor="middle" font-size="12" font-style="italic">time →</text><text x="12" y="16" font-size="12" font-style="italic">°C</text>
      <path d="M44 ${y(Tf)}h256" stroke="currentColor" stroke-dasharray="4 4" opacity="0.6"/>
      <polyline points="${curve(Tm)}" fill="none" stroke="${HOT}" stroke-width="2.6"/><polyline points="${curve(20)}" fill="none" stroke="${COLD}" stroke-width="2.6"/>
      <text x="52" y="${y(Tm) - 6}" fill="${HOT}" font-weight="650">${esc(METAL[k][0])}</text><text x="52" y="${y(20) + 16}" fill="${COLD}" font-weight="650">water</text><text x="296" y="${y(Tf) - 7}" text-anchor="end" font-weight="650">both end at ${Tf.toFixed(1)} °C</text>
      <text x="410" y="18" text-anchor="middle" font-size="12.5">heat moved</text><path d="M330 112h160" stroke="currentColor"/>
      <rect x="352" y="112" width="48" height="${L}" fill="${HOT}" opacity="0.8"/><rect x="420" y="${112 - L}" width="48" height="${L}" fill="${COLD}" opacity="0.8"/>
      <text x="376" y="${112 + L + 15}" text-anchor="middle" font-weight="650">−${qw.toFixed(0)} J</text><text x="444" y="${112 - L - 7}" text-anchor="middle" font-weight="650">+${qw.toFixed(0)} J</text>
      <text x="376" y="102" text-anchor="middle" font-size="12">metal loses</text><text x="444" y="128" text-anchor="middle" font-size="12">water gains</text>`;
    $('m23a' + 'o').textContent = `${mm} g`; $('m23b' + 'o').textContent = `${Tm} °C`; $('m23c' + 'o').textContent = `${mw} g`;
    $('m23e').innerHTML = `−q(metal) = q(water) = ${mw} g × 4.184 × (+${(Tf - 20).toFixed(2)} °C) = ${qw.toFixed(0)} J<small>The metal falls ${(Tm - Tf).toFixed(1)} °C while the water rises only ${(Tf - 20).toFixed(2)} °C. The heat is the same; water’s large specific heat makes its change small.</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  $('m23a').addEventListener('input', e => { mm = Number(e.target.value); draw(); });
  $('m23b').addEventListener('input', e => { Tm = Number(e.target.value); draw(); });
  $('m23c').addEventListener('input', e => { mw = Number(e.target.value); draw(); });
  draw();
}

/* 2.4 Enthalpy: reactants on one shelf, products on another. Reverse or scale the equation and ΔH follows. */
const ENTH = [
  { L: [[2, 'H₂(g)'], [1, 'O₂(g)']], R: [[2, 'H₂O(l)']], dH: -572 }, { L: [[1, 'C(s)'], [1, 'O₂(g)']], R: [[1, 'CO₂(g)']], dH: -393.5 },
  { L: [[1, 'N₂(g)'], [1, 'O₂(g)']], R: [[2, 'NO(g)']], dH: 180.5 }, { L: [[1, 'CaCO₃(s)']], R: [[1, 'CaO(s)'], [1, 'CO₂(g)']], dH: 178 },
];
const side = (list, m = 1) => list.map(([n, f]) => co(n * m) + f).join(' + ');
function m24(host) {
  let r = 0, rev = false, mult = 1;
  const MULT = [0.5, 1, 2];
  const $ = shell(host, { label: 'enthalpy diagram', title: 'Two shelves and the gap between them', sub: 'The height of each shelf is the enthalpy of what stands on it. ΔH is the step from reactants to products.',
    body: `${chips('r', ENTH.map(x => `${side(x.L)} → ${side(x.R)}`.replace(/\((s|l|g)\)/g, '')), 0, 'Reaction')}
      <svg viewBox="0 0 520 210" role="img" aria-labelledby="m24t"><title id="m24t">An enthalpy diagram with a shelf for the reactants and a shelf for the products</title><g id="m24g" ${SVGT}></g></svg>
      <div class="pick"><button type="button" class="btn2 ghost sm" id="m24v">Reverse the equation</button>${chips('m', ['× ½', '× 1', '× 2'], 1, 'Multiply the equation')}</div>
      <p class="margin" id="m24e" aria-live="polite"></p>` });
  const draw = () => {
    const x = ENTH[r], dH = x.dH * mult * (rev ? -1 : 1), A = rev ? x.R : x.L, B = rev ? x.L : x.R, exo = dH < 0, gap = Math.max(26, Math.min(120, Math.abs(dH) / 7)), yA = exo ? 50 : 50 + gap, yB = exo ? 50 + gap : 50, col = exo ? HOT : COLD;
    $('m24g').innerHTML = `${arrow(26, 196, 26, 16, 'currentColor', 1.4)}<text x="34" y="22" font-size="12" font-style="italic">enthalpy, H</text>
      <path d="M60 ${yA}h170" stroke="currentColor" stroke-width="2.6"/><text x="145" y="${yA - 9}" text-anchor="middle" font-weight="650">${side(A, mult)}</text><text x="145" y="${yA + 17}" text-anchor="middle" font-size="12" font-style="italic">reactants</text>
      <path d="M300 ${yB}h170" stroke="currentColor" stroke-width="2.6"/><text x="385" y="${yB - 9}" text-anchor="middle" font-weight="650">${side(B, mult)}</text><text x="385" y="${yB + 17}" text-anchor="middle" font-size="12" font-style="italic">products</text>
      <path d="M230 ${yA}h70" stroke="currentColor" stroke-dasharray="3 4" opacity="0.6"/>${arrow(265, yA, 265, yB, col, 3.2)}
      <text x="265" y="${Math.max(yA, yB) + 34}" text-anchor="middle" font-size="18" font-weight="650" fill="${col}">ΔH = ${sj(dH)} kJ</text>
      ${exo ? [0, 1, 2].map(i => arrow(410 + i * 22, yB + 28, 428 + i * 22, yB + 58, HOT, 1.8)).join('') + `<text x="436" y="${yB + 76}" text-anchor="middle" font-size="12">heat out to the surroundings</text>` : [0, 1, 2].map(i => arrow(74 + i * 22, yA + 58, 92 + i * 22, yA + 28, COLD, 1.8)).join('') + `<text x="104" y="${yA + 76}" text-anchor="middle" font-size="12">heat in from the surroundings</text>`}`;
    $('m24v').setAttribute('aria-pressed', String(rev));
    $('m24e').innerHTML = `${side(A, mult)} → ${side(B, mult)}   ΔH = ${sj(dH)} kJ<small>${exo ? 'Exothermic: the products sit lower, and the difference leaves as heat.' : 'Endothermic: the products sit higher, and the difference has to be supplied as heat.'} ${rev ? 'Reversing the equation swaps the shelves, so the sign of ΔH changes. ' : ''}${mult !== 1 ? `Multiplying the equation by ${mult === 2 ? '2' : '½'} multiplies ΔH by the same number.` : ''}</small>`;
  };
  onChips(host, 'r', i => { r = i; rev = false; draw(); });
  onChips(host, 'm', i => { mult = MULT[i]; draw(); });
  $('m24v').addEventListener('click', () => { rev = !rev; draw(); });
  draw();
}

/* 2.5 Hess's law: reverse and multiply the step equations until they add up to the target. */
const HESS = [
  { target: { L: { 'N₂': 1, 'O₂': 2 }, R: { 'NO₂': 2 } }, steps: [{ L: { 'N₂': 1, 'O₂': 1 }, R: { 'NO': 2 }, dH: 180.5 }, { L: { 'NO₂': 2 }, R: { 'NO': 2, 'O₂': 1 }, dH: 114.1 }] },
  { target: { L: { 'C': 1, 'H₂': 2 }, R: { 'CH₄': 1 } }, steps: [{ L: { 'C': 1, 'O₂': 1 }, R: { 'CO₂': 1 }, dH: -393.5 }, { L: { 'H₂': 1, 'O₂': 0.5 }, R: { 'H₂O': 1 }, dH: -285.8 }, { L: { 'CH₄': 1, 'O₂': 2 }, R: { 'CO₂': 1, 'H₂O': 2 }, dH: -890.3 }] },
  { target: { L: { 'NO': 1, 'O₂': 0.5 }, R: { 'NO₂': 1 } }, steps: [{ L: { 'NO': 2, 'O₂': 1 }, R: { 'NO₂': 2 }, dH: -114.1 }] },
];
const eqn = (L, R) => `${Object.entries(L).map(([f, n]) => co(n) + f).join(' + ') || 'nothing'} → ${Object.entries(R).map(([f, n]) => co(n) + f).join(' + ') || 'nothing'}`;
function m25(host) {
  let p = 0, st = [];
  const MULTS = [0.5, 1, 2, 3];
  const $ = shell(host, { label: 'Hess’s law', title: 'Make the steps add up to the target', sub: 'Reverse a step or multiply it. Whatever you do to the equation happens to its ΔH. Species on both sides of the sum cancel.',
    body: `${chips('p', HESS.map(h => eqn(h.target.L, h.target.R)), 0, 'Target reaction')}
      <p class="lab">Target</p><p class="rxnline" id="m25t"></p><p class="lab">Steps</p><div id="m25s"></div>
      <p class="lab">Sum of the steps</p><p class="rxnline" id="m25n"></p><p class="margin" id="m25e" aria-live="polite"></p>` });
  const draw = () => {
    const h = HESS[p], net = {};
    let total = 0;
    $('m25t').textContent = eqn(h.target.L, h.target.R);
    $('m25s').innerHTML = h.steps.map((s, i) => {
      const { rev, m } = st[i], A = rev ? s.R : s.L, B = rev ? s.L : s.R, dH = s.dH * m * (rev ? -1 : 1), sc = o => Object.fromEntries(Object.entries(o).map(([f, n]) => [f, n * m]));
      total += dH;
      for (const [f, n] of Object.entries(A)) net[f] = (net[f] ?? 0) - n * m;
      for (const [f, n] of Object.entries(B)) net[f] = (net[f] ?? 0) + n * m;
      return `<div class="hstep"><span class="rxnline">${eqn(sc(A), sc(B))}</span><b>${sj(dH)} kJ</b><span class="hbtn"><button type="button" class="btn2 ghost sm" data-rev="${i}" aria-pressed="${rev}">reverse</button><span class="stepper"><button type="button" data-m="${i}-" aria-label="Smaller multiplier for step ${i + 1}">−</button><output>×${m === 0.5 ? '½' : m}</output><button type="button" data-m="${i}+" aria-label="Larger multiplier for step ${i + 1}">+</button></span></span></div>`;
    }).join('');
    const L = {}, R = {}, gone = [];
    for (const [f, n] of Object.entries(net)) { if (Math.abs(n) < 1e-9) gone.push(f); else if (n < 0) L[f] = -n; else R[f] = n; }
    $('m25n').textContent = eqn(L, R);
    const tn = {}; for (const [f, n] of Object.entries(h.target.L)) tn[f] = -n; for (const [f, n] of Object.entries(h.target.R)) tn[f] = n;
    const live = Object.entries(net).filter(([, n]) => Math.abs(n) > 1e-9), ok = live.length === Object.keys(tn).length && live.every(([f, n]) => Math.abs((tn[f] ?? 99) - n) < 1e-9);
    $('m25e').innerHTML = ok ? `matches the target ✓  ΔH = ${sj(total)} kJ<small>${gone.length ? `${gone.join(', ')} cancelled: the same amount on both sides of the sum. ` : ''}Enthalpy is a state function, so the route does not matter.</small>`
      : `not the target yet: the steps now add up to ${sj(total)} kJ<small>Put each target reactant on the left and each target product on the right, in the right amount. Anything not in the target must appear on both sides so that it cancels.</small>`;
    $('m25s').querySelectorAll('[data-rev]').forEach(b => b.addEventListener('click', () => { st[b.dataset.rev].rev = !st[b.dataset.rev].rev; draw(); }));
    $('m25s').querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { const i = parseInt(b.dataset.m, 10), j = MULTS.indexOf(st[i].m) + (b.dataset.m.endsWith('+') ? 1 : -1); st[i].m = MULTS[Math.max(0, Math.min(MULTS.length - 1, j))]; draw(); }));
  };
  const reset = () => { st = HESS[p].steps.map(() => ({ rev: false, m: 1 })); draw(); };
  onChips(host, 'p', i => { p = i; reset(); });
  reset();
}

/* 2.6 Enthalpies of formation: the elements are the shared zero; products minus reactants. */
const HF = { 'CO': -110.5, 'CO₂': -393.5, 'NH₃': -45.9, 'NO': 90.3, 'NO₂': 33.2, 'Fe₂O₃': -824.2 };
const FORM = [
  { L: [[2, 'CO'], [1, 'O₂']], R: [[2, 'CO₂']] }, { L: [[1, 'N₂'], [3, 'H₂']], R: [[2, 'NH₃']] },
  { L: [[2, 'NO'], [1, 'O₂']], R: [[2, 'NO₂']] }, { L: [[1, 'Fe₂O₃'], [3, 'CO']], R: [[2, 'Fe'], [3, 'CO₂']] }, { L: [[1, 'N₂'], [1, 'O₂']], R: [[2, 'NO']] },
];
function m26(host) {
  let r = 0;
  const $ = shell(host, { label: 'enthalpies of formation', title: 'Measure everything from the elements', sub: 'Every element in its standard state sits at zero. A compound sits at its ΔH°f, above or below.',
    body: `${chips('r', FORM.map(x => `${side(x.L)} → ${side(x.R)}`), 0, 'Reaction')}
      <svg viewBox="0 0 520 200" role="img" aria-labelledby="m26t"><title id="m26t">Total enthalpy of formation of the reactants and of the products, measured from the elements at zero</title><g id="m26g" ${SVGT}></g></svg>
      <table class="tally" id="m26tb"></table><p class="margin" id="m26e" aria-live="polite"></p>` });
  const draw = () => {
    const x = FORM[r], tot = list => list.reduce((s, [n, f]) => s + n * (HF[f] ?? 0), 0), a = tot(x.L), b = tot(x.R), dH = b - a;
    const span = Math.max(60, Math.abs(a), Math.abs(b)), up = Math.max(0, a, b), dn = Math.max(0, -a, -b), S = 150 / Math.max(up + dn, span), y0 = 24 + up * S, y = v => y0 - v * S, col = dH < 0 ? HOT : COLD;
    $('m26g').innerHTML = `<path d="M30 ${y0}h470" stroke="currentColor" stroke-dasharray="5 4"/><text x="496" text-anchor="end" y="${y0 - 6}" font-size="12" font-style="italic">elements in their standard states: 0 kJ</text>
      <path d="M40 ${y(a)}h130" stroke="currentColor" stroke-width="2.6"/><text x="105" y="${y(a) + (a > 0 ? -8 : 17)}" text-anchor="middle" font-weight="650">reactants: ${sj(a)} kJ</text>
      <path d="M230 ${y(b)}h130" stroke="currentColor" stroke-width="2.6"/><text x="295" y="${y(b) + (b > 0 ? -8 : 17)}" text-anchor="middle" font-weight="650">products: ${sj(b)} kJ</text>
      ${Math.abs(y(a) - y(b)) > 10 ? arrow(200, y(a), 200, y(b), col, 3) : `<circle cx="200" cy="${y(a)}" r="4" fill="${col}"/>`}<text x="378" y="${(y(a) + y(b)) / 2 + 6}" font-size="17" font-weight="650" fill="${col}">ΔH° = ${sj(dH)} kJ</text>`;
    const row = ([n, f], s) => `<tr><td>${s}</td><td>${f}</td><td>${n} mol</td><td>${HF[f] === undefined ? '0 (an element)' : sj(HF[f])}</td><td>${sj(n * (HF[f] ?? 0))}</td></tr>`;
    $('m26tb').innerHTML = `<tr><th></th><th>Substance</th><th>Amount</th><th>ΔH°f, kJ/mol</th><th>n × ΔH°f, kJ</th></tr>${x.R.map(t => row(t, 'product')).join('')}${x.L.map(t => row(t, 'reactant')).join('')}`;
    $('m26e').innerHTML = `ΔH° = (${sj(b)}) − (${sj(a)}) = ${sj(dH)} kJ<small>Products minus reactants, each multiplied by its coefficient. Elements add nothing: they are the zero.</small>`;
  };
  onChips(host, 'r', i => { r = i; draw(); });
  draw();
}

/* 2.7 Light: stretch the wavelength; frequency and photon energy follow. */
export function colourOf(nm) {
  if (nm < 380 || nm > 750) return null;
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
  const f = nm < 420 ? 0.4 + 0.6 * (nm - 380) / 40 : nm > 700 ? 0.4 + 0.6 * (750 - nm) / 50 : 1;
  return `rgb(${[r, g, b].map(v => Math.round(255 * v * f)).join(',')})`;
}
const hP = 6.626e-34, cL = 3.00e8;
function m27(host) {
  let nm = 532;
  const $ = shell(host, { label: 'light waves', title: 'Squeeze the wave', sub: 'All light travels at the same speed, so a shorter wavelength means more waves pass each second.',
    body: `<svg viewBox="0 0 520 206" role="img" aria-labelledby="m27t"><title id="m27t">A light wave drawn above the spectrum, with its frequency and photon energy</title><g id="m27g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m27l', 'Wavelength, λ', 100, 1000, 2, nm)}</div><p class="margin" id="m27e" aria-live="polite"></p>` });
  const strip = Array.from({ length: 75 }, (_, i) => { const w = 380 + i * 5; return `<rect x="${20 + (w - 100) / 900 * 480}" y="150" width="2.9" height="16" fill="${colourOf(w + 2)}"/>`; }).join('');
  const draw = () => {
    const nu = cL / (nm * 1e-9), E = hP * nu, col = colourOf(nm), px = nm * 0.13, band = nm < 380 ? 'ultraviolet: too short to see' : nm > 750 ? 'infrared: too long to see' : 'visible light';
    const pts = Array.from({ length: 241 }, (_, i) => `${20 + i * 2},${(64 - 34 * Math.sin(i * 2 / px * 2 * Math.PI)).toFixed(1)}`).join(' ');
    $('m27g').innerHTML = `<polyline points="${pts}" fill="none" stroke="${col ?? 'var(--ink-2)'}" stroke-width="3" ${col ? '' : 'stroke-dasharray="6 4"'}/>
      <path d="M20 112h${px}M20 106v12M${20 + px} 106v12" stroke="currentColor" stroke-width="1.4"/><text x="${Math.max(20, 20 + px / 2 - 14)}" y="130" font-size="12.5">λ = ${nm} nm</text>
      <rect x="20" y="150" width="480" height="16" fill="var(--paper-2)" stroke="currentColor" stroke-width="0.8"/>${strip}
      <path d="M${20 + (nm - 100) / 900 * 480} 142v32" stroke="currentColor" stroke-width="2.6"/>
      <text x="22" y="186" font-size="11.5">ultraviolet</text><text x="250" y="186" font-size="11.5" text-anchor="middle">visible</text><text x="498" y="186" font-size="11.5" text-anchor="end">infrared</text>
      <text x="20" y="202" font-size="11.5" font-style="italic">← more energy in each photon</text><text x="500" y="202" font-size="11.5" font-style="italic" text-anchor="end">less energy →</text>
      <text x="500" y="20" text-anchor="end" font-weight="650">${band}</text>`;
    $('m27l' + 'o').textContent = `${nm} nm`;
    $('m27e').innerHTML = `ν = c ÷ λ = ${sci(nu)} s⁻¹     E = hν = ${sci(E)} J<small>λ must be in metres: ${nm} nm = ${sci(nm * 1e-9)} m. Halve the wavelength and both the frequency and the energy of each photon double.</small>`;
  };
  $('m27l').addEventListener('input', e => { nm = Number(e.target.value); draw(); });
  draw();
}

export default { '2.1': m21, '2.2': m22, '2.3': m23, '2.4': m24, '2.5': m25, '2.6': m26, '2.7': m27 };
