// Shared pieces for the working models: number formatting, formulas, and the frame every model sits in.
import { esc } from './ui.js';
export { esc };

const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const subn = n => String(n).replace(/\d/g, d => SUB[d]);
export const supn = n => String(n).replace(/-/g, '⁻').replace(/\+/g, '⁺').replace(/\d/g, d => SUP[d]);
/** Ion charge as a superscript: 1 → ⁺, −2 → ²⁻. */
export const chg = q => (Math.abs(q) > 1 ? supn(Math.abs(q)) : '') + (q > 0 ? '⁺' : '⁻');
/** A signed oxidation number: +2, −1, 0. */
export const signed = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n);

/** A number to `sf` significant figures; powers of ten written out for the very large and very small. */
export function sci(x, sf = 3) {
  if (!Number.isFinite(x)) return '–';
  if (x === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -3 && e < 5) return (e >= sf ? String(Number(x.toPrecision(sf))) : x.toPrecision(sf)).replace('-', '−');
  return `${(x / 10 ** e).toFixed(sf - 1).replace('-', '−')} × 10${supn(e)}`;
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** Formula of the ionic compound of cation c and anion a (each { f, ch, poly }), in the smallest whole-number ratio. */
export function ionic(c, a) {
  const g = gcd(c.ch, a.ch), nc = a.ch / g, na = c.ch / g;
  const part = (ion, n) => (n === 1 ? ion.f : ion.poly ? `(${ion.f})${subn(n)}` : ion.f + subn(n));
  return { f: part(c, nc) + part(a, na), nc, na };
}

/** The frame of a model. Returns a lookup for the elements inside it. */
export function shell(host, { label, title, sub, body }) {
  host.innerHTML = `<section class="model" aria-label="Working model: ${esc(label)}"><h2>${esc(title)}</h2><p class="sub">${esc(sub)}</p>${body}</section>`;
  return id => host.querySelector('#' + id);
}
export const chips = (attr, items, cur, label) => `<div class="chips" role="group" aria-label="${esc(label)}">${items.map((t, i) => `<button type="button" data-${attr}="${i}" aria-pressed="${i === cur}">${esc(t)}</button>`).join('')}</div>`;
/** Wires a row of chips: fn(index) is called when one is pressed. */
export function onChips(host, attr, fn) {
  const all = host.querySelectorAll(`[data-${attr}]`);
  all.forEach(b => b.addEventListener('click', () => { all.forEach(x => x.setAttribute('aria-pressed', String(x === b))); fn(Number(b.dataset[attr])); }));
}
export const slider = (id, label, min, max, step, val) => `<label for="${id}">${esc(label)}</label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"><output id="${id}o" for="${id}"></output>`;
export const SVGT = 'font-family="Source Serif 4, Georgia, serif" font-size="13.5" fill="currentColor"';
export const still = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
