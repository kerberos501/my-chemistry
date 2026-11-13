// Working models for Part 3, lessons 3.1 to 3.7: bonds, Lewis structures and shapes.
import { esc, shell, chips, onChips, slider, SVGT } from './model-kit.js';

export const EN = { F: 4.0, O: 3.5, N: 3.0, Cl: 3.0, Br: 2.8, C: 2.5, S: 2.5, H: 2.1, P: 2.1, Si: 1.8, Al: 1.5, Mg: 1.2, Ca: 1.0, Li: 1.0, Na: 0.9, K: 0.8, B: 2.0, Be: 1.5, Xe: 2.6, I: 2.5 };
const VAL = { H: 1, B: 3, Be: 2, C: 4, N: 5, O: 6, F: 7, P: 5, S: 6, Cl: 7, Xe: 8, Br: 7, I: 7 };
const METAL = ['Na', 'K', 'Li', 'Mg', 'Ca', 'Al'];
const sg = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n);

/** Rotate a point about the vertical axis, tip it forward a little and flatten it to the page. */
export const proj = ([x, y, z], a, cx, cy, s) => { const X = x * Math.cos(a) + z * Math.sin(a), Z = -x * Math.sin(a) + z * Math.cos(a), t = 0.38; return [cx + s * X, cy - s * (y * Math.cos(t) - Z * Math.sin(t)), y * Math.sin(t) + Z * Math.cos(t)]; };
/** Directions of 2 to 6 electron domains. Lone pairs take the last places in each list. */
export const GEO = {
  2: [[1, 0, 0], [-1, 0, 0]], 3: [[-0.866, -0.5, 0], [0.866, -0.5, 0], [0, 1, 0]],
  4: [[0.943, -0.333, 0], [-0.471, -0.333, 0.816], [-0.471, -0.333, -0.816], [0, 1, 0]],
  5: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866]],
  6: [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0]],
};

/** Draws a Lewis structure: atoms { el, x, y }, bonds [i, j, order], lone pairs and single electrons per atom, optional labels. */
export function lewis(s, cx, cy, labels) {
  const lp = s.lp ?? [], rad = s.rad ?? [];
  let g = '';
  for (const [i, j, o] of s.bonds) { const a = s.atoms[i], b = s.atoms[j], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    for (let k = 0; k < o; k++) { const off = (k - (o - 1) / 2) * 5.5; g += `<path d="M${cx + a.x + ux * 13 - uy * off} ${cy + a.y + uy * 13 + ux * off}L${cx + b.x - ux * 13 - uy * off} ${cy + b.y - uy * 13 + ux * off}" stroke="currentColor" stroke-width="1.8"/>`; } }
  s.atoms.forEach((a, i) => {
    const used = s.bonds.filter(b => b[0] === i || b[1] === i).map(b => { const o = s.atoms[b[0] === i ? b[1] : b[0]]; return Math.atan2(o.y - a.y, o.x - a.x); });
    const n = (lp[i] ?? 0) + (rad[i] ?? 0), gap = (t, list) => Math.min(9, ...list.map(u => Math.abs(Math.atan2(Math.sin(t - u), Math.cos(t - u)))));
    for (let k = 0; k < n; k++) {
      let best = 0, bg = -1;
      for (let c = 0; c < 24; c++) { const t = -Math.PI / 2 + c * Math.PI / 12, d = gap(t, used); if (d > bg + 1e-6) { bg = d; best = t; } }
      used.push(best);
      const px = cx + a.x + 15 * Math.cos(best), py = cy + a.y + 15 * Math.sin(best), tx = -Math.sin(best) * 3.4, ty = Math.cos(best) * 3.4;
      g += k < (lp[i] ?? 0) ? `<circle cx="${px + tx}" cy="${py + ty}" r="1.9" fill="var(--part)"/><circle cx="${px - tx}" cy="${py - ty}" r="1.9" fill="var(--part)"/>` : `<circle cx="${px}" cy="${py}" r="2.1" fill="var(--bad)"/>`;
    }
    g += `<text x="${cx + a.x}" y="${cy + a.y + 5.5}" text-anchor="middle" font-size="16" font-weight="650">${a.el}</text>`;
    if (labels?.[i] !== undefined) g += `<text x="${cx + a.x + (a.x < -5 ? -14 : 12)}" y="${cy + a.y - 14}" text-anchor="${a.x < -5 ? 'end' : 'start'}" font-size="12" font-weight="700" fill="${labels[i] === '0' ? 'var(--ink-2)' : 'var(--bad)'}">${labels[i]}</text>`;
  });
  return g;
}
const A = (el, x, y) => ({ el, x, y });

