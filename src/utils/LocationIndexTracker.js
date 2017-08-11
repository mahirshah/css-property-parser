/**
 * A basic index tracker for CSS grammars like background. This is a shared object between the application code
 * and the grammar. It should be reset between parsings. Use the index tracker in a grammar to reject certain parsings
 * in the postprocessing function. See the background nearley grammar for example usage.
 * @type {{location1: number, location2: number, reset: (function())}}
 */
module.exports = {
  location1: -1,
  location2: -1,
  reset() {
    this.location1 = -1;
    this.location2 = -1;
  },
};