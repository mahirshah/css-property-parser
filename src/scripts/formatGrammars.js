/**
 * Format each JSON grammar into a Nearley grammar
 */
const fs = require('fs-extra');
const NearleyGrammarFormatter = require('../formatters/grammarFormatters/NearleyGrammarFormatter');
const PATHS = require('../constants/paths');
const GRAMMAR_CONSTANTS = require('../constants/grammars');
const { exec } = require('child_process');
const async = require('async');

const MAX_PARALLEL_PROCESSES = 20;
const JAVASCRIPT_FILE_EXTENSION = 'js';
const NEARLEY_COMPILER_FILE_NAME = 'nearleyc.js';

// make the nearley grammar directory if needed
if (!fs.existsSync(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH)) {
  fs.mkdirSync(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH);
}

// make the js grammar directory if needed
if (!fs.existsSync(PATHS.GENERATED_JS_GRAMMAR_PATH)) {
  fs.mkdirSync(PATHS.GENERATED_JS_GRAMMAR_PATH);
}

// move manual json grammars into generated folder for grammar resolution
fs.readdirSync(`${PATHS.JSON_GRAMMAR_PATH}`)
  .forEach(fileName => (
    fs.copySync(`${PATHS.JSON_GRAMMAR_PATH}${fileName}`, `${PATHS.GENERATED_JSON_GRAMMAR_PATH}${fileName}`))
  );

// read each json grammar and format it into an nearley grammar
fs.readdirSync(PATHS.GENERATED_JSON_GRAMMAR_PATH)
  .map(fileName => [fileName, fs.readJsonSync(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}${fileName}`)])
  .forEach(([fileName, jsonGrammar]) => {
    console.log(`creating ${fileName}`);

    const grammarName = fileName.replace('.json', '');
    const nearleyGrammar = NearleyGrammarFormatter.format(jsonGrammar, grammarName);
    const fileToWrite = `${PATHS.GENERATED_NEARLEY_GRAMMAR_PATH}${fileName.replace('.json', `.${GRAMMAR_CONSTANTS.GRAMMAR_FILE_EXTENSION}`)}`;

    fs.createFileSync(fileToWrite);
    fs.writeFileSync(fileToWrite, nearleyGrammar);
  });

// copy over overridden grammars
fs.readdirSync(PATHS.NEARLEY_PROPERTY_GRAMMAR_PATH)
  .forEach(fileName => (
    fs.copySync(`${PATHS.NEARLEY_PROPERTY_GRAMMAR_PATH}${fileName}`, `${PATHS.GENERATED_NEARLEY_GRAMMAR_PATH}${fileName}`)
  ));

console.log('...Successfully created nearley grammars...');

// read each nearley grammar and use the nearley compiler to convert it into its js representation
const compilationQueue = async.queue((task, callback) => {
  console.log(task);
  exec(task, callback);
}, MAX_PARALLEL_PROCESSES);
const compilationCommands = fs.readdirSync(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH)
  .map((fileName) => {
    const nearleyFilePath = JSON.stringify(`${PATHS.GENERATED_NEARLEY_GRAMMAR_PATH}${fileName}`);
    const jsFilePath = JSON.stringify(`${PATHS.GENERATED_JS_GRAMMAR_PATH}${fileName.replace(`.${GRAMMAR_CONSTANTS.GRAMMAR_FILE_EXTENSION}`, `.${JAVASCRIPT_FILE_EXTENSION}`)}`);

    return `node ${PATHS.NEARLEY_BIN_ROOT}${NEARLEY_COMPILER_FILE_NAME} ${nearleyFilePath} > ${jsFilePath}`;
  });

compilationQueue.push(compilationCommands, (err) => {
  if (err) {
    console.error(err);
  }
});