/* 3.1 Why atoms bond: how unequally two atoms pull decides where the shared electrons sit. */
function m31(host) {
  const els = Object.keys(EN).filter(e => !['B', 'Be', 'Xe', 'I'].includes(e));
  let a = 'H', b = 'Cl';
  const sel = (id, cur) => `<select id="${id}">${els.map(e => `<option value="${e}"${e === cur ? ' selected' : ''}>${e} (${EN[e].toFixed(1)})</option>`).join('')}</select>`;
  const $ = shell(host, { label: 'electronegativity and bond type', title: 'Who pulls harder?', sub: 'Choose two atoms. The number beside each is its electronegativity: its pull on shared electrons.',
    body: `<div class="pick"><label>Left atom ${sel('m31a', a)}</label><label>Right atom ${sel('m31b', b)}</label></div>
      <svg viewBox="0 0 520 200" role="img" aria-labelledby="m31t"><title id="m31t">Two atoms and the pair of electrons between them, above a scale of electronegativity difference</title><g id="m31g" ${SVGT}></g></svg>
      <p class="margin" id="m31e" aria-live="polite"></p>` });
  const draw = () => {
    const d = Math.abs(EN[a] - EN[b]), metal = METAL.includes(a) && METAL.includes(b), ionic = !metal && d > 1.8, polar = !metal && !ionic && d >= 0.4, right = EN[b] >= EN[a];
    const shift = ionic ? 1 : Math.min(1, d / 1.8) * 0.62, px = 260 + (right ? 1 : -1) * shift * 62, hi = right ? b : a, lo = right ? a : b;
    const X = v => 60 + Math.min(3.3, v) / 3.3 * 400;
    $('m31g').innerHTML = `<circle cx="180" cy="62" r="44" fill="var(--part)" opacity="${ionic && right ? 0.25 : 0.4}"/><circle cx="340" cy="62" r="44" fill="var(--part)" opacity="${ionic && !right ? 0.25 : 0.4}"/>
      <text x="180" y="68" text-anchor="middle" font-size="19" font-weight="650">${a}</text><text x="340" y="68" text-anchor="middle" font-size="19" font-weight="650">${b}</text>
      ${metal ? [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${150 + i * 44}" cy="${i % 2 ? 22 : 104}" r="4" fill="var(--bad)"/>`).join('') : `<circle cx="${px - 6}" cy="62" r="4.5" fill="var(--bad)"/><circle cx="${px + 6}" cy="62" r="4.5" fill="var(--bad)"/>`}
      ${metal ? '' : ionic ? `<text x="${right ? 180 : 340}" y="20" text-anchor="middle" font-weight="700">${lo}⁺</text><text x="${right ? 340 : 180}" y="20" text-anchor="middle" font-weight="700">${hi}⁻</text>` : polar ? `<text x="${right ? 180 : 340}" y="20" text-anchor="middle" font-weight="700">δ+</text><text x="${right ? 340 : 180}" y="20" text-anchor="middle" font-weight="700">δ−</text>` : ''}
      <path d="M60 150h400" stroke="currentColor" stroke-width="1.4"/>${[[0, 'non-polar covalent'], [0.4, 'polar covalent'], [1.8, 'ionic']].map(([v, t]) => `<path d="M${X(v)} 144v${v === 0.4 ? 34 : 12}" stroke="currentColor"/><text x="${X(v) + 4}" y="${v === 0.4 ? 188 : 172}" font-size="11.5">${t}</text><text x="${X(v)}" y="140" text-anchor="middle" font-size="11">${v}</text>`).join('')}
      <circle cx="${X(d)}" cy="150" r="7" fill="var(--part)"/><text x="474" y="154" font-size="11.5" font-style="italic">ΔEN</text>`;
    $('m31e').innerHTML = `ΔEN = |${EN[a].toFixed(1)} − ${EN[b].toFixed(1)}| = ${d.toFixed(1)}: ${metal ? 'metallic' : ionic ? 'ionic' : polar ? 'polar covalent' : 'non-polar covalent'}<small>${metal ? 'Two metals: neither holds its valence electrons tightly, so they are pooled and shared by all the atoms.' : ionic ? `${hi} pulls so much harder that it takes the electrons outright: ${lo} becomes a cation and ${hi} an anion.` : polar ? `The pair is shared but sits nearer ${hi}, which carries a partial negative charge.` : 'The pull is equal, or nearly so: the pair sits in the middle.'}</small>`;
  };
  $('m31a').addEventListener('change', e => { a = e.target.value; draw(); });
  $('m31b').addEventListener('change', e => { b = e.target.value; draw(); });
  draw();
}

/* 3.2 Lewis structures: the five steps, one at a time, with a running count of electrons. */
const LW = [
  { f: 'H₂O', ch: 0, atoms: [A('O', 0, -8), A('H', -46, 24), A('H', 46, 24)], bonds: [[0, 1, 1], [0, 2, 1]], lp: [2, 0, 0] },
  { f: 'NH₃', ch: 0, atoms: [A('N', 0, -10), A('H', -50, 14), A('H', 50, 14), A('H', 0, 40)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lp: [1, 0, 0, 0] },
  { f: 'H₂CO', ch: 0, atoms: [A('C', 0, 6), A('O', 0, -48), A('H', -46, 36), A('H', 46, 36)], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1]], lp: [0, 2, 0, 0] },
  { f: 'HCN', ch: 0, atoms: [A('C', 0, 0), A('H', -54, 0), A('N', 58, 0)], bonds: [[0, 1, 1], [0, 2, 3]], lp: [0, 0, 1] },
  { f: 'PCl₃', ch: 0, atoms: [A('P', 0, -16), A('Cl', -60, 12), A('Cl', 60, 12), A('Cl', 0, 44)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], lp: [1, 3, 3, 3] },
  { f: 'OH⁻', ch: -1, atoms: [A('O', -22, 0), A('H', 28, 0)], bonds: [[0, 1, 1]], lp: [3, 0] },
];
function m32(host) {
  let m = 0, step = 1;
  const $ = shell(host, { label: 'Lewis structures', title: 'Five steps to a Lewis structure', sub: 'Step through the method. The counter shows how many valence electrons are still to be placed.',
    body: `${chips('m', LW.map(x => x.f), 0, 'Molecule')}
      <svg viewBox="0 0 520 170" role="img" aria-labelledby="m32t"><title id="m32t">The Lewis structure as built so far, beside a count of the electrons used</title><g id="m32g" ${SVGT}></g></svg>
      <p style="margin:6px 0"><button type="button" class="btn2 ghost sm" id="m32p">‹ Back</button> <button type="button" class="btn2 sm" id="m32n">Next step ›</button></p><p class="margin" id="m32e" aria-live="polite"></p>` });
  const draw = () => {
    const s = LW[m], T = s.atoms.reduce((t, a) => t + VAL[a.el], 0) - s.ch, nb = s.bonds.length;
    let left = T - 2 * nb;
    const outer = s.atoms.map((a, i) => (i && a.el !== 'H' ? Math.min(3, Math.floor(left / 2)) : 0)).map(n => { left -= 2 * n; return n; }), onC = Math.floor(left / 2), single = s.bonds.map(b => [b[0], b[1], 1]);
    const cur = step < 2 ? { ...s, bonds: [], lp: [] } : step === 2 ? { ...s, bonds: single, lp: [] } : step === 3 ? { ...s, bonds: single, lp: outer } : step === 4 ? { ...s, bonds: single, lp: outer.map((n, i) => (i ? n : onC)) } : s;
    const placed = step < 2 ? 0 : step === 2 ? 2 * nb : step === 3 ? T - 2 * onC : T, around = 2 * nb + 2 * onC, multi = s.bonds.some(b => b[2] > 1);
    $('m32g').innerHTML = lewis(cur, 150, 80) + `<text x="300" y="34" font-size="12.5">valence electrons to place</text><text x="300" y="66" font-size="26" font-weight="650">${T - placed} <tspan font-size="14" font-weight="400">of ${T} left</tspan></text>
      <rect x="300" y="80" width="190" height="12" rx="3" fill="var(--paper-2)" stroke="currentColor" stroke-width="0.8"/><rect x="300" y="80" width="${190 * placed / T}" height="12" rx="3" fill="var(--part)"/>
      <text x="300" y="114" font-size="12.5">a line is a shared pair;</text><text x="300" y="130" font-size="12.5">two dots are a lone pair</text><text x="300" y="150" font-weight="650">Step ${step} of 5</text>`;
    const txt = [`Count: ${s.atoms.map(a => `${a.el} ${VAL[a.el]}`).join(' + ')}${s.ch ? ` ${s.ch < 0 ? '+' : '−'} ${Math.abs(s.ch)} for the charge` : ''} = ${T} valence electrons`,
      `Join the atoms with single bonds: ${nb} bond${nb > 1 ? 's use' : ' uses'} ${2 * nb} electrons`, `Complete the octets of the outer atoms (hydrogen needs none): ${outer.reduce((x, y) => x + 2 * y, 0)} electrons`,
      `Put what is left on the central atom: ${2 * onC} electrons. It now has ${around} around it`, multi ? `Only ${around}, not 8: move lone pairs in to make a multiple bond. Every atom now has its octet` : 'Check: every atom has its octet (hydrogen has 2), and all the electrons are placed'];
    $('m32e').innerHTML = `${txt[step - 1]}<small>${step === 5 ? `${T} electrons, no more and no fewer.` : 'Press “Next step”.'}</small>`;
    $('m32p').disabled = step === 1; $('m32n').disabled = step === 5;
  };
  onChips(host, 'm', i => { m = i; step = 1; draw(); });
  $('m32p').addEventListener('click', () => { step = Math.max(1, step - 1); draw(); });
  $('m32n').addEventListener('click', () => { step = Math.min(5, step + 1); draw(); });
  draw();
}

/* 3.3 Formal charge and resonance: the same atoms drawn different ways, with the charge on each atom. */
const FCS = [
  { name: 'NO₂⁻, one way', atoms: [A('N', 0, -10), A('O', -56, 18), A('O', 56, 18)], bonds: [[0, 1, 2], [0, 2, 1]], lp: [1, 2, 3], note: 'The double bond could just as well be on the other oxygen: see the next drawing.' },
  { name: 'NO₂⁻, the other way', atoms: [A('N', 0, -10), A('O', -56, 18), A('O', 56, 18)], bonds: [[0, 1, 1], [0, 2, 2]], lp: [1, 3, 2], note: 'Two equally good drawings are resonance structures. The real ion is their average: two identical N–O bonds, each about 1½ bonds, with the −1 charge shared.' },
  { name: 'CO₂ as O=C=O', atoms: [A('C', 0, 0), A('O', -58, 0), A('O', 58, 0)], bonds: [[0, 1, 2], [0, 2, 2]], lp: [0, 2, 2], note: 'Every formal charge is zero: this is the best structure.' },
  { name: 'CO₂ as O≡C–O', atoms: [A('C', 0, 0), A('O', -58, 0), A('O', 58, 0)], bonds: [[0, 1, 3], [0, 2, 1]], lp: [0, 1, 3], note: 'Every atom has an octet, but there are charges of +1 and −1 where none are needed. The structure with the smaller formal charges is preferred.' },
  { name: 'SCN⁻ as S=C=N', atoms: [A('C', 0, 0), A('S', -60, 0), A('N', 58, 0)], bonds: [[0, 1, 2], [0, 2, 2]], lp: [0, 2, 2], note: 'The −1 sits on nitrogen, the most electronegative atom: a good structure.' },
];
function m33(host) {
  let k = 0;
  const $ = shell(host, { label: 'formal charge', title: 'Charge each atom its share', sub: 'Formal charge compares the electrons an atom brought with the electrons it is credited with in the drawing.',
    body: `${chips('k', FCS.map(x => x.name), 0, 'Structure')}
      <svg viewBox="0 0 520 120" role="img" aria-labelledby="m33t"><title id="m33t">A Lewis structure with the formal charge written beside each atom</title><g id="m33g" ${SVGT}></g></svg>
      <table class="tally" id="m33tb"></table><p class="margin" id="m33e" aria-live="polite"></p>` });
  const draw = () => {
    const s = FCS[k], rows = s.atoms.map((a, i) => { const N = 2 * s.lp[i], B = s.bonds.filter(b => b[0] === i || b[1] === i).reduce((t, b) => t + b[2], 0); return { el: a.el, V: VAL[a.el], N, B, fc: VAL[a.el] - N - B }; });
    $('m33g').innerHTML = lewis(s, 260, 62, rows.map(r => sg(r.fc)));
    $('m33tb').innerHTML = `<tr><th>Atom</th><th>Valence e⁻</th><th>Non-bonding e⁻</th><th>Bonds</th><th>Formal charge</th></tr>` + rows.map(r => `<tr${r.fc ? ' class="find"' : ''}><td>${r.el}</td><td>${r.V}</td><td>${r.N}</td><td>${r.B}</td><td>${r.V} − ${r.N} − ${r.B} = <b>${sg(r.fc)}</b></td></tr>`).join('');
    const sum = rows.reduce((t, r) => t + r.fc, 0);
    $('m33e').innerHTML = `the formal charges add up to ${sg(sum)}, the charge on the species<small>${esc(s.note)}</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  draw();
}

