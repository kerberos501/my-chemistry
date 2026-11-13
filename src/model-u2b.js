// Working models for Part 2, lessons 2.8 to 2.14: the atom, its electrons and the periodic trends.
import { esc, sci, subn, supn, shell, chips, onChips, slider, SVGT } from './model-kit.js';
import { colourOf } from './model-u2a.js';

const SYM = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
const stepper = (id, lab) => `<span class="stepper"><button type="button" data-st="${id}-" aria-label="Lower ${lab}">−</button><output id="${id}"></output><button type="button" data-st="${id}+" aria-label="Raise ${lab}">+</button></span>`;
const onSteppers = (host, fn) => host.querySelectorAll('[data-st]').forEach(b => b.addEventListener('click', () => fn(b.dataset.st.slice(0, -1), b.dataset.st.endsWith('+') ? 1 : -1)));

/* 2.8 The hydrogen atom: a ladder of levels. Pick a jump and see the photon. */
function m28(host) {
  let ni = 4, nf = 2;
  const $ = shell(host, { label: 'hydrogen energy levels', title: 'Jump between the levels', sub: 'The rungs are the only energies the electron can have. Choose where it starts and where it ends.',
    body: `<div class="pick"><span>Starts at n = ${stepper('m28i', 'the starting level')}</span><span>Ends at n = ${stepper('m28f', 'the final level')}</span></div>
      <svg viewBox="0 0 520 250" role="img" aria-labelledby="m28t"><title id="m28t">The energy levels of hydrogen with an arrow for the chosen jump, above the visible lines of its spectrum</title><g id="m28g" ${SVGT}></g></svg>
      <p class="margin" id="m28e" aria-live="polite"></p>` });
  const y = n => 26 + 168 / (n * n), LINES = [[3, 656], [4, 486], [5, 434], [6, 410]];
  const draw = () => {
    const dE = -2.18e-18 * (1 / nf ** 2 - 1 / ni ** 2), lam = dE ? 6.626e-34 * 3.00e8 / Math.abs(dE) * 1e9 : 0, col = colourOf(lam), emit = dE < 0;
    const series = Math.min(ni, nf) === 1 ? 'ultraviolet' : Math.min(ni, nf) === 2 ? (col ? 'visible' : 'ultraviolet') : 'infrared';
    const a = Math.atan2(y(nf) - y(ni), 0) > 0 ? 1 : -1, x = 150;
    $('m28g').innerHTML = [1, 2, 3, 4, 5, 6].map(n => `<path d="M60 ${y(n)}h220" stroke="currentColor" stroke-width="${n === ni || n === nf ? 2.6 : 1.2}"/>${n < 4 ? `<text x="52" y="${y(n) + 4}" text-anchor="end" font-size="12.5">n = ${n}</text><text x="288" y="${y(n) + 4}" font-size="11.5">${(-2.18 / (n * n)).toFixed(3).replace('-', '−')} × 10⁻¹⁸ J</text>` : ''}`).join('')
      + `<text x="52" y="36" text-anchor="end" font-size="11.5">4, 5, 6 …</text><path d="M60 20h220" stroke="currentColor" stroke-dasharray="3 4" opacity="0.6"/><text x="288" y="16" font-size="11.5">0: the electron is free</text>`
      + (dE ? `<path d="M${x} ${y(ni)}V${y(nf) - a * 3}" stroke="${col ?? 'var(--ink-2)'}" stroke-width="4"/><path d="M${x - 8} ${y(nf) - a * 11}l8 ${a * 10} 8 ${-a * 10}" fill="none" stroke="${col ?? 'var(--ink-2)'}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${x}" cy="${y(nf)}" r="6" fill="var(--part)"/>
        <path d="M${emit ? 176 : 240} ${(y(ni) + y(nf)) / 2}q8 -12 16 0t16 0 16 0 16 0" fill="none" stroke="${col ?? 'var(--ink-2)'}" stroke-width="2.4"/><text x="${250}" y="${(y(ni) + y(nf)) / 2 - 12}" font-size="12">photon ${emit ? 'out →' : '→ in'}</text>` : `<circle cx="${x}" cy="${y(ni)}" r="6" fill="var(--part)"/>`)
      + `<rect x="60" y="212" width="440" height="20" fill="#111"/>${LINES.map(([n, w]) => `<rect x="${60 + (w - 380) / 370 * 440 - 1.5}" y="212" width="3" height="20" fill="${colourOf(w)}"/>`).join('')}
        ${col && Math.min(ni, nf) === 2 ? `<path d="M${60 + (lam - 380) / 370 * 440} 206v32" stroke="currentColor" stroke-width="1.6"/>` : ''}
        <text x="60" y="246" font-size="11.5">400 nm</text><text x="500" y="246" font-size="11.5" text-anchor="end">750 nm</text><text x="280" y="246" font-size="11.5" text-anchor="middle" font-style="italic">the visible lines of hydrogen (every one ends on n = 2)</text>`;
    $('m28i').textContent = ni; $('m28f').textContent = nf;
    $('m28e').innerHTML = !dE ? 'no jump: choose two different levels'
      : `ΔE = ${sci(dE)} J    λ = hc ÷ |ΔE| = ${sci(lam)} nm (${series})<small>${emit ? 'The electron falls, so the atom loses energy (ΔE is negative) and a photon carries it away.' : 'The electron climbs, so the atom must absorb a photon of exactly this energy (ΔE is positive).'} The rungs crowd together higher up: jumps to and from n = 1 are by far the largest.</small>`;
  };
  onSteppers(host, (id, d) => { if (id === 'm28i') ni = Math.max(1, Math.min(6, ni + d)); else nf = Math.max(1, Math.min(6, nf + d)); draw(); });
  draw();
}

