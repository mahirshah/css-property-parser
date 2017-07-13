/**
 * Format each JSON grammar into an Ohm grammar
 */
const fs = require('fs-extra');
const OhmGrammarFormatter = require('./formatters/OhmGrammarFormatter');
const CaseConverterUtils = require('./utils/CaseConverterUtils');
const PATHS = require('./constants/paths');

// use sync operations so we can debug easier
// read each json grammar and format it into an ohm grammar
fs.readdirSync(`${PATHS.JSON_GRAMMAR_PATH}`)
  .map(fileName => [fileName, fs.readJsonSync(`${PATHS.JSON_GRAMMAR_PATH}${fileName}`)])
  .forEach(([fileName, jsonGrammar]) => {
    console.log(`creating ${fileName}`);

    const grammarName = CaseConverterUtils.formalSyntaxIdentToOhmIdent(fileName.replace('.json', ''));
    const ohmGrammar = OhmGrammarFormatter
      .formatOhmGrammarFromJson(jsonGrammar, grammarName);
    const fileToWrite = `${PATHS.OHM_GRAMMAR_PATH}${fileName.replace('.json', '.ohm')}`;

    fs.createFileSync(fileToWrite);
    fs.writeFileSync(fileToWrite, ohmGrammar);
  });

console.log('Successfully created ohm grammars');
