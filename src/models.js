// Every working model in the book, by lesson. A lesson without an entry shows the description of its planned model.
import { mountModel } from './model-1-1.js';
import u1a from './model-u1a.js';
import u1b from './model-u1b.js';
import u2a from './model-u2a.js';
import u2b from './model-u2b.js';
import u3a from './model-u3a.js'; import u3b from './model-u3b.js';

export const MODELS = { '1.1': mountModel, ...u1a, ...u1b, ...u2a, ...u2b, ...u3a, ...u3b };