/* 2.9 Orbitals: only some sets of quantum numbers exist. Pick one and see the orbital. */
const LET = ['s', 'p', 'd', 'f'];
function m29(host) {
  let n = 2, l = 1, m = 0;
  const row = (attr, label, vals, show) => `<div class="qrow"><span>${label}</span>${vals.map(v => `<button type="button" data-${attr}="${v}">${show(v)}</button>`).join('')}</div>`;
  const $ = shell(host, { label: 'quantum numbers', title: 'Which orbitals exist?', sub: 'Choose n, then l, then mₗ. Choices that are not allowed are greyed out.',
    body: `${row('n', 'n', [1, 2, 3, 4], v => v)}${row('l', 'l', [0, 1, 2, 3], v => `${v} (${LET[v]})`)}${row('m', 'mₗ', [-3, -2, -1, 0, 1, 2, 3], v => String(v).replace('-', '−'))}
      <svg viewBox="0 0 520 190" role="img" aria-labelledby="m29t"><title id="m29t">The shape of the chosen orbital, beside a map of every orbital in the shell</title><g id="m29g" ${SVGT}></g></svg>
      <p class="margin" id="m29e" aria-live="polite"></p>` });
  const lobe = (ang, len, wid) => `<ellipse cx="${len / 2 + 4}" cy="0" rx="${len / 2}" ry="${wid}" transform="rotate(${ang})" fill="var(--part)" opacity="0.5" stroke="var(--part)" stroke-width="1.4"/>`;
  const draw = () => {
    const size = 26 + n * 10;
    let shape;
    if (l === 0) shape = `<circle r="${12 + n * 9}" fill="var(--part)" opacity="0.4" stroke="var(--part)" stroke-width="1.4"/>`;
    else if (l === 1) { const ang = { '-1': 0, 0: 90, 1: 35 }[m]; shape = lobe(ang, size, size * 0.3) + lobe(ang + 180, size, size * 0.3); }
    else if (l === 2) shape = m === 0 ? lobe(90, size, size * 0.26) + lobe(270, size, size * 0.26) + `<ellipse rx="${size * 0.5}" ry="${size * 0.16}" fill="none" stroke="var(--part)" stroke-width="5" opacity="0.6"/>` : [0, 90, 180, 270].map(a => lobe(a + (Math.abs(m) === 2 ? 0 : 45), size * 0.9, size * 0.22)).join('');
    else shape = [0, 60, 120, 180, 240, 300].map(a => lobe(a + m * 10, size * 0.9, size * 0.16)).join('');
    let map = '';
    for (let L = 0; L < n; L++) { map += `<text x="282" y="${40 + L * 34}" font-weight="650">${n}${LET[L]}</text>`; for (let k = -L; k <= L; k++) map += `<rect x="${318 + (k + L) * 27}" y="${24 + L * 34}" width="23" height="23" rx="3" fill="${L === l && k === m ? 'var(--part)' : 'var(--paper)'}" stroke="currentColor" stroke-width="1.2"/>`; }
    $('m29g').innerHTML = `<g transform="translate(130 96)">${shape}<circle r="3.2" fill="currentColor"/></g><text x="130" y="184" text-anchor="middle" font-size="12" font-style="italic">${['a sphere', 'two lobes', m === 0 ? 'two lobes and a ring' : 'four lobes', 'a more complicated shape'][l]}; the dot is the nucleus</text>
      ${map}<text x="282" y="${40 + n * 34}" font-size="12.5">shell n = ${n}: ${n * n} orbital${n > 1 ? 's' : ''}, up to ${2 * n * n} electrons</text>`;
    host.querySelectorAll('[data-n]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.n) === n)));
    host.querySelectorAll('[data-l]').forEach(b => { const v = Number(b.dataset.l); b.disabled = v >= n; b.setAttribute('aria-pressed', String(v === l)); });
    host.querySelectorAll('[data-m]').forEach(b => { const v = Number(b.dataset.m); b.disabled = Math.abs(v) > l; b.setAttribute('aria-pressed', String(v === m)); });
    $('m29e').innerHTML = `a ${n}${LET[l]} orbital: n = ${n}, l = ${l}, mₗ = ${String(m).replace('-', '−')}<small>l runs from 0 to n − 1, so shell ${n} has ${n} kind${n > 1 ? 's' : ''} of subshell. mₗ runs from −l to +l, so ${l ? 'a' : 'an'} ${LET[l]} subshell has ${2 * l + 1} orbital${l ? 's' : ''} and holds ${2 * (2 * l + 1)} electrons: two per orbital, with mₛ = +½ and −½.</small>`;
  };
  host.querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => { n = Number(b.dataset.n); l = Math.min(l, n - 1); m = Math.max(-l, Math.min(l, m)); draw(); }));
  host.querySelectorAll('[data-l]').forEach(b => b.addEventListener('click', () => { l = Number(b.dataset.l); m = Math.max(-l, Math.min(l, m)); draw(); }));
  host.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { m = Number(b.dataset.m); draw(); }));
  draw();
}

