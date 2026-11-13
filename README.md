# My Chemistry

A chemistry book in four parts: 51 short lessons, each one spread. Published at https://kerberos501.github.io/my-chemistry/

- Every lesson in Parts 1, 2 and 3 has a working model on its right-hand page. `docs/visuals.md` lists the model for each lesson and what is still planned for Part 4.
- Every lesson links to the matching section of OpenStax *Chemistry 2e* (`src/data/openstax.js`). Links only: nothing is copied from that book.
- Parts 1 and 2 each end with a review page of practice questions, 24 and 18 (`src/data/review.js`).
- Worked examples whose answer is a structure show a drawing of it (`src/sketches.js`).
- The models live in `src/model-*.js` and are listed by lesson in `src/models.js`.
