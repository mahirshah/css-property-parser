/**
 * Format each JSON grammar into an Ohm grammar
 */
const fs = require('fs-extra');
const OhmGrammarFormatter = require('./formatters/OhmGrammarFormatter');
const PATHS = require('./constants/paths');

const json = fs.readJsonSync('./src/jsonGrammars/basic-shape.json');

fs.outputFile(`${PATHS.OHM_GRAMMAR_PATH}basic-shape.ohm`, OhmGrammarFormatter.formatOhmGrammarFromJson(json, 'BasicShape'))
  .then(() => console.log(`Successfully wrote grammar to ${PATHS.OHM_GRAMMAR_PATH}`));