/* 2.10 Electron configurations: deal the electrons in, one atomic number at a time. */
const ORDER = [['1s', 1], ['2s', 1], ['2p', 3], ['3s', 1], ['3p', 3], ['4s', 1], ['3d', 5], ['4p', 3]];
export function config(Z) {
  const occ = ORDER.map(() => 0);
  let left = Z;
  ORDER.forEach(([, k], i) => { occ[i] = Math.min(left, 2 * k); left -= occ[i]; });
  if (Z === 24 || Z === 29) { occ[5] = 1; occ[6] += 1; }
  return occ;
}
function m210(host) {
  let Z = 26;
  const $ = shell(host, { label: 'electron configurations', title: 'Deal in the electrons', sub: 'Slide through the elements. Each new electron takes the lowest free place; within a subshell they spread out before they pair.',
    body: `<svg viewBox="0 0 520 262" role="img" aria-labelledby="m210t"><title id="m210t">Orbital boxes filled with arrows for the chosen element, above a small periodic table coloured by block</title><g id="m210g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m210z', 'Atomic number', 1, 36, 1, Z)}</div><p class="margin" id="m210e" aria-live="polite"></p>` });
  const pos = z => (z === 1 ? [0, 0] : z === 2 ? [0, 17] : z <= 10 ? [1, z <= 4 ? z - 3 : z + 7] : z <= 18 ? [2, z <= 12 ? z - 11 : z - 1] : [3, z - 19]);
  const block = z => (z === 2 ? 's' : pos(z)[1] < 2 ? 's' : pos(z)[1] < 12 ? 'd' : 'p'), BC = { s: 'var(--u1)', p: 'var(--u3)', d: 'var(--u4)' };
  const draw = () => {
    const occ = config(Z);
    let x = 14, boxes = '', unpaired = 0;
    ORDER.forEach(([name, k], i) => {
      const yb = 118 - i * 12;
      for (let j = 0; j < k; j++) { const up = occ[i] > j, dn = occ[i] > k + j; if (up && !dn) unpaired++; boxes += `<rect x="${x + j * 23}" y="${yb}" width="21" height="28" rx="3" fill="var(--paper)" stroke="currentColor" stroke-width="1.2"/><text x="${x + j * 23 + 10.5}" y="${yb + 20}" text-anchor="middle" font-size="15" fill="var(--part)" font-weight="700">${up ? '↑' : ''}${dn ? '↓' : ''}</text>`; }
      boxes += `<text x="${x + k * 11.5 - 1}" y="${yb + 44}" text-anchor="middle" font-size="12.5" ${occ[i] ? 'font-weight="650"' : 'opacity="0.55"'}>${name}</text>`;
      x += k * 23 + 7;
    });
    const core = Z > 18 ? ['Ar', 5] : Z > 10 ? ['Ne', 3] : Z > 2 ? ['He', 1] : null, text = from => ORDER.map(([name], i) => (i >= from && occ[i] ? name + supn(occ[i]) : '')).filter(Boolean).join(' ');
    let table = '';
    for (let z = 1; z <= 36; z++) { const [r, c] = pos(z); table += `<rect x="${44 + c * 24}" y="${178 + r * 19}" width="22" height="17" rx="2" fill="${BC[block(z)]}" opacity="${z === Z ? 1 : z < Z ? 0.5 : 0.18}" ${z === Z ? 'stroke="currentColor" stroke-width="2"' : ''}/><text x="${55 + c * 24}" y="${190.5 + r * 19}" text-anchor="middle" font-size="9.5" ${z === Z ? 'fill="var(--paper)" font-weight="700"' : ''}>${SYM[z]}</text>`; }
    $('m210g').innerHTML = `<text x="14" y="18" font-size="12" font-style="italic">energy rises to the right →</text>${boxes}${table}
      <text x="150" y="191" text-anchor="middle" font-size="11.5" fill="var(--u1)">■ s block</text><text x="260" y="191" text-anchor="middle" font-size="11.5" fill="var(--u4)">■ d block</text><text x="370" y="191" text-anchor="middle" font-size="11.5" fill="var(--u3)">■ p block</text>`;
    $('m210z' + 'o').textContent = `${Z}  ${SYM[Z]}`;
    const val = Z <= 2 ? Z : ORDER.reduce((s, [name], i) => s + (Number(name[0]) === Math.max(...ORDER.filter((_, j) => occ[j]).map(([nm]) => Number(nm[0]))) ? occ[i] : 0), 0);
    $('m210e').innerHTML = `${SYM[Z]}: ${core ? `[${core[0]}] ${text(core[1])}`.trim() : text(0)}<small>${unpaired} unpaired electron${unpaired === 1 ? '' : 's'}; ${val} in the outermost shell.${Z === 24 || Z === 29 ? ` An exception: one 4s electron moves to 3d, because a ${Z === 24 ? 'half-filled' : 'filled'} d subshell is extra stable.` : Z > 20 && Z < 31 ? ' 4s filled first; the 3d subshell fills across the d block.' : ''}</small>`;
  };
  $('m210z').addEventListener('input', e => { Z = Number(e.target.value); draw(); });
  draw();
}

