// For each lesson, the section of OpenStax Chemistry 2e (a free online textbook) that covers the same ground.
// These are links only: no text or figures are copied from the book.
const BASE = 'https://openstax.org/books/chemistry-2e/pages/';
const S = {
  '1.5': ['1.5 Measurement Uncertainty, Accuracy, and Precision', '1-5-measurement-uncertainty-accuracy-and-precision'],
  '2.1': ['2.1 Early Ideas in Atomic Theory', '2-1-early-ideas-in-atomic-theory'], '2.7': ['2.7 Chemical Nomenclature', '2-7-chemical-nomenclature'],
  '3.1': ['3.1 Formula Mass and the Mole Concept', '3-1-formula-mass-and-the-mole-concept'], '3.3': ['3.3 Molarity', '3-3-molarity'],
  '4.1': ['4.1 Writing and Balancing Chemical Equations', '4-1-writing-and-balancing-chemical-equations'], '4.2': ['4.2 Classifying Chemical Reactions', '4-2-classifying-chemical-reactions'],
  '4.3': ['4.3 Reaction Stoichiometry', '4-3-reaction-stoichiometry'], '4.4': ['4.4 Reaction Yields', '4-4-reaction-yields'],
  '5.1': ['5.1 Energy Basics', '5-1-energy-basics'], '5.2': ['5.2 Calorimetry', '5-2-calorimetry'], '5.3': ['5.3 Enthalpy', '5-3-enthalpy'],
  '6.1': ['6.1 Electromagnetic Energy', '6-1-electromagnetic-energy'], '6.2': ['6.2 The Bohr Model', '6-2-the-bohr-model'], '6.3': ['6.3 Development of Quantum Theory', '6-3-development-of-quantum-theory'],
  '6.4': ['6.4 Electronic Structure of Atoms (Electron Configurations)', '6-4-electronic-structure-of-atoms-electron-configurations'], '6.5': ['6.5 Periodic Variations in Element Properties', '6-5-periodic-variations-in-element-properties'],
  '7.2': ['7.2 Covalent Bonding', '7-2-covalent-bonding'], '7.3': ['7.3 Lewis Symbols and Structures', '7-3-lewis-symbols-and-structures'], '7.4': ['7.4 Formal Charges and Resonance', '7-4-formal-charges-and-resonance'],
  '7.5': ['7.5 Strengths of Ionic and Covalent Bonds', '7-5-strengths-of-ionic-and-covalent-bonds'], '7.6': ['7.6 Molecular Structure and Polarity', '7-6-molecular-structure-and-polarity'],
  '8.2': ['8.2 Hybrid Atomic Orbitals', '8-2-hybrid-atomic-orbitals'], '8.3': ['8.3 Multiple Bonds', '8-3-multiple-bonds'],
  '10.1': ['10.1 Intermolecular Forces', '10-1-intermolecular-forces'], '10.6': ['10.6 Lattice Structures in Crystalline Solids', '10-6-lattice-structures-in-crystalline-solids'],
  '12.1': ['12.1 Chemical Reaction Rates', '12-1-chemical-reaction-rates'], '12.2': ['12.2 Factors Affecting Reaction Rates', '12-2-factors-affecting-reaction-rates'], '12.3': ['12.3 Rate Laws', '12-3-rate-laws'],
  '12.4': ['12.4 Integrated Rate Laws', '12-4-integrated-rate-laws'], '12.5': ['12.5 Collision Theory', '12-5-collision-theory'], '12.6': ['12.6 Reaction Mechanisms', '12-6-reaction-mechanisms'], '12.7': ['12.7 Catalysis', '12-7-catalysis'],
};
// lesson → OpenStax section
const MAP = {
  '1.1': '2.1', '1.2': '1.5', '1.3': '2.7', '1.4': '3.1', '1.5': '4.1', '1.6': '4.3', '1.7': '4.4', '1.8': '4.4', '1.9': '3.3', '1.10': '4.2', '1.11': '4.2', '1.12': '4.2', '1.13': '4.2',
  '2.1': '5.3', '2.2': '5.1', '2.3': '5.2', '2.4': '5.3', '2.5': '5.3', '2.6': '5.3', '2.7': '6.1', '2.8': '6.2', '2.9': '6.3', '2.10': '6.4', '2.11': '6.5', '2.12': '6.4', '2.13': '6.5', '2.14': '6.5',
  '3.1': '7.2', '3.2': '7.3', '3.3': '7.4', '3.4': '7.3', '3.5': '7.6', '3.6': '7.6', '3.7': '8.2', '3.8': '8.3', '3.9': '7.5', '3.10': '10.1', '3.11': '10.1', '3.12': '10.6', '3.13': '10.6', '3.14': '10.6',
  '4.1': '12.2', '4.2': '12.1', '4.3': '12.3', '4.4': '12.3', '4.5': '12.4', '4.6': '12.4', '4.7': '12.5', '4.8': '12.5', '4.9': '12.6', '4.10': '12.7',
};
/** The OpenStax section to read alongside a lesson: { title, url }, or undefined. */
export const readMore = id => (MAP[id] ? { title: S[MAP[id]][0], url: BASE + S[MAP[id]][1] } : undefined);
