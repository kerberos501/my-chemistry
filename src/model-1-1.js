// The working model for lesson 1.1: one compound, any size of sample, always the same mass ratio.
import { A } from './chem.js';
import { esc } from './ui.js';

const COMPOUNDS = [
  { id: 'MgO', name: 'magnesium oxide', a: ['Mg', 1, 'magnesium'], b: ['O', 1, 'oxygen'] },
  { id: 'H2O', name: 'water', a: ['H', 2, 'hydrogen'], b: ['O', 1, 'oxygen'] },
  { id: 'FeS', name: 'iron(II) sulfide', a: ['Fe', 1, 'iron'], b: ['S', 1, 'sulfur'] },
  { id: 'CO2', name: 'carbon dioxide', a: ['C', 1, 'carbon'], b: ['O', 2, 'oxygen'] },
];
const fmt = (x, n = 3) => Number(x).toPrecision(n).replace(/\.?0+e/, 'e');
const TARGET = 8.00; // challenge: a sample of magnesium oxide that holds exactly 8.00 g of oxygen

export function mountModel(host, onStamp) {
  let comp = COMPOUNDS[0], mass = 6.0, found = new Set();
  host.innerHTML = `<section class="model" aria-label="Working model: fixed recipes">
    <h2>Pull a sample apart</h2>
    <p class="sub">Pick a compound, change the size of the sample, and watch the two jars.</p>
    <div class="chips" role="group" aria-label="Compound">${COMPOUNDS.map(c => `<button type="button" data-c="${c.id}" aria-pressed="${c === comp}">${esc(c.name)}</button>`).join('')}</div>
    <svg viewBox="0 0 520 230" role="img" aria-labelledby="m11t"><title id="m11t">A sample decomposed into two jars, one for each element</title>
      <g font-family="Source Serif 4, Georgia, serif" font-size="14" fill="currentColor">
        <rect id="m11s" x="24" y="60" width="120" height="120" rx="6" fill="var(--paper-2)" stroke="currentColor" stroke-width="1.5"/>
        <text id="m11sl" x="84" y="200" text-anchor="middle"></text>
        <path d="M156 120h52m-9-7 9 7-9 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="182" y="108" text-anchor="middle" font-size="12.5" font-style="italic">decompose</text>
        ${[0, 1].map(i => `<g transform="translate(${236 + i * 140} 0)">
          <path d="M0 40h100v148a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z" fill="var(--paper)" stroke="currentColor" stroke-width="1.6"/>
          <rect id="m11j${i}" x="2" y="186" width="96" height="0" rx="5" fill="var(--part)" opacity="${i ? 0.45 : 0.9}"/>
          <rect x="-6" y="32" width="112" height="10" rx="3" fill="currentColor" opacity="0.75"/>
          <text id="m11l${i}" x="50" y="216" text-anchor="middle"></text>
          <text id="m11m${i}" x="50" y="24" text-anchor="middle" font-weight="650" font-size="16"></text></g>`).join('')}
      </g></svg>
    <div class="ctrl"><label for="m11r">Sample</label><input id="m11r" type="range" min="1" max="30" step="0.1" value="${mass}"><output id="m11o" for="m11r"></output></div>
    <p class="margin" id="m11eq" aria-live="polite"></p>
    <p class="challenge"><b>Challenge.</b> Make a sample of magnesium oxide that holds exactly ${TARGET.toFixed(2)} g of oxygen. Then check: is the ratio any different in the other three compounds’ own samples? <span id="m11c"></span></p>
  </section>`;
  const $ = id => host.querySelector('#' + id);
  const draw = () => {
    const [ea, na, an] = comp.a, [eb, nb, bn] = comp.b;
    const ma = A[ea] * na, mb = A[eb] * nb, tot = ma + mb;
    const ga = mass * ma / tot, gb = mass * mb / tot, side = 40 + mass * 2.7;
    $('m11s').setAttribute('width', side); $('m11s').setAttribute('height', side);
    $('m11s').setAttribute('x', 84 - side / 2); $('m11s').setAttribute('y', 120 - side / 2);
    $('m11sl').textContent = `${mass.toFixed(1)} g ${comp.name}`;
    [[ga, an], [gb, bn]].forEach(([g, name], i) => {
      const h = Math.min(144, g * 4.8);
      $('m11j' + i).setAttribute('height', h); $('m11j' + i).setAttribute('y', 194 - h);
      $('m11l' + i).textContent = name; $('m11m' + i).textContent = `${g.toFixed(2)} g`;
    });
    $('m11o').textContent = `${mass.toFixed(1)} g`;
    $('m11eq').innerHTML = `${esc(bn)} ÷ ${esc(an)} = ${gb.toFixed(2)} g ÷ ${ga.toFixed(2)} g = ${fmt(mb / ma)}<small>the same for every size of sample: ${fmt(mb / ma)} g of ${esc(bn)} for each gram of ${esc(an)}</small>`;
    found.add(comp.id);
    const hit = comp.id === 'MgO' && Math.abs(gb - TARGET) < 0.03;
    if (hit) host.dataset.hit = '1';
    $('m11c').textContent = host.dataset.hit ? `Done: ${(TARGET * tot / mb).toFixed(1)} g of magnesium oxide holds ${TARGET.toFixed(2)} g of oxygen.` : '';
    if (host.dataset.hit && found.size === COMPOUNDS.length) onStamp?.();
  };
  host.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => {
    comp = COMPOUNDS.find(c => c.id === b.dataset.c);
    host.querySelectorAll('[data-c]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    draw();
  }));
  $('m11r').addEventListener('input', e => { mass = Number(e.target.value); draw(); });
  draw();
}