/* 2.11 The pull of the nucleus: core electrons screen the nucleus; a valence electron feels what is left. */
function m211(host) {
  let Z = 11;
  const $ = shell(host, { label: 'effective nuclear charge', title: 'What a valence electron feels', sub: 'The shaded core electrons sit between the nucleus and the outer shell and cancel part of its charge.',
    body: `<svg viewBox="0 0 520 250" role="img" aria-labelledby="m211t"><title id="m211t">An atom drawn as a nucleus, a core of inner electrons and an outer shell, with bars comparing the effective nuclear charge across the period</title><g id="m211g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m211z', 'Element', 3, 18, 1, Z)}</div><p class="margin" id="m211e" aria-live="polite"></p>` });
  const draw = () => {
    const core = Z <= 10 ? 2 : 10, zeff = Z - core, first = Z <= 10 ? 3 : 11, R = (Z <= 10 ? 78 : 104) - (zeff - 1) * 4.5, rc = Z <= 10 ? 24 : 46;
    let val = '';
    for (let i = 0; i < zeff; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / zeff; val += `<circle cx="${(R * Math.cos(a)).toFixed(1)}" cy="${(R * Math.sin(a)).toFixed(1)}" r="5.5" fill="var(--part)"/>`; }
    let bars = '';
    for (let z = first; z < first + 8; z++) { const e = z - core, i = z - first; bars += `<rect x="${300 + i * 26}" y="${190 - e * 17}" width="20" height="${e * 17}" fill="var(--part)" opacity="${z === Z ? 0.95 : 0.3}"/><text x="${310 + i * 26}" y="206" text-anchor="middle" font-size="11.5" ${z === Z ? 'font-weight="700"' : ''}>${SYM[z]}</text><text x="${310 + i * 26}" y="${184 - e * 17}" text-anchor="middle" font-size="11">+${e}</text>`; }
    $('m211g').innerHTML = `<g transform="translate(140 124)"><circle r="${R}" fill="none" stroke="currentColor" stroke-dasharray="3 5" opacity="0.6"/><circle r="${rc}" fill="var(--ink-2)" opacity="0.28"/>
      <text y="${rc - 8}" text-anchor="middle" font-size="11.5">${core} core e⁻</text><circle r="15" fill="var(--bad)"/><text y="4.5" text-anchor="middle" fill="#fff" font-weight="700" font-size="12.5">+${Z}</text>
      <path d="M0 ${-R + 9}V${-rc - 3}" stroke="var(--bad)" stroke-width="${1.5 + zeff * 0.9}" stroke-linecap="round"/>${val}</g>
      <text x="140" y="246" text-anchor="middle" font-size="12" font-style="italic">the red line is the pull on one valence electron</text>
      <text x="404" y="24" text-anchor="middle" font-size="12.5">effective nuclear charge across period ${Z <= 10 ? 2 : 3}</text>${bars}`;
    $('m211z' + 'o').textContent = `${Z}  ${SYM[Z]}`;
    $('m211e').innerHTML = `Z(eff) ≈ Z − core electrons = ${Z} − ${core} = +${zeff}<small>Across a period the nucleus gains a proton each step but the core stays the same, so the pull on the outer shell grows and the shell is drawn inward.${Z === 11 || Z === 3 ? ' A new period starts a new shell outside a bigger core, so the pull drops back to +1.' : ''}</small>`;
  };
  $('m211z').addEventListener('input', e => { Z = Number(e.target.value); draw(); });
  draw();
}

