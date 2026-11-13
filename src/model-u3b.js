// Working models for Part 3, lessons 3.8 to 3.14: bonds as energy, forces between molecules, and crystals.
import { esc, shell, chips, onChips, slider, sci, SVGT } from './model-kit.js';
import { proj } from './model-u3a.js';

const A = (el, x, y) => ({ el, x, y });

/* 3.8 Sigma and pi bonds: the first bond in every link is σ; any extra ones are π. */
const SP = [
  { f: 'ethane, C₂H₆', atoms: [A('C', -28, 0), A('C', 28, 0), A('H', -28, -44), A('H', -72, 0), A('H', -28, 44), A('H', 28, -44), A('H', 72, 0), A('H', 28, 44)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [1, 6, 1], [1, 7, 1]], note: 'All single bonds: all σ. The two ends can spin about the C–C bond.' },
  { f: 'ethene, C₂H₄', atoms: [A('C', -28, 0), A('C', 28, 0), A('H', -62, -36), A('H', -62, 36), A('H', 62, -36), A('H', 62, 36)], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]], note: 'The double bond is one σ and one π. The π bond stops the two ends from spinning.' },
  { f: 'ethyne, C₂H₂', atoms: [A('C', -28, 0), A('C', 28, 0), A('H', -80, 0), A('H', 80, 0)], bonds: [[0, 1, 3], [0, 2, 1], [1, 3, 1]], note: 'The triple bond is one σ and two π.' },
  { f: 'N₂', atoms: [A('N', -28, 0), A('N', 28, 0)], bonds: [[0, 1, 3]], note: 'One σ and two π: one of the strongest bonds there is.' },
  { f: 'CO₂', atoms: [A('C', 0, 0), A('O', -58, 0), A('O', 58, 0)], bonds: [[0, 1, 2], [0, 2, 2]], note: 'Two double bonds: each has its own σ and its own π.' },
  { f: 'ethanoic acid, CH₃COOH', atoms: [A('C', -30, 0), A('C', 26, 0), A('H', -30, -44), A('H', -76, 0), A('H', -30, 44), A('O', 52, -42), A('O', 62, 36), A('H', 106, 36)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 2], [1, 6, 1], [6, 7, 1]], note: 'Count every line, including the bonds to hydrogen. Only the C=O adds a π.' },
];
function m38(host) {
  let k = 1;
  const $ = shell(host, { label: 'sigma and pi bonds', title: 'One σ in every link; the rest are π', sub: 'Black lines are σ bonds. Coloured lines are π bonds.',
    body: `${chips('k', SP.map(x => x.f), k, 'Molecule')}
      <svg viewBox="0 0 520 190" role="img" aria-labelledby="m38t"><title id="m38t">A structure with its sigma bonds in black and pi bonds in colour, beside sketches of the two kinds of overlap</title><g id="m38g" ${SVGT}></g></svg>
      <p class="margin" id="m38e" aria-live="polite"></p>` });
  const draw = () => {
    const s = SP[k], cx = 150, cy = 86; let g = '', sig = 0, pi = 0;
    for (const [i, j, o] of s.bonds) { const a = s.atoms[i], b = s.atoms[j], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L; sig++; pi += o - 1;
      for (let q = 0; q < o; q++) { const off = [0, 6, -6][q]; g += `<path d="M${cx + a.x + ux * 12 - uy * off} ${cy + a.y + uy * 12 + ux * off}L${cx + b.x - ux * 12 - uy * off} ${cy + b.y - uy * 12 + ux * off}" stroke="${q ? 'var(--part)' : 'currentColor'}" stroke-width="${q ? 2.6 : 2}"/>`; } }
    g += s.atoms.map(a => `<text x="${cx + a.x}" y="${cy + a.y + 5.5}" text-anchor="middle" font-size="16" font-weight="650">${a.el}</text>`).join('');
    // the two kinds of overlap
    g += `<text x="330" y="24" font-size="12.5">σ: end-to-end overlap</text>
      <ellipse cx="372" cy="54" rx="34" ry="13" fill="none" stroke="currentColor" stroke-width="1.4"/><ellipse cx="420" cy="54" rx="34" ry="13" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M386 54a10 9 0 0 1 20 0a10 9 0 0 1 -20 0" fill="currentColor" opacity="0.45"/><circle cx="350" cy="54" r="2.6"/><circle cx="442" cy="54" r="2.6"/>
      <text x="330" y="102" font-size="12.5">π: side-by-side overlap</text>
      ${[372, 414].map(x => `<ellipse cx="${x}" cy="128" rx="13" ry="17" fill="var(--part)" opacity="0.45" stroke="var(--part)"/><ellipse cx="${x}" cy="164" rx="13" ry="17" fill="var(--part)" opacity="0.45" stroke="var(--part)"/><circle cx="${x}" cy="146" r="2.6"/>`).join('')}<path d="M372 146h42" stroke="currentColor" stroke-width="1.4"/><path d="M385 126h16M385 166h16" stroke="var(--part)" stroke-width="2.4" stroke-dasharray="3 3"/>
      <text x="20" y="182" font-size="15"><tspan font-weight="650">${sig} σ</tspan> and <tspan font-weight="650" fill="var(--part)">${pi} π</tspan></text>`;
    $('m38g').innerHTML = g;
    $('m38e').innerHTML = `${s.bonds.length} link${sig === 1 ? '' : 's'} between atoms → ${sig} σ bond${sig === 1 ? '' : 's'}; ${pi} extra line${pi === 1 ? '' : 's'} → ${pi} π bond${pi === 1 ? '' : 's'}<small>${esc(s.note)}</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  draw();
}

/* 3.9 Bond enthalpy: a ledger of bonds broken and bonds formed, and the energy path they make. */
const BE = { 'H–H': 436, 'F–F': 155, 'H–F': 567, 'N≡N': 941, 'N–H': 391, 'O=O': 495, 'O–H': 467, 'C=C': 614, 'C–C': 347, 'C–H': 413, 'Br–Br': 193, 'H–Br': 366 };
const BR = [
  { eq: 'H₂ + F₂ → 2 HF', br: [[1, 'H–H'], [1, 'F–F']], fo: [[2, 'H–F']] },
  { eq: 'N₂ + 3 H₂ → 2 NH₃', br: [[1, 'N≡N'], [3, 'H–H']], fo: [[6, 'N–H']], note: 'Two NH₃, each with three N–H bonds: six formed.' },
  { eq: '2 H₂ + O₂ → 2 H₂O', br: [[2, 'H–H'], [1, 'O=O']], fo: [[4, 'O–H']], note: 'Two H₂O, each with two O–H bonds: four formed.' },
  { eq: 'C₂H₄ + H₂ → C₂H₆', br: [[1, 'C=C'], [1, 'H–H']], fo: [[1, 'C–C'], [2, 'C–H']], note: 'The four C–H bonds already in ethene are untouched, so they are left out of both columns.' },
  { eq: '2 HBr → H₂ + Br₂', br: [[2, 'H–Br']], fo: [[1, 'H–H'], [1, 'Br–Br']] },
];
function m39(host) {
  let k = 0;
  const $ = shell(host, { label: 'bond enthalpy', title: 'Pay to break, get paid to form', sub: 'Every bond broken costs energy; every bond formed gives some back. ΔH is the difference.',
    body: `${chips('k', BR.map(x => x.eq), 0, 'Reaction')}
      <svg viewBox="0 0 520 190" role="img" aria-labelledby="m39t"><title id="m39t">Energy rises from the reactants to separate atoms as bonds break, then falls to the products as bonds form</title><g id="m39g" ${SVGT}></g></svg>
      <table class="tally" id="m39tb"></table><p class="margin" id="m39e" aria-live="polite"></p>` });
  const draw = () => {
    const r = BR[k], sum = l => l.reduce((t, [n, b]) => t + n * BE[b], 0), B = sum(r.br), F = sum(r.fo), dH = B - F, top = 30, sc = 120 / Math.max(B, F), yR = top + B * sc, yP = top + F * sc;
    $('m39g').innerHTML = `<path d="M40 ${yR}h110M205 ${top}h110M360 ${yP}h105" stroke="currentColor" stroke-width="2.4"/>
      <text x="95" y="${yR + 17}" text-anchor="middle" font-size="12.5">reactants</text><text x="260" y="${top - 8}" text-anchor="middle" font-size="12.5">separate atoms</text><text x="412" y="${yP + 17}" text-anchor="middle" font-size="12.5">products</text>
      <path d="M160 ${yR - 4}L196 ${top + 6}m-9 3l9 -3l-2 9" fill="none" stroke="var(--bad)" stroke-width="2.2"/><text x="150" y="${(yR + top) / 2 - 4}" text-anchor="end" font-size="12.5" fill="var(--bad)">break: +${B} kJ</text>
      <path d="M324 ${top + 6}L360 ${yP - 4}m-9 -3l9 3l-2 -9" fill="none" stroke="var(--good)" stroke-width="2.2"/><text x="372" y="${(yP + top) / 2 - 4}" font-size="12.5" fill="var(--good)">form: −${F} kJ</text>
      <path d="M40 ${yR}h466" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 4"/>${Math.abs(yP - yR) > 6 ? `<path d="M500 ${yR}V${yP}m-5 ${yP > yR ? -8 : 8}l5 ${yP > yR ? 8 : -8}l5 ${yP > yR ? -8 : 8}" fill="none" stroke="currentColor" stroke-width="1.6"/>` : ''}<text x="495" y="${(yR + yP) / 2 + 4}" text-anchor="end" font-size="12.5" font-weight="650">ΔH</text>`;
    const row = (l, i) => (l[i] ? `<td>${l[i][0]} × ${l[i][1]}</td><td>${l[i][0]} × ${BE[l[i][1]]} = ${l[i][0] * BE[l[i][1]]}</td>` : '<td></td><td></td>');
    $('m39tb').innerHTML = `<tr><th>Bonds broken</th><th>kJ</th><th>Bonds formed</th><th>kJ</th></tr>${Array.from({ length: Math.max(r.br.length, r.fo.length) }, (_, i) => `<tr>${row(r.br, i)}${row(r.fo, i)}</tr>`).join('')}<tr><td><b>Total in</b></td><td><b>${B}</b></td><td><b>Total out</b></td><td><b>${F}</b></td></tr>`;
    $('m39e').innerHTML = `ΔH ≈ ${B} − ${F} = ${dH > 0 ? '+' : '−'}${Math.abs(dH)} kJ: ${dH < 0 ? 'exothermic' : 'endothermic'}<small>${dH < 0 ? 'The bonds formed are stronger in total than the bonds broken, so more comes out than went in.' : 'The bonds broken are stronger in total than the bonds formed, so energy has to be supplied.'} ${esc(r.note ?? '')}</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  draw();
}

/* 3.10 Forces between molecules: which of the three can this molecule have? */
const IMF = [
  { f: 'CH₄', polar: 0, hb: 0, why: 'Non-polar: the four C–H pulls cancel. Only dispersion forces.' },
  { f: 'I₂', polar: 0, hb: 0, why: 'Non-polar, but with 106 electrons its dispersion forces are strong enough to make it a solid.' },
  { f: 'HCl', polar: 1, hb: 0, why: 'Polar, so dipoles attract. But H is bonded to Cl, not N, O or F: no hydrogen bonding.' },
  { f: 'CH₃F', polar: 1, hb: 0, why: 'It has H and it has F, but the H atoms are bonded to carbon. No hydrogen bonding.' },
  { f: 'H₂O', polar: 1, hb: 1, why: 'H bonded directly to O, and lone pairs on O to accept: hydrogen bonding, as well as the other two.' },
  { f: 'NH₃', polar: 1, hb: 1, why: 'H bonded directly to N, and a lone pair on N: hydrogen bonding.' },
  { f: 'CH₃OH', polar: 1, hb: 1, why: 'The O–H group can hydrogen-bond. The C–H hydrogens cannot.' },
  { f: 'CO₂', polar: 0, hb: 0, why: 'Polar bonds that cancel in a linear molecule: non-polar, so only dispersion forces.' },
];
function m310(host) {
  let k = 4;
  const $ = shell(host, { label: 'intermolecular forces', title: 'Which forces can it have?', sub: 'Every molecule has dispersion forces. The other two have to be earned.',
    body: `${chips('k', IMF.map(x => x.f), k, 'Molecule')}
      <svg viewBox="0 0 520 190" role="img" aria-labelledby="m310t"><title id="m310t">Three panels, one for each force between molecules, lit when the chosen molecule has that force</title><g id="m310g" ${SVGT}></g></svg>
      <p class="margin" id="m310e" aria-live="polite"></p>` });
  const draw = () => {
    const s = IMF[k], on = [1, s.polar, s.hb], names = ['dispersion', 'dipole–dipole', 'hydrogen bonding'], tests = ['has electrons: always', 'is the molecule polar?', 'H on N, O or F?'];
    const pics = [
      `<ellipse cx="52" cy="62" rx="26" ry="17" fill="none" stroke="currentColor" stroke-width="1.4"/><ellipse cx="118" cy="62" rx="26" ry="17" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="36" y="67" font-size="12">δ−</text><text x="58" y="67" font-size="12">δ+</text><text x="102" y="67" font-size="12">δ−</text><text x="124" y="67" font-size="12">δ+</text><path d="M80 62h10" stroke="var(--part)" stroke-width="2.4" stroke-dasharray="2 3"/><text x="85" y="100" text-anchor="middle" font-size="11">charge clouds flicker</text>`,
      `<rect x="26" y="48" width="52" height="28" rx="14" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="92" y="48" width="52" height="28" rx="14" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="34" y="67" font-size="12">δ+</text><text x="58" y="67" font-size="12">δ−</text><text x="100" y="67" font-size="12">δ+</text><text x="124" y="67" font-size="12">δ−</text><path d="M79 62h12" stroke="var(--part)" stroke-width="2.4" stroke-dasharray="2 3"/><text x="85" y="100" text-anchor="middle" font-size="11">permanent dipoles line up</text>`,
      `<text x="30" y="67" font-size="15" font-weight="650">O</text><path d="M44 62h14" stroke="currentColor" stroke-width="1.8"/><text x="60" y="67" font-size="15" font-weight="650">H</text><path d="M76 62h30" stroke="var(--part)" stroke-width="2.6" stroke-dasharray="3 4"/><circle cx="111" cy="58" r="2"/><circle cx="111" cy="66" r="2"/><text x="117" y="67" font-size="15" font-weight="650">O</text><text x="85" y="100" text-anchor="middle" font-size="11">H reaches for a lone pair</text>`];
    $('m310g').innerHTML = `<text x="260" y="20" text-anchor="middle" font-size="19" font-weight="650">${s.f}</text>` + names.map((n, i) => `<g transform="translate(${6 + i * 172} 30)" opacity="${on[i] ? 1 : 0.32}"><rect x="2" y="2" width="166" height="150" rx="8" fill="${on[i] ? 'color-mix(in srgb, var(--part) 14%, var(--paper))' : 'var(--paper-2)'}" stroke="${on[i] ? 'var(--part)' : 'currentColor'}" stroke-width="${on[i] ? 2.2 : 1}"/>
      <text x="85" y="24" text-anchor="middle" font-weight="650" font-size="14">${n}</text>${pics[i]}<text x="85" y="124" text-anchor="middle" font-size="11.5" font-style="italic">${tests[i]}</text><text x="85" y="143" text-anchor="middle" font-weight="700" fill="${on[i] ? 'var(--good)' : 'var(--bad)'}">${on[i] ? 'yes' : 'no'}</text></g>`).join('');
    $('m310e').innerHTML = `${s.f}: ${names.filter((_, i) => on[i]).join(', ')}<small>${esc(s.why)}</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  draw();
}

/* 3.11 Boiling points: the hydrides of four groups, period by period. */
const BP = [['Group 14', ['CH₄', 'SiH₄', 'GeH₄', 'SnH₄'], [-162, -112, -88, -52], 'No hydrogen bonding anywhere in this family. Bigger molecules have more electrons and stronger dispersion forces, so the line climbs steadily: this is what the other families would do without hydrogen bonding.'],
  ['Group 15', ['NH₃', 'PH₃', 'AsH₃', 'SbH₃'], [-33, -88, -62, -17], 'NH₃ is the smallest but boils well above PH₃: its molecules hydrogen-bond. From PH₃ on, size takes over again.'],
  ['Group 16', ['H₂O', 'H₂S', 'H₂Se', 'H₂Te'], [100, -60, -41, -2], 'By the trend of the other three, water “should” boil near −80 °C. Hydrogen bonding, with two H atoms and two lone pairs on every molecule, lifts it by about 180 °C.'],
  ['Group 17', ['HF', 'HCl', 'HBr', 'HI'], [20, -85, -67, -35], 'HF hydrogen-bonds; HCl, HBr and HI do not, and rise with size.']];
function m311(host) {
  let k = 2;
  const $ = shell(host, { label: 'boiling points', title: 'The ones that break the trend', sub: 'Boiling points of the hydrogen compounds of four groups. Pick a family.',
    body: `${chips('k', BP.map(x => x[0]), k, 'Family')}
      <svg viewBox="0 0 520 230" role="img" aria-labelledby="m311t"><title id="m311t">Boiling point against period for the hydrides of groups 14 to 17</title><g id="m311g" ${SVGT}></g></svg>
      <p class="margin" id="m311e" aria-live="polite"></p>` });
  const X = i => 110 + i * 115, Y = t => 196 - (t + 180) / 300 * 176;
  const draw = () => {
    let g = [-150, -100, -50, 0, 50, 100].map(t => `<path d="M70 ${Y(t)}h420" stroke="currentColor" stroke-width="${t ? 0.5 : 1.2}" opacity="${t ? 0.35 : 0.8}"/><text x="62" y="${Y(t) + 4}" text-anchor="end" font-size="11.5">${String(t).replace('-', '−')}</text>`).join('') + `<text x="16" y="14" font-size="11.5">boiling point, °C</text>` + [2, 3, 4, 5].map((p, i) => `<text x="${X(i)}" y="218" text-anchor="middle" font-size="11.5">period ${p}</text>`).join('');
    BP.forEach(([, names, t], f) => { const on = f === k; g += `<path d="M${t.map((v, i) => `${X(i)} ${Y(v)}`).join('L')}" fill="none" stroke="${on ? 'var(--part)' : 'currentColor'}" stroke-width="${on ? 2.8 : 1}" opacity="${on ? 1 : 0.3}"/>` + t.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="${on ? 5 : 3}" fill="${on ? 'var(--part)' : 'currentColor'}" opacity="${on ? 1 : 0.3}"/>${on ? `<text x="${X(i) + 9}" y="${Y(v) - 8}" font-size="12.5" font-weight="650" paint-order="stroke" stroke="var(--paper)" stroke-width="4">${names[i]} <tspan font-weight="400">${String(v).replace('-', '−')}</tspan></text>` : ''}`).join(''); });
    $('m311g').innerHTML = g;
    $('m311e').innerHTML = `${BP[k][0]}: ${BP[k][1].join(', ')}<small>${esc(BP[k][3])}</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  draw();
}

/* 3.12 Solids: build a cubic unit cell and count how much of each atom is inside it. */
const C8 = [0, 1].flatMap(x => [0, 1].flatMap(y => [0, 1].map(z => [x, y, z])));
const SITES = [['corners', C8, 8, '⅛', 1 / 8, 'shared by 8 cells'], ['face centres', [[.5, .5, 0], [.5, .5, 1], [.5, 0, .5], [.5, 1, .5], [0, .5, .5], [1, .5, .5]], 6, '½', 1 / 2, 'shared by 2 cells'],
  ['body centre', [[.5, .5, .5]], 1, '1', 1, 'wholly inside'], ['edge centres', [[.5, 0, 0], [.5, 1, 0], [.5, 0, 1], [.5, 1, 1], [0, .5, 0], [1, .5, 0], [0, .5, 1], [1, .5, 1], [0, 0, .5], [1, 0, .5], [0, 1, .5], [1, 1, .5]], 12, '¼', 1 / 4, 'shared by 4 cells']];
const EDGES = C8.flatMap((p, i) => C8.slice(i + 1).filter(q => p.reduce((t, v, n) => t + Math.abs(v - q[n]), 0) === 1).map(q => [p, q]));
/** A cube with atoms at fractional positions, drawn back to front. */
const cube = (atoms, a, cx, cy, s, r) => { const P = v => proj(v.map(c => c - 0.5), a, cx, cy, s);
  return EDGES.map(([p, q]) => { const u = P(p), v = P(q); return `<path d="M${u[0]} ${u[1]}L${v[0]} ${v[1]}" stroke="currentColor" stroke-width="1.1" opacity="0.55"/>`; }).join('')
    + atoms.map(([v, col]) => [P(v), col]).sort((p, q) => p[0][2] - q[0][2]).map(([p, col]) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r + p[2] * 3}" fill="${col}" stroke="currentColor" stroke-width="1"/>`).join(''); };
function m312(host) {
  const on = [true, false, false, false]; let ang = 0.5;
  const cols = ['var(--paper-2)', 'var(--part)', 'var(--bad)', 'var(--good)'];
  const $ = shell(host, { label: 'unit cells', title: 'How much of each atom is inside?', sub: 'Switch positions on and off to build a cubic unit cell. An atom on a boundary is shared with the neighbouring cells.',
    body: `<div class="chips" role="group" aria-label="Atom positions">${SITES.map((s, i) => `<button type="button" data-s="${i}" aria-pressed="${on[i]}">${s[0]}</button>`).join('')}</div>
      <svg viewBox="0 0 520 200" role="img" aria-labelledby="m312t"><title id="m312t">A cube with atoms at the chosen positions, beside a count of the atoms that belong to it</title><g id="m312g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m312a', 'Turn it', 0, 628, 1, 50)}</div><p class="margin" id="m312e" aria-live="polite"></p>` });
  const draw = () => {
    const atoms = SITES.flatMap((s, i) => (on[i] ? s[1].map(v => [v, cols[i]]) : [])), total = SITES.reduce((t, s, i) => t + (on[i] ? s[2] * s[4] : 0), 0), key = on.map(Number).join('');
    const name = { 1000: 'simple cubic', 1010: 'body-centred cubic', 1100: 'face-centred cubic' }[key];
    let y = 34;
    $('m312g').innerHTML = cube(atoms, ang, 130, 100, 105, 11) + `<text x="280" y="16" font-size="12.5">atoms that belong to this one cell</text>` + SITES.map((s, i) => (on[i] ? `<circle cx="288" cy="${(y += 26) - 5}" r="7" fill="${cols[i]}" stroke="currentColor"/><text x="304" y="${y}">${s[2]} ${s[0]} × ${s[3]} = <tspan font-weight="650">${s[2] * s[4]}</tspan></text>` : '')).join('')
      + `<path d="M280 ${y + 14}h220" stroke="currentColor"/><text x="280" y="${y + 40}" font-size="20" font-weight="650">${total} atom${total === 1 ? '' : 's'} per cell</text>${name ? `<text x="280" y="${y + 60}" fill="var(--part)" font-weight="650">${name}</text>` : ''}`;
    $('m312e').innerHTML = atoms.length ? `${SITES.filter((_, i) => on[i]).map(s => `${s[2]} × ${s[3]}`).join(' + ')} = ${total}<small>${name ? `This arrangement is the ${name} cell.` : on[0] ? 'Not one of the three cells of this lesson, but the counting works the same way.' : 'Real cubic cells always have atoms at the corners: switch them on.'} Turn the cube: a corner atom is cut by three faces, so only an eighth of it is inside.</small>` : 'An empty cell. Switch on some positions.';
  };
  host.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { const i = Number(b.dataset.s); on[i] = !on[i]; b.setAttribute('aria-pressed', String(on[i])); draw(); }));
  $('m312a').addEventListener('input', e => { ang = Number(e.target.value) / 100; draw(); });
  draw();
}

/* 3.13 Density of a crystal: radius → edge → volume; atoms per cell → mass; then density. */
const XT = [['Al', 'face-centred', 143, 26.98], ['Ag', 'face-centred', 144, 107.87], ['W', 'body-centred', 137, 183.84], ['Na', 'body-centred', 186, 22.99], ['Po', 'simple', 167, 209]];
const CELL = { simple: [1, 1 / 2, 'an edge', 'a = 2r', 'a'], 'body-centred': [2, Math.sqrt(3) / 4, 'the body diagonal', '√3 a = 4r', '√3 a'], 'face-centred': [4, Math.sqrt(2) / 4, 'a face diagonal', '√2 a = 4r', '√2 a'] };
function m313(host) {
  let k = 0;
  const $ = shell(host, { label: 'crystal density', title: 'From one atom to a density', sub: 'The atoms touch along one line of the cell. That line links the radius to the edge; the rest is mass over volume.',
    body: `${chips('k', XT.map(x => `${x[0]} (${x[1]})`), 0, 'Metal')}
      <svg viewBox="0 0 520 190" role="img" aria-labelledby="m313t"><title id="m313t">A slice through the unit cell showing the line along which the atoms touch</title><g id="m313g" ${SVGT}></g></svg>
      <table class="tally" id="m313tb"></table><p class="margin" id="m313e" aria-live="polite"></p>` });
  const draw = () => {
    const [el, type, r, M] = XT[k], [Z, rOverA, line, rel, lab] = CELL[type], a = r / rOverA, V = (a * 1e-10) ** 3, m = Z * M / 6.022e23, d = m / V;
    // a slice: the cube face for simple and face-centred; the diagonal plane (a by √2 a) for body-centred
    const w = type === 'body-centred' ? 150 * Math.SQRT2 : 150, h = 150, x0 = 130 - w / 2, y0 = 20, R = rOverA * 150, circ = (x, y) => `<circle cx="${x}" cy="${y}" r="${R}" fill="var(--part)" opacity="0.3" stroke="currentColor" stroke-width="1"/>`;
    const corners = [[x0, y0], [x0 + w, y0], [x0, y0 + h], [x0 + w, y0 + h]];
    let g = `<clipPath id="m313c"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#m313c)">${corners.map(c => circ(...c)).join('')}${type === 'simple' ? '' : circ(x0 + w / 2, y0 + h / 2)}</g><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
    g += type === 'simple' ? `<path d="M${x0} ${y0 + h}h${w}" stroke="var(--bad)" stroke-width="3.2"/>` : `<path d="M${x0} ${y0 + h}L${x0 + w} ${y0}" stroke="var(--bad)" stroke-width="3.2"/>`;
    g += `<text x="${x0 + w / 2}" y="${y0 + h + 16}" text-anchor="middle" font-size="12">${type === 'body-centred' ? '√2 a (a face diagonal)' : 'a'}</text><text x="${x0 - 8}" y="${y0 + h / 2}" text-anchor="end" font-size="12">a</text>
      <text x="290" y="34" font-size="12.5">${type === 'body-centred' ? 'slice through opposite edges' : 'one face of the cube'}</text><text x="290" y="62" font-weight="650">atoms touch along ${line}</text><text x="290" y="84" fill="var(--bad)">red line = ${lab} = ${type === 'simple' ? '2' : '4'} radii</text>
      <text x="290" y="118" font-size="20" font-weight="650">${rel}</text><text x="290" y="146">${Z} atom${Z > 1 ? 's' : ''} per cell</text>`;
    $('m313g').innerHTML = g;
    $('m313tb').innerHTML = `<tr><th>Step</th><th>Working</th><th>Result</th></tr>
      <tr><td>Edge</td><td>${type === 'simple' ? `2 × ${r} pm` : `4 × ${r} pm ÷ ${type === 'body-centred' ? '√3' : '√2'}`}</td><td>${a.toFixed(0)} pm = ${sci(a * 1e-10)} cm</td></tr>
      <tr><td>Volume</td><td>a³</td><td>${sci(V)} cm³</td></tr><tr><td>Mass</td><td>${Z} × ${M} g/mol ÷ 6.022 × 10²³</td><td>${sci(m)} g</td></tr>
      <tr><td><b>Density</b></td><td>mass ÷ volume</td><td><b>${d.toFixed(d < 10 ? 2 : 1)} g/cm³</b></td></tr>`;
    $('m313e').innerHTML = `${el}: r = ${r} pm, ${type} cubic → ${d.toFixed(d < 10 ? 2 : 1)} g/cm³<small>The radius is in picometres but density needs centimetres. Convert the edge before cubing it (the Edge row), or the answer is wrong by thirty powers of ten.</small>`;
  };
  onChips(host, 'k', i => { k = i; draw(); });
  draw();
}

/* 3.14 X-ray diffraction: the lower ray travels 2d sin θ further. When that is a whole number of wavelengths, the rays reinforce. */
function m314(host) {
  const lam = 154; let d = 250, th = 12;
  const $ = shell(host, { label: 'Bragg diffraction', title: 'Tilt until the waves line up', sub: `X-rays of wavelength ${lam} pm reflect from two layers of atoms. The lower ray has further to go: the red part.`,
    body: `${chips('d', ['d = 200 pm', 'd = 250 pm', 'd = 300 pm'], 1, 'Spacing of the layers')}
      <svg viewBox="0 0 520 225" role="img" aria-labelledby="m314t"><title id="m314t">Two rays reflecting from two layers of atoms, with the extra path of the lower ray marked, and a detector</title><g id="m314g" ${SVGT}></g></svg>
      <div class="ctrl">${slider('m314a', 'Angle θ', 5, 60, 0.1, th)}</div><p class="margin" id="m314e" aria-live="polite"></p>` });
  const draw = () => {
    const t = th * Math.PI / 180, extra = 2 * d * Math.sin(t), n = extra / lam, near = Math.round(n), bright = Math.cos(Math.PI * n) ** 2, hit = near >= 1 && Math.abs(n - near) < 0.02;
    const D = d / 250 * 78, y1 = 78, y2 = y1 + D, cx = 230, L = 150, dx = L * Math.cos(t), dy = L * Math.sin(t), ex = D * Math.sin(t) * Math.cos(t), ey = D * Math.sin(t) * Math.sin(t);
    // the extra path: from the foot of each perpendicular dropped from the upper reflection point, down to the lower one
    const ay = y2 - ey, ax = cx - ex, bx = cx + ex;
    $('m314g').innerHTML = [y1, y2].map(y => `<path d="M40 ${y}h380" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 4"/>` + Array.from({ length: 9 }, (_, i) => `<circle cx="${62 + i * 42}" cy="${y}" r="8" fill="var(--paper-2)" stroke="currentColor"/>`).join('')).join('')
      + `<path d="M${cx - dx} ${y1 - dy}L${cx} ${y1}L${cx + dx} ${y1 - dy}" fill="none" stroke="var(--part)" stroke-width="2"/>
        <path d="M${cx - dx} ${y2 - dy}L${cx} ${y2}L${cx + dx} ${y2 - dy}" fill="none" stroke="var(--part)" stroke-width="2"/>
        <path d="M${ax} ${ay}L${cx} ${y2}L${bx} ${ay}" fill="none" stroke="var(--bad)" stroke-width="4"/><path d="M${cx} ${y1}L${ax} ${ay}M${cx} ${y1}L${bx} ${ay}" stroke="currentColor" stroke-width="0.9" stroke-dasharray="3 3"/>
        <path d="M${cx + 8} ${y1}V${y2}" stroke="currentColor" stroke-width="1"/><text x="${cx + 13}" y="${(y1 + y2) / 2 + 4}" font-size="12" font-style="italic">d</text>
        <path d="M${cx - 110} ${y1}A110 110 0 0 1 ${cx - 110 * Math.cos(t)} ${y1 - 110 * Math.sin(t)}" fill="none" stroke="currentColor"/><text x="${cx - 128}" y="${y1 - 110 * Math.sin(t / 2) + 2}" font-size="13" font-style="italic">θ</text>
        <circle cx="462" cy="60" r="26" fill="var(--paper-2)" stroke="currentColor"/><circle cx="462" cy="60" r="${3 + 21 * bright}" fill="var(--part)" opacity="${0.25 + 0.75 * bright}"/><text x="462" y="104" text-anchor="middle" font-size="12">detector</text>
        <text x="462" y="124" text-anchor="middle" font-size="12.5" font-weight="650" fill="${hit ? 'var(--good)' : 'currentColor'}">${hit ? 'bright spot' : bright > 0.6 ? 'nearly' : 'dim'}</text>
        <text x="40" y="216" font-size="12.5">extra path = 2d sin θ = ${extra.toFixed(0)} pm = <tspan font-weight="650">${n.toFixed(2)}</tspan> wavelengths</text>`;
    const angs = [1, 2, 3].map(q => q * lam / (2 * d)).filter(s => s <= Math.sin(60 * Math.PI / 180)).length;
    $('m314e').innerHTML = hit ? `2 × ${d} × sin ${th.toFixed(1)}° = ${near} × ${lam} pm: the rays are in step<small>n = ${near}. Crest meets crest and the two rays reinforce.</small>` : `${n.toFixed(2)} wavelengths: not a whole number, so the rays are out of step<small>Move the angle until the extra path is exactly 1, 2 or 3 wavelengths. There ${angs === 1 ? 'is 1 such angle' : `are ${angs} such angles`} below 60° for this spacing. Note that it is sin θ that doubles from n = 1 to n = 2, not θ.</small>`;
  };
  onChips(host, 'd', i => { d = [200, 250, 300][i]; draw(); });
  $('m314a').addEventListener('input', e => { th = Number(e.target.value); draw(); });
  draw();
}

export default { '3.8': m38, '3.9': m39, '3.10': m310, '3.11': m311, '3.12': m312, '3.13': m313, '3.14': m314 };