/* 3.4 Breaking the octet rule: count the electrons around the central atom. */
const ring = (el, n, r, start = -90) => Array.from({ length: n }, (_, i) => { const t = (start + i * 360 / n) * Math.PI / 180; return A(el, Math.round(r * Math.cos(t)), Math.round(r * Math.sin(t))); });
const OCT = [
  { f: 'BF₃', atoms: [A('B', 0, 0), ...ring('F', 3, 54)], lp: [0, 3, 3, 3], why: 'Boron has only three valence electrons to share, and is stable with six around it.' },
  { f: 'BeCl₂', atoms: [A('Be', 0, 0), A('Cl', -58, 0), A('Cl', 58, 0)], lp: [0, 3, 3], why: 'Beryllium has two valence electrons: two bonds and four electrons around it.' },
  { f: 'CH₄', atoms: [A('C', 0, 0), ...ring('H', 4, 46, -45)], lp: [0, 0, 0, 0, 0], why: 'An ordinary octet, for comparison: carbon is in period 2 and never exceeds eight.' },
  { f: 'PCl₅', atoms: [A('P', 0, 0), ...ring('Cl', 5, 58)], lp: [0, 3, 3, 3, 3, 3], why: 'Phosphorus is in period 3: it is large enough to hold five bonds.' },
  { f: 'SF₄', atoms: [A('S', 0, 0), A('F', -56, -20), A('F', 56, -20), A('F', -40, 44), A('F', 40, 44)], lp: [1, 3, 3, 3, 3], why: 'Four bonds and one lone pair. Do not forget the lone pair when you count.' },
  { f: 'XeF₂', atoms: [A('Xe', 0, 0), A('F', -60, 0), A('F', 60, 0)], lp: [3, 3, 3], why: 'Two bonds and three lone pairs on xenon.' },
  { f: 'NO', atoms: [A('N', -28, 0), A('O', 30, 0)], bonds: [[0, 1, 2]], lp: [1, 2], rad: [1, 0], why: 'Eleven valence electrons: an odd number can never be all paired, so one electron is left on its own.' },
];
function m34(host) {
  let k = 0;
  const $ = shell(host, { label: 'octet exceptions', title: 'Count around the centre', sub: 'Each bond puts two electrons around the central atom; so does each lone pair on it.',
    body: `${chips('k', OCT.map(x => x.f), 0, 'Molecule')}
      <svg viewBox="0 0 520 170" role="img" aria-labelledby="m34t"><title id="m34t">A Lewis structure beside a count of the electrons around its central atom</title><g id="m34g" ${SVGT}></g></svg>
      <p class="margin" id="m34e" aria-live="polite"></p>` });
  const draw = () => {
    const s = OCT[k], bonds = s.bonds ?? s.atoms.slice(1).map((_, i) => [0, i + 1, 1]), nb = bonds.reduce((t, b) => t + b[2], 0), n = 2 * nb + 2 * s.lp[0] + (s.rad?.[0] ?? 0);
    $('m34g').innerHTML = lewis({ ...s, bonds }, 140, 86) + `<text x="300" y="30" font-size="12.5">electrons around ${s.atoms[0].el}</text>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${300 + i * 16}" y="44" width="13" height="26" rx="2" fill="${i < n ? (n === 8 ? 'var(--good)' : 'var(--part)') : 'var(--paper-2)'}" stroke="currentColor" stroke-width="0.8"/>`).join('')}
      <path d="M${300 + 8 * 16 - 1.5} 38v38" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/><text x="${300 + 8 * 16}" y="92" text-anchor="middle" font-size="11.5">octet</text>
      <text x="300" y="130" font-size="24" font-weight="650">${n}</text><text x="336" y="130">${n < 8 ? (n % 2 ? 'an odd number' : 'fewer than eight') : n === 8 ? 'an octet' : 'an expanded octet'}</text>`;
    $('m34e').innerHTML = `${nb} bond${nb > 1 ? 's' : ''} × 2${s.lp[0] ? ` + ${s.lp[0]} lone pair${s.lp[0] > 1 ? 's' : ''} × 2` : ''}${s.rad ? ' + 1 unpaired electron' : ''} = ${n} electrons<small>${esc(s.why)}${n > 8 ? ' Only atoms from period 3 onward can go beyond eight.' : ''}</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  draw();
}