/* 2.12 Photoelectron spectra: one peak for each subshell. Approximate binding energies in MJ/mol. */
const PES = { 1: [1.31], 2: [2.37], 3: [6.26, 0.52], 4: [11.5, 0.90], 5: [19.3, 1.36, 0.80], 6: [28.6, 1.72, 1.09], 7: [39.6, 2.45, 1.40], 8: [52.6, 3.12, 1.31], 9: [67.2, 3.88, 1.68], 10: [84.0, 4.68, 2.08],
  11: [104, 6.84, 3.67, 0.50], 12: [126, 9.07, 5.31, 0.74], 13: [151, 12.1, 7.79, 1.09, 0.58], 14: [178, 15.1, 10.3, 1.46, 0.79], 15: [208, 18.7, 13.5, 1.95, 1.01], 16: [239, 22.7, 16.5, 2.05, 1.00],
  17: [273, 26.8, 20.2, 2.44, 1.25], 18: [309, 31.5, 24.1, 2.82, 1.52], 19: [347, 37.1, 29.1, 3.93, 2.38, 0.42], 20: [390, 42.7, 34.0, 4.65, 2.90, 0.59] };
function m212(host) {
  let Z = 8, quiz = null;
  const $ = shell(host, { label: 'photoelectron spectra', title: 'Read the peaks', sub: 'Each peak is one subshell. Further left means held more tightly; taller means more electrons.',
    body: `<svg viewBox="0 0 520 214" role="img" aria-labelledby="m212t"><title id="m212t">A photoelectron spectrum: peaks of different heights along a scale of binding energy</title><g id="m212g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m212z', 'Element', 1, 20, 1, Z)}</div>
      <p class="margin" id="m212e" aria-live="polite"></p>
      <p class="challenge"><b>Challenge.</b> <button type="button" class="btn2 sm" id="m212q">Show a mystery spectrum</button> <span id="m212o" class="chips" style="display:inline-flex;margin:0 0 0 6px"></span> <span id="m212d" aria-live="polite"></span></p>` });
  const X = be => 40 + (2.7 - Math.log10(be)) / 3.25 * 450;
  const draw = () => {
    const z = quiz ? quiz.z : Z, occ = config(z), names = ORDER.map(o => o[0]).filter((_, i) => occ[i]), ns = occ.filter(Boolean);
    $('m212g').innerHTML = `<path d="M40 176h460" stroke="currentColor" stroke-width="1.3"/>${[1, 2, 3, 4, 5, 6].map(e => `<path d="M40 ${176 - e * 23}h460" stroke="currentColor" stroke-dasharray="2 5" opacity="0.35"/><text x="34" y="${180 - e * 23}" text-anchor="end" font-size="11">${e}</text>`).join('')}
      ${[100, 10, 1].map(v => `<path d="M${X(v)} 176v5" stroke="currentColor"/><text x="${X(v)}" y="194" text-anchor="middle" font-size="11.5">${v}</text>`).join('')}
      <text x="40" y="210" font-size="12" font-style="italic">← held more tightly</text><text x="270" y="210" text-anchor="middle" font-size="12" font-style="italic">binding energy, MJ/mol</text><text x="500" y="210" text-anchor="end" font-size="12" font-style="italic">held less tightly →</text><text x="12" y="20" font-size="12" font-style="italic">electrons</text>
      ${PES[z].map((be, i) => { const h = ns[i] * 23, x = X(be); return `<path d="M${x - 7} 176L${x} ${176 - h}L${x + 7} 176z" fill="var(--part)" opacity="0.85"/>${quiz ? '' : `<text x="${x}" y="${168 - h}" text-anchor="middle" font-weight="650" font-size="12.5">${names[i]}${supn(ns[i])}</text>`}`; }).join('')}`;
    $('m212z' + 'o').textContent = quiz ? '?' : `${Z}  ${SYM[Z]}`;
    $('m212e').innerHTML = quiz ? 'which element is this?<small>Count the electrons peak by peak, starting from the left with 1s.</small>'
      : `${SYM[z]}: ${names.map((nm, i) => nm + supn(ns[i])).join(' ')}<small>${PES[z].length} peak${PES[z].length > 1 ? 's' : ''}, ${z} electron${z > 1 ? 's' : ''} in all. The 1s peak is furthest left: those electrons are closest to the nucleus and hardest to remove.</small>`;
  };
  $('m212z').addEventListener('input', e => { Z = Number(e.target.value); quiz = null; $('m212o').innerHTML = ''; $('m212d').textContent = ''; draw(); });
  $('m212q').addEventListener('click', () => {
    const z = 3 + Math.floor(Math.random() * 18), opts = [...new Set([z, Math.max(3, z - 2), Math.min(20, z + 1), Math.max(3, z - 1), Math.min(20, z + 3)])].slice(0, 4).sort((a, b) => a - b);
    quiz = { z }; $('m212d').textContent = '';
    $('m212o').innerHTML = opts.map(o => `<button type="button" data-g="${o}">${SYM[o]}</button>`).join('');
    $('m212o').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      if (Number(b.dataset.g) === z) { $('m212d').textContent = `Right: ${SYM[z]}, with ${z} electrons.`; Z = z; $('m212z').value = z; quiz = null; $('m212o').innerHTML = ''; draw(); } else { b.disabled = true; $('m212d').textContent = 'Not that one. Add up the peak heights.'; }
    }));
    draw();
  });
  draw();
}

