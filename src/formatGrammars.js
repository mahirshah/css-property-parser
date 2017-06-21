const fs = require('fs-extra');
const OhmGrammarFormatter = require('./formatters/OhmGrammarFormatter');
const PATHS = require('./constants/paths');

const json = fs.readJsonSync('./src/grammars/angle.json');

fs.outputFile(`${PATHS.OHM_GRAMMAR_PATH}angle.ohm`, OhmGrammarFormatter.formatOhmGrammarFromJson(json, 'Angle'))
  .then(() => console.log(`Successfully wrote grammar to ${PATHS.OHM_GRAMMAR_PATH}`));
