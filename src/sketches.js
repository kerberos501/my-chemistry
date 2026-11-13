// Small drawings that appear with the answer to a worked example, where the answer is easier to see than to read.
import { lewis } from './model-u3a.js';

const A = (el, x, y) => ({ el, x, y });
const ring = (el, n, r, start = -90) => Array.from({ length: n }, (_, i) => { const t = (start + i * 360 / n) * Math.PI / 180; return A(el, Math.round(r * Math.cos(t)), Math.round(r * Math.sin(t))); });
const star = (n, orders = []) => Array.from({ length: n }, (_, i) => [0, i + 1, orders[i] ?? 1]);
const svg = (h, title, body) => `<svg viewBox="0 0 520 ${h}" role="img" aria-label="${title}"><g fill="currentColor" font-family="inherit" font-size="13">${body}</g></svg>`;
const cap = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="12.5">${t}</text>`;
/** A structure drawn with σ bonds in black and π bonds in colour. */
const sticks = (s, cx, cy, mark = []) => s.bonds.map(([i, j, o], n) => { const a = s.atoms[i], b = s.atoms[j], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  return Array.from({ length: o }, (_, q) => { const off = [0, 6, -6][q]; return `<path d="M${cx + a.x + ux * 12 - uy * off} ${cy + a.y + uy * 12 + ux * off}L${cx + b.x - ux * 12 - uy * off} ${cy + b.y - uy * 12 + ux * off}" stroke="${q || mark.includes(n) ? 'var(--part)' : 'currentColor'}" stroke-width="${q || mark.includes(n) ? 2.8 : 2}"/>`; }).join(''); }).join('')
  + s.atoms.map(a => `<text x="${cx + a.x}" y="${cy + a.y + 5.5}" text-anchor="middle" font-size="16" font-weight="650">${a.el}</text>`).join('');

const no3 = d => ({ atoms: [A('N', 0, 4), A('O', 0, -46), A('O', -46, 34), A('O', 46, 34)], bonds: star(3, [0, 1, 2].map(i => (i === d ? 2 : 1))), lp: [0, ...[0, 1, 2].map(i => (i === d ? 2 : 3))] });
const fcNo3 = d => ['+1', ...[0, 1, 2].map(i => (i === d ? '0' : '−1'))];

export const SKETCH = {
  '3.2': () => svg(90, 'The Lewis structure of carbon dioxide: two double bonds, two lone pairs on each oxygen', lewis({ atoms: [A('C', 0, 0), A('O', -58, 0), A('O', 58, 0)], bonds: [[0, 1, 2], [0, 2, 2]], lp: [0, 2, 2] }, 150, 44) + `<text x="270" y="38">4 bonding pairs + 4 lone pairs</text><text x="270" y="58">= 16 electrons, an octet on every atom</text>`),
  '3.3': () => svg(150, 'The three resonance structures of the nitrate ion with the formal charge on each atom', [0, 1, 2].map(d => lewis(no3(d), 90 + d * 170, 66, fcNo3(d))).join('') + `<text x="175" y="72" text-anchor="middle" font-size="18">↔</text><text x="345" y="72" text-anchor="middle" font-size="18">↔</text>` + cap(260, 142, 'the double bond can be on any of the three oxygens: the real ion is the average')),
  '3.4': () => svg(170, 'The Lewis structure of sulfur hexafluoride: six bonds to sulfur', lewis({ atoms: [A('S', 0, 0), ...ring('F', 6, 58)], bonds: star(6), lp: [0, 3, 3, 3, 3, 3, 3] }, 150, 84) + `<text x="290" y="74">6 bonds × 2 = 12 electrons on S</text><text x="290" y="94">6 F × 3 lone pairs × 2 = 36</text><text x="290" y="114">12 + 36 = 48 ✓</text>`),
  '3.7': () => svg(150, 'Lewis structures of methanal and sulfur tetrafluoride', lewis({ atoms: [A('C', 0, 10), A('O', 0, -42), A('H', -46, 40), A('H', 46, 40)], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1]], lp: [0, 2, 0, 0] }, 120, 62) + cap(120, 142, 'H₂CO: 3 domains on C → sp²')
    + lewis({ atoms: [A('S', 0, 0), A('F', -56, -20), A('F', 56, -20), A('F', -40, 44), A('F', 40, 44)], bonds: star(4), lp: [1, 3, 3, 3, 3] }, 380, 56) + cap(380, 142, 'SF₄: 4 bonds + 1 lone pair = 5 domains → sp³d')),
  '3.8': () => svg(130, 'Propene drawn in full: eight sigma bonds in black and one pi bond in colour', sticks({ atoms: [A('C', -60, 0), A('C', 0, 0), A('C', 60, 0), A('H', -92, -36), A('H', -92, 36), A('H', 0, -44), A('H', 60, -44), A('H', 106, 0), A('H', 60, 44)], bonds: [[0, 1, 2], [1, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [2, 6, 1], [2, 7, 1], [2, 8, 1]] }, 150, 62)
    + `<text x="250" y="48">each line between atoms: one σ (8 in all)</text><text x="250" y="70" fill="var(--part)" font-weight="650">the second line of C=C: one π</text>`),
  '3.10': () => svg(130, 'Methylamine drawn in full, with its nitrogen to hydrogen bonds marked', sticks({ atoms: [A('C', -30, 0), A('N', 30, 0), A('H', -30, -44), A('H', -76, 0), A('H', -30, 44), A('H', 62, -36), A('H', 62, 36)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [1, 6, 1]] }, 130, 62, [4, 5])
    + `<circle cx="150" cy="58" r="1.9"/><circle cx="150" cy="66" r="1.9"/><text x="225" y="48" fill="var(--part)" font-weight="650">H bonded to N → hydrogen bonding</text><text x="225" y="70">the three H atoms on carbon take no part</text>`),
  '3.13': () => { const a = 110, R = a * Math.SQRT2 / 4, x = 60, y = 14; return svg(150, 'One face of a face-centred cubic cell: the atoms touch along the face diagonal, which is four radii long',
    `<clipPath id="sk313"><rect x="${x}" y="${y}" width="${a}" height="${a}"/></clipPath><g clip-path="url(#sk313)">${[[0, 0], [a, 0], [0, a], [a, a], [a / 2, a / 2]].map(([p, q]) => `<circle cx="${x + p}" cy="${y + q}" r="${R}" fill="var(--part)" opacity="0.3" stroke="currentColor"/>`).join('')}</g><rect x="${x}" y="${y}" width="${a}" height="${a}" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M${x} ${y + a}L${x + a} ${y}" stroke="var(--bad)" stroke-width="3"/>
    <text x="${x + a / 2}" y="${y + a + 16}" text-anchor="middle" font-style="italic">a</text><text x="230" y="46">face diagonal = r + 2r + r = 4r</text><text x="230" y="68">by Pythagoras it is also a√2</text><text x="230" y="96" font-weight="650">a√2 = 4r, so a = 4r ÷ √2 = r√8</text>`); },
};
