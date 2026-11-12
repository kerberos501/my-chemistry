export const esc = s => String(s ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);

/** Remembered progress. Works on the published site; fails silently where storage is blocked. */
export const store = {
  get(k) { try { return JSON.parse(localStorage.getItem('em:' + k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem('em:' + k, JSON.stringify(v)); } catch { /* not remembered */ } },
};

/** Reads a typed number: "2.9e15", "2.92 x 10^15", "−75", "0,375", "92.5 %". Returns NaN if it is not a number. */
export function readNumber(text) {
  let s = String(text).trim().replace(/[−–]/g, '-').replace(/,/g, '.').replace(/\s+/g, '');
  s = s.replace(/[×x*]10\^?\(?(-?\d+)\)?/i, 'e$1');
  const m = s.match(/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?/i);
  return m ? Number(m[0]) : NaN;
}

/** A typed answer is right if it is within 1% of the book's answer (and has the right sign). */
export const closeEnough = (given, want) => Number.isFinite(given) && Math.abs(given - want) <= Math.max(Math.abs(want) * 0.01, 1e-300) && (want === 0 || Math.sign(given) === Math.sign(want));