/* 2.13 Size: main-group atoms drawn to scale, with their common ions. Radii in picometres. */
const RAD = { H: 37, He: 31, Li: 152, Be: 112, B: 85, C: 77, N: 75, O: 73, F: 72, Ne: 71, Na: 186, Mg: 160, Al: 143, Si: 118, P: 110, S: 103, Cl: 100, Ar: 98, K: 227, Ca: 197, Ga: 135, Ge: 122, As: 120, Se: 119, Br: 114, Kr: 112 };
const ION = { Li: [76, 1], Be: [45, 2], N: [146, -3], O: [140, -2], F: [133, -1], Na: [102, 1], Mg: [72, 2], Al: [54, 3], P: [212, -3], S: [184, -2], Cl: [181, -1], K: [138, 1], Ca: [100, 2], Se: [198, -2], Br: [196, -1] };
const GRID = [['H', null, null, null, null, null, null, 'He'], ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'], ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'], ['K', 'Ca', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr']];
const ich = q => (Math.abs(q) > 1 ? supn(Math.abs(q)) : '') + (q > 0 ? '⁺' : '⁻');
function m213(host) {
  let mode = 0, pick = 'Na';
  const $ = shell(host, { label: 'atomic and ionic radius', title: 'Atoms and ions, drawn to scale', sub: 'The main-group elements of the first four periods. Press an element to compare the atom with its ion.',
    body: `${chips('v', ['Atoms', 'Atoms and their ions', 'Ten-electron ions'], 0, 'View')}
      <svg viewBox="0 0 520 250" role="img" aria-labelledby="m213t"><title id="m213t">Circles for atoms and ions drawn to scale and arranged as in the periodic table</title><g id="m213g" ${SVGT}></g></svg>
      <p class="margin" id="m213e" aria-live="polite"></p>` });
  const S = 0.108;
  const draw = () => {
    let g = '';
    if (mode < 2) {
      GRID.forEach((row, r) => row.forEach((el, c) => { if (!el) return; const cx = 62 + c * 58, cy = 34 + r * 58, ion = ION[el];
        g += `<g data-el="${el}" style="cursor:pointer"><rect x="${cx - 28}" y="${cy - 28}" width="56" height="56" fill="${el === pick ? 'color-mix(in srgb, var(--part) 14%, transparent)' : 'transparent'}"/><circle cx="${cx}" cy="${cy}" r="${RAD[el] * S}" fill="var(--part)" opacity="${mode ? 0.25 : 0.6}"/>${mode && ion ? `<circle cx="${cx}" cy="${cy}" r="${ion[0] * S}" fill="none" stroke="${ion[1] > 0 ? 'var(--bad)' : 'var(--u1)'}" stroke-width="2.2"/>` : ''}<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11.5" font-weight="650">${el}</text></g>`; }));
      g += `<text x="14" y="246" font-size="11.5" font-style="italic">↓ larger down a group</text><text x="506" y="246" text-anchor="end" font-size="11.5" font-style="italic">smaller across a period →</text>`;
      if (mode) g += `<text x="150" y="20" font-size="11.5" fill="var(--bad)">○ cation: smaller</text><text x="290" y="20" font-size="11.5" fill="var(--u1)">○ anion: larger</text>`;
    } else {
      const iso = [['N', 7], ['O', 8], ['F', 9], ['Na', 11], ['Mg', 12], ['Al', 13]];
      let x = 16;
      iso.forEach(([el, p]) => { const [r, q] = ION[el], R = r * 0.26; x += R; g += `<circle cx="${x}" cy="110" r="${R}" fill="var(--part)" opacity="0.55"/><text x="${x}" y="114" text-anchor="middle" font-weight="650" font-size="12.5">${el}${ich(q)}</text><text x="${x}" y="184" text-anchor="middle" font-size="12">${p} p⁺</text><text x="${x}" y="202" text-anchor="middle" font-size="12">${r} pm</text>`; x += R + 10; });
      g += `<text x="260" y="24" text-anchor="middle" font-size="12.5">six ions, each with 10 electrons arranged like neon</text><text x="260" y="234" text-anchor="middle" font-size="12" font-style="italic">more protons pulling on the same ten electrons → a smaller ion</text>`;
    }
    $('m213g').innerHTML = g;
    const ion = ION[pick];
    $('m213e').innerHTML = mode === 2 ? `N³⁻ > O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺<small>Same electrons, different nuclei. Only the number of protons changes, so the ion with the most protons is the smallest.</small>`
      : `${pick}: ${RAD[pick]} pm${mode && ion ? `   →   ${pick}${ich(ion[1])}: ${ion[0]} pm` : ''}<small>${mode && ion ? (ion[1] > 0 ? 'The cation has lost its whole outer shell, and the same protons now pull on fewer electrons: much smaller.' : 'The anion has gained electrons that repel one another while the pull of the nucleus stays the same: larger.') : mode ? 'This element does not usually form a simple ion.' : 'Press any element. The circles are drawn to the same scale.'}</small>`;
    $('m213g').querySelectorAll('[data-el]').forEach(el => el.addEventListener('click', () => { pick = el.dataset.el; draw(); }));
  };
  onChips(host, 'v', i => { mode = i; draw(); });
  draw();
}

/* 2.14 Losing electrons: first ionization energies across two periods, and the successive energies of one atom. kJ/mol. */
const IE1 = [520, 900, 801, 1087, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521];
const IES = { Na: [496, 4562, 6910, 9543, 13354, 16613, 20117, 25496], Mg: [738, 1451, 7733, 10543, 13630, 18020, 21711, 25661], Al: [578, 1817, 2745, 11577, 14842, 18379, 23326, 27465],
  Si: [787, 1577, 3232, 4356, 16091, 19805, 23780, 29287], P: [1012, 1907, 2914, 4964, 6274, 21267, 25431, 29872], S: [1000, 2252, 3357, 4556, 7004, 8496, 27107, 31719] };
function m214(host) {
  let v = 0;
  const names = Object.keys(IES);
  const $ = shell(host, { label: 'ionization energy', title: 'What it costs to remove an electron', sub: 'First: the cost of the first electron across two periods. Then: every electron in turn from one atom.',
    body: `${chips('v', ['First, across the table', ...names.map(n => 'One by one: ' + n)], 0, 'View')}
      <svg viewBox="0 0 520 226" role="img" aria-labelledby="m214t"><title id="m214t">A chart of ionization energies</title><g id="m214g" ${SVGT}></g></svg>
      <p class="margin" id="m214e" aria-live="polite"></p>` });
  const draw = () => {
    if (v === 0) {
      const X = i => 52 + i * 29, Y = e => 190 - e / 2200 * 160, dips = { 2: 'B', 5: 'O', 10: 'Al', 13: 'S' };
      $('m214g').innerHTML = `<path d="M40 16v174h470" fill="none" stroke="currentColor" stroke-width="1.2"/>${[500, 1000, 1500, 2000].map(e => `<text x="36" y="${Y(e) + 4}" text-anchor="end" font-size="11">${e}</text><path d="M40 ${Y(e)}h470" stroke="currentColor" opacity="0.15"/>`).join('')}
        <path d="M${X(7.5)} 16v174" stroke="currentColor" stroke-dasharray="4 4" opacity="0.5"/><text x="${X(3.5)}" y="14" text-anchor="middle" font-size="12" font-style="italic">period 2</text><text x="${X(11.5)}" y="14" text-anchor="middle" font-size="12" font-style="italic">period 3</text>
        <polyline points="${IE1.map((e, i) => `${X(i)},${Y(e)}`).join(' ')}" fill="none" stroke="var(--part)" stroke-width="2.4"/>
        ${IE1.map((e, i) => `<circle cx="${X(i)}" cy="${Y(e)}" r="${dips[i] ? 6 : 4.2}" fill="${dips[i] ? 'var(--bad)' : 'var(--part)'}"/><text x="${X(i)}" y="206" text-anchor="middle" font-size="12" ${dips[i] ? 'font-weight="700"' : ''}>${SYM[i + 3]}</text>`).join('')}<text x="275" y="222" text-anchor="middle" font-size="11.5" font-style="italic">first ionization energy, kJ/mol</text>`;
      $('m214e').innerHTML = `up across each period, down to the next<small>The pull on the outer shell grows across a period, so the electron costs more. The red dots are the two dips: B and Al lose a p electron, which sits higher than s; O and S lose an electron that shares its orbital and is repelled by its partner.</small>`;
    } else {
      const el = names[v - 1], data = IES[el], val = v, Y = e => 190 - (Math.log10(e) - 2.5) / 2.1 * 165;
      $('m214g').innerHTML = `<path d="M40 16v174h470" fill="none" stroke="currentColor" stroke-width="1.2"/>${[1000, 10000].map(e => `<text x="36" y="${Y(e) + 4}" text-anchor="end" font-size="11">${e}</text><path d="M40 ${Y(e)}h470" stroke="currentColor" opacity="0.15"/>`).join('')}
        ${data.map((e, i) => `<rect x="${58 + i * 56}" y="${Y(e)}" width="38" height="${190 - Y(e)}" fill="${i === val ? 'var(--bad)' : 'var(--part)'}" opacity="${i < val ? 0.55 : 0.9}"/><text x="${77 + i * 56}" y="${Y(e) - 5}" text-anchor="middle" font-size="11">${e}</text><text x="${77 + i * 56}" y="206" text-anchor="middle" font-size="12">IE${subn(i + 1)}</text>`).join('')}
        <text x="275" y="222" text-anchor="middle" font-size="11.5" font-style="italic">successive ionization energies of ${el}, kJ/mol (each gridline is ten times the one below)</text>`;
      $('m214e').innerHTML = `${el} has ${val} valence electron${val > 1 ? 's' : ''}: the jump comes at IE${subn(val + 1)}<small>IE${subn(val + 1)} is ${(data[val] / data[val - 1]).toFixed(1)} times IE${subn(val)}. The first ${val} electron${val > 1 ? 's come' : ' comes'} from the outer shell; the next has to be torn from the core, much closer to the nucleus.</small>`;
    }
  };
  onChips(host, 'v', i => { v = i; draw(); });
  draw();
}

export default { '2.8': m28, '2.9': m29, '2.10': m210, '2.11': m211, '2.12': m212, '2.13': m213, '2.14': m214 };