/* 3.5 Molecular shape: choose bonded atoms and lone pairs; turn the molecule to see its shape. */
export const SHAPES = { '2-0': ['linear', '180°', 'CO₂'], '3-0': ['trigonal planar', '120°', 'BF₃'], '2-1': ['bent', 'a little under 120°', 'SO₂'], '4-0': ['tetrahedral', '109.5°', 'CH₄'], '3-1': ['trigonal pyramidal', 'about 107°', 'NH₃'], '2-2': ['bent', 'about 104.5°', 'H₂O'],
  '5-0': ['trigonal bipyramidal', '90° and 120°', 'PCl₅'], '4-1': ['seesaw', 'about 90° and 120°', 'SF₄'], '3-2': ['T-shaped', 'about 90°', 'ClF₃'], '2-3': ['linear', '180°', 'XeF₂'], '6-0': ['octahedral', '90°', 'SF₆'], '5-1': ['square pyramidal', 'about 90°', 'BrF₅'], '4-2': ['square planar', '90°', 'XeF₄'] };
const EGEO = { 2: 'linear', 3: 'trigonal planar', 4: 'tetrahedral', 5: 'trigonal bipyramidal', 6: 'octahedral' };
/** A central atom with things on some of its domain directions, drawn back to front. items: [direction, svg-maker(x, y, depth)]. */
const ball = (items, a, cx, cy, s, centre) => [...items.map(([v, f]) => { const p = proj(v, a, cx, cy, s); return [p[2], `<path d="M${cx} ${cy}L${p[0]} ${p[1]}" stroke="currentColor" stroke-width="2.2"/>` + f(p[0], p[1], p[2])]; }), [0, centre]].sort((p, q) => p[0] - q[0]).map(p => p[1]).join('');
function m35(host) {
  let dom = 4, lp = 1, ang = 0.6;
  const $ = shell(host, { label: 'molecular shape', title: 'Domains push apart; atoms show the shape', sub: 'Choose the number of electron domains on the central atom, then turn some of them into lone pairs.',
    body: `${chips('d', ['2 domains', '3', '4', '5', '6'], 2, 'Electron domains')}
      <div class="pick"><span>Lone pairs on the central atom <span class="stepper"><button type="button" id="m35m" aria-label="One fewer lone pair">−</button><output id="m35l"></output><button type="button" id="m35p" aria-label="One more lone pair">+</button></span></span></div>
      <svg viewBox="0 0 520 200" role="img" aria-labelledby="m35t"><title id="m35t">A central atom with its bonded atoms and lone pairs arranged in three dimensions</title><g id="m35g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m35a', 'Turn it', 0, 628, 1, 60)}</div><p class="margin" id="m35e" aria-live="polite"></p>` });
  const draw = () => {
    const max = dom === 5 ? 3 : dom - 2 > 2 ? 2 : dom - 2; lp = Math.min(lp, max);
    const nb = dom - lp, [name, angle, ex] = SHAPES[`${nb}-${lp}`], dirs = GEO[dom];
    const items = dirs.map((v, i) => [v, i < nb ? (x, y, z) => `<circle cx="${x}" cy="${y}" r="${13 + z * 2.5}" fill="var(--part)" stroke="currentColor" stroke-width="1.2"/>` : (x, y) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="11" fill="var(--paper-2)" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="${x - 4.5}" cy="${y}" r="2.4" fill="var(--bad)"/><circle cx="${x + 4.5}" cy="${y}" r="2.4" fill="var(--bad)"/>`]);
    $('m35g').innerHTML = ball(items, ang, 150, 100, 70, '<circle cx="150" cy="100" r="15" fill="var(--ink-2)" stroke="currentColor" stroke-width="1.2"/>')
      + `<text x="300" y="40" font-size="12.5">${dom} electron domains</text><text x="300" y="62" font-weight="650" font-size="16">${EGEO[dom]}</text>
        <text x="300" y="100" font-size="12.5">shape: ${nb} atoms, ${lp} lone pair${lp === 1 ? '' : 's'}</text><text x="300" y="124" font-weight="650" font-size="19" fill="var(--part)">${name}</text>
        <text x="300" y="154">bond angles: ${angle}</text><text x="300" y="176">example: ${ex}</text>`;
    $('m35l').textContent = lp;
    $('m35e').innerHTML = `${nb} bonded atom${nb > 1 ? 's' : ''} + ${lp} lone pair${lp === 1 ? '' : 's'} = ${dom} domains → ${name}<small>${lp ? 'The lone pairs (dashed) take up room and help set the angles, but the shape is named from the atoms alone.' : 'With no lone pairs, the shape is the same as the electron-domain geometry.'} A double or triple bond counts as one domain.</small>`;
  };
  onChips(host, 'd', i => { dom = i + 2; draw(); });
  $('m35m').addEventListener('click', () => { lp = Math.max(0, lp - 1); draw(); });
  $('m35p').addEventListener('click', () => { lp += 1; draw(); });
  $('m35a').addEventListener('input', e => { ang = Number(e.target.value) / 100; draw(); });
  draw();
}

/* 3.6 Polar molecules: an arrow along each polar bond; the arrows add up, or cancel. */
const T4 = GEO[4], P3 = GEO[3];
const around = (c, list, dirs, len = 1) => [{ el: c, p: [0, 0, 0] }, ...list.map((el, i) => ({ el, p: dirs[i].map(v => v * len) }))];
const star = n => Array.from({ length: n }, (_, i) => [0, i + 1]);
const POL = [
  { f: 'CO₂', atoms: around('C', ['O', 'O'], GEO[2]), bonds: star(2) }, { f: 'H₂O', atoms: around('O', ['H', 'H'], [T4[0], T4[1]]), bonds: star(2), lone: 'bent by two lone pairs' },
  { f: 'NH₃', atoms: around('N', ['H', 'H', 'H'], T4), bonds: star(3), lone: 'pushed into a pyramid by one lone pair' }, { f: 'CCl₄', atoms: around('C', ['Cl', 'Cl', 'Cl', 'Cl'], T4), bonds: star(4) },
  { f: 'CHCl₃', atoms: around('C', ['Cl', 'Cl', 'Cl', 'H'], T4), bonds: star(4) }, { f: 'SO₃', atoms: around('S', ['O', 'O', 'O'], P3), bonds: star(3) },
  { f: 'cis-C₂H₂F₂', atoms: [{ el: 'C', p: [-0.45, 0, 0] }, { el: 'C', p: [0.45, 0, 0] }, { el: 'F', p: [-1.0, 0.85, 0] }, { el: 'F', p: [1.0, 0.85, 0] }, { el: 'H', p: [-1.0, -0.85, 0] }, { el: 'H', p: [1.0, -0.85, 0] }], bonds: [[0, 1], [0, 2], [1, 3], [0, 4], [1, 5]] },
  { f: 'trans-C₂H₂F₂', atoms: [{ el: 'C', p: [-0.45, 0, 0] }, { el: 'C', p: [0.45, 0, 0] }, { el: 'F', p: [-1.0, 0.85, 0] }, { el: 'H', p: [1.0, 0.85, 0] }, { el: 'H', p: [-1.0, -0.85, 0] }, { el: 'F', p: [1.0, -0.85, 0] }], bonds: [[0, 1], [0, 2], [1, 3], [0, 4], [1, 5]] },
];
const vec = (x1, y1, x2, y2, col, w) => { const a = Math.atan2(y2 - y1, x2 - x1); return Math.hypot(x2 - x1, y2 - y1) < 5 ? '' : `<path d="M${x1} ${y1}L${x2} ${y2}M${x2 - 8 * Math.cos(a - 0.5)} ${y2 - 8 * Math.sin(a - 0.5)}L${x2} ${y2}L${x2 - 8 * Math.cos(a + 0.5)} ${y2 - 8 * Math.sin(a + 0.5)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; };
function m36(host) {
  let k = 1, ang = 0.5;
  const $ = shell(host, { label: 'bond dipoles', title: 'Do the arrows cancel?', sub: 'Each red arrow points along a polar bond toward the atom that pulls harder. The thick arrow is their sum.',
    body: `${chips('k', POL.map(x => x.f), k, 'Molecule')}
      <svg viewBox="0 0 520 200" role="img" aria-labelledby="m36t"><title id="m36t">A molecule with an arrow on each polar bond and one arrow for the total</title><g id="m36g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m36a', 'Turn it', 0, 628, 1, 50)}</div><p class="margin" id="m36e" aria-live="polite"></p>` });
  const draw = () => {
    const s = POL[k], P = s.atoms.map(a => proj(a.p, ang, 150, 100, 62)), net = [0, 0, 0];
    let g = '', polarBonds = 0;
    for (const [i, j] of s.bonds) { const a = s.atoms[i], b = s.atoms[j], d = EN[b.el] - EN[a.el];
      g += `<path d="M${P[i][0]} ${P[i][1]}L${P[j][0]} ${P[j][1]}" stroke="currentColor" stroke-width="2.2"/>`;
      if (Math.abs(d) >= 0.4) { polarBonds++; const [from, to] = d > 0 ? [i, j] : [j, i], L = Math.hypot(...s.atoms[to].p.map((v, q) => v - s.atoms[from].p[q])); s.atoms[to].p.forEach((v, q) => { net[q] += (v - s.atoms[from].p[q]) / L * Math.abs(d); });
        const mx = (P[i][0] + P[j][0]) / 2, my = (P[i][1] + P[j][1]) / 2, ux = (P[to][0] - P[from][0]) / 2.6, uy = (P[to][1] - P[from][1]) / 2.6; g += vec(mx - ux / 2 + 9, my - uy / 2 - 9, mx + ux / 2 + 9, my + uy / 2 - 9, 'var(--bad)', 2); } }
    g += s.atoms.map((a, i) => [P[i][2], `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="${a.el === 'H' ? 10 : 14}" fill="${i === 0 || a.el === 'C' ? 'var(--paper-2)' : 'color-mix(in srgb, var(--part) 45%, var(--paper))'}" stroke="currentColor" stroke-width="1.2"/><text x="${P[i][0]}" y="${P[i][1] + 4.5}" text-anchor="middle" font-size="12" font-weight="650">${a.el}</text>`]).sort((p, q) => p[0] - q[0]).map(p => p[1]).join('');
    const mag = Math.hypot(...net), polar = mag > 0.15, nv = net.map(v => v / (mag || 1) * Math.min(1.5, Math.max(0.6, mag))), n0 = proj(nv.map(v => -v / 2), ang, 400, 100, 44), n1 = proj(nv.map(v => v / 2), ang, 400, 100, 44);
    g += `<text x="400" y="26" text-anchor="middle" font-size="12.5">sum of the bond dipoles</text>${polar ? vec(n0[0], n0[1], n1[0], n1[1], 'var(--bad)', 5) : '<circle cx="400" cy="100" r="6" fill="none" stroke="var(--bad)" stroke-width="3"/>'}<text x="400" y="182" text-anchor="middle" font-size="17" font-weight="650" fill="${polar ? 'var(--bad)' : 'currentColor'}">${polar ? 'polar molecule' : 'non-polar molecule'}</text>`;
    $('m36g').innerHTML = g;
    $('m36e').innerHTML = `${s.f}: ${polarBonds} polar bond${polarBonds === 1 ? '' : 's'}, ${polar ? 'and they do not cancel' : polarBonds ? 'but they cancel exactly' : 'so nothing to add up'}<small>${polar ? `The shape is not symmetrical${s.lone ? ` (${s.lone} on the central atom)` : ''}, so the pulls add up to a net dipole.` : polarBonds ? 'Identical bonds arranged symmetrically pull equally in opposite directions: polar bonds, non-polar molecule.' : 'With no polar bonds there is no dipole.'} Turn the molecule to check from every side.</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  $('m36a').addEventListener('input', e => { ang = Number(e.target.value) / 100; draw(); });
  draw();
}

/* 3.7 Hybrid orbitals: count the domains, mix that many orbitals, get that many identical hybrids. */
const HYB = { 2: ['sp', '180°', ['CO₂: 2 double bonds = 2 domains', 'HC≡CH: each C has 2 domains']], 3: ['sp²', '120°', ['BF₃: 3 bonds = 3 domains', 'SO₂: 2 bonds + 1 lone pair = 3 domains']], 4: ['sp³', '109.5°', ['CH₄: 4 bonds = 4 domains', 'NH₃: 3 bonds + 1 lone pair = 4 domains', 'H₂O: 2 bonds + 2 lone pairs = 4 domains']],
  5: ['sp³d', '90° and 120°', ['PCl₅: 5 bonds = 5 domains', 'XeF₂: 2 bonds + 3 lone pairs = 5 domains']], 6: ['sp³d²', '90°', ['SF₆: 6 bonds = 6 domains', 'BrF₅: 5 bonds + 1 lone pair = 6 domains']] };
function m37(host) {
  let dom = 4, ang = 0.6;
  const $ = shell(host, { label: 'hybridization', title: 'Mix as many orbitals as there are domains', sub: 'Count the electron domains on the atom (lone pairs count). That many atomic orbitals mix into that many identical hybrids.',
    body: `${chips('d', ['2 domains', '3', '4', '5', '6'], 2, 'Electron domains')}
      <svg viewBox="0 0 520 200" role="img" aria-labelledby="m37t"><title id="m37t">Atomic orbitals being mixed, and the hybrid orbitals that result, pointing to the corners of a shape</title><g id="m37g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m37a', 'Turn it', 0, 628, 1, 60)}</div><p class="margin" id="m37e" aria-live="polite"></p>` });
  const draw = () => {
    const [name, angle, exs] = HYB[dom], src = ['s', 'p', 'p', 'p', 'd', 'd'];
    const lobes = GEO[dom].map(v => { const p = proj(v, ang, 380, 100, 62), a = Math.atan2(p[1] - 100, p[0] - 380) * 180 / Math.PI, L = Math.hypot(p[0] - 380, p[1] - 100); return [p[2], `<ellipse cx="${380 + (p[0] - 380) / 2}" cy="${100 + (p[1] - 100) / 2}" rx="${Math.max(6, L / 2)}" ry="${11 + p[2] * 2}" transform="rotate(${a} ${380 + (p[0] - 380) / 2} ${100 + (p[1] - 100) / 2})" fill="var(--part)" opacity="0.5" stroke="var(--part)" stroke-width="1.3"/>`]; }).sort((p, q) => p[0] - q[0]).map(p => p[1]).join('');
    $('m37g').innerHTML = `<text x="20" y="26" font-size="12.5">orbitals that mix</text>${src.map((o, i) => `<rect x="${20 + i * 34}" y="38" width="29" height="29" rx="4" fill="${i < dom ? 'var(--part)' : 'var(--paper-2)'}" stroke="currentColor" stroke-width="1.1" opacity="${i < dom ? 0.9 : 0.5}"/><text x="${34.5 + i * 34}" y="58" text-anchor="middle" font-weight="650" ${i < dom ? 'fill="var(--paper)"' : 'opacity="0.5"'}>${o}</text>`).join('')}
      <text x="122" y="92" text-anchor="middle" font-size="18">↓</text><text x="20" y="116" font-size="12.5">${dom} identical hybrids</text><text x="20" y="150" font-size="30" font-weight="650" fill="var(--part)">${name}</text><text x="20" y="178">pointing ${angle} apart: ${EGEO[dom]}</text>${lobes}<circle cx="380" cy="100" r="4" fill="currentColor"/>`;
    $('m37e').innerHTML = `${dom} domains → ${name}<small>${exs.map(esc).join('. ')}. A double or triple bond is one domain; its π bonds use leftover unhybridized p orbitals.</small>`;
  };
  onChips(host, 'd', i => { dom = i + 2; draw(); });
  $('m37a').addEventListener('input', e => { ang = Number(e.target.value) / 100; draw(); });
  draw();
}

export default { '3.1': m31, '3.2': m32, '3.3': m33, '3.4': m34, '3.5': m35, '3.6': m36, '3.7': m37 };
