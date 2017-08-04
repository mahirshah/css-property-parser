/**
 * Format each JSON grammar into an Nearley grammar
 */
const fs = require('fs-extra');
const OhmGrammarFormatter = require('./formatters/grammarFormatters/OhmGrammarFormatter');
const CaseConverterUtils = require('./utils/CaseConverterUtils');
const PATHS = require('./constants/paths');
const GRAMMAR_CONSTANTS = require('./constants/grammars');

// make the nearley grammar directory if needed
if (!fs.existsSync(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH)) {
  fs.mkdirSync(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH);
}

// move manual json grammars into generated folder for grammar resolution
fs.readdirSync(`${PATHS.JSON_GRAMMAR_PATH}`)
  .forEach(fileName => (
    fs.copySync(`${PATHS.JSON_GRAMMAR_PATH}${fileName}`, `${PATHS.GENERATED_JSON_GRAMMAR_PATH}${fileName}`))
  );

// use sync operations so we can debug easier
// read each json grammar and format it into an ohm grammar
fs.readdirSync(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}`)
  .map(fileName => [fileName, fs.readJsonSync(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}${fileName}`)])
  .forEach(([fileName, jsonGrammar]) => {
    console.log(`creating ${fileName}`);

    const grammarName = CaseConverterUtils.formalSyntaxIdentToOhmIdent(fileName.replace('.json', ''));
    const nearleyGrammar = OhmGrammarFormatter
      .formatOhmGrammarFromJson(jsonGrammar, grammarName);
    const fileToWrite = `${PATHS.GENERATED_NEARLEY_GRAMMAR_PATH}${fileName.replace('.json', `.${GRAMMAR_CONSTANTS.GRAMMAR_FILE_EXTENSION}`)}`;

    fs.createFileSync(fileToWrite);
    fs.writeFileSync(fileToWrite, nearleyGrammar);
  });

console.log('Successfully created ohm grammars');
