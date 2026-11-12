// Atomic masses (g/mol). Where the course exams quote a molar mass, the book uses the exam's value.
export const A = { H:1.008, He:4.00, Li:6.94, Be:9.01, B:10.81, C:12.01, N:14.01, O:16.00, F:19.00, Ne:20.18,
  Na:22.99, Mg:24.31, Al:26.98, Si:28.09, P:30.97, S:32.06, Cl:35.45, Ar:39.95, K:39.10, Ca:40.08,
  Cr:52.00, Mn:54.94, Fe:55.85, Co:58.93, Ni:58.69, Cu:63.55, Zn:65.38, Br:79.90, Kr:83.80, Sr:87.62,
  Nb:92.91, Mo:95.95, Ag:107.87, Sn:118.71, I:126.90, Ba:137.33, W:183.84, Ir:192.22, Pt:195.08, Au:196.97, Pb:207.2, Po:209 };

/** Molar mass of a formula such as "Ca(NO3)2" or "Fe2O3", in g/mol. */
export function mm(formula) {
  let i = 0;
  const num = () => { let s = ''; while (/\d/.test(formula[i] ?? '')) s += formula[i++]; return s ? +s : 1; };
  const group = () => {
    let total = 0;
    while (i < formula.length && formula[i] !== ')') {
      if (formula[i] === '(') { i++; const g = group(); i++; total += g * num(); }
      else {
        const m = /^[A-Z][a-z]?/.exec(formula.slice(i));
        if (!m || !(m[0] in A)) throw new Error(`mm: unknown element at "${formula.slice(i)}" in ${formula}`);
        i += m[0].length; total += A[m[0]] * num();
      }
    }
    return total;
  };
  return group();
}
export const NA = 6.022e23, h = 6.626e-34, c = 3.00e8, RH = 2.18e-18;
