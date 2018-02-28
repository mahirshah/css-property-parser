/**
 * Format each JSON grammar into a Nearley grammar
 */
const fs = require('fs-extra');
const path = require('path');
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
fs.readdirSync(PATHS.JSON_GRAMMAR_PATH)
  .forEach((fileName) => {
    const fullSrc = path.join(PATHS.JSON_GRAMMAR_PATH, fileName);
    const fullDest = path.join(PATHS.GENERATED_JSON_GRAMMAR_PATH, fileName);
    fs.copySync(fullSrc, fullDest);
  });

// read each json grammar and format it into an nearley grammar
fs.readdirSync(PATHS.GENERATED_JSON_GRAMMAR_PATH)
  .map(fileName => [fileName, fs.readJsonSync(path.join(PATHS.GENERATED_JSON_GRAMMAR_PATH, fileName))])
  .forEach(([fileName, jsonGrammar]) => {
    console.log(`creating ${fileName}`);

    const grammarName = fileName.replace('.json', '');
    const nearleyGrammar = NearleyGrammarFormatter.format(jsonGrammar, grammarName);
    const fileToWrite = path.join(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH, fileName.replace('.json', `.${GRAMMAR_CONSTANTS.GRAMMAR_FILE_EXTENSION}`));

    fs.createFileSync(fileToWrite);
    fs.writeFileSync(fileToWrite, nearleyGrammar);
  });

// copy over overridden grammars
fs.readdirSync(PATHS.NEARLEY_PROPERTY_GRAMMAR_PATH)
  .forEach((fileName) => {
    const fullSrc = path.join(PATHS.NEARLEY_PROPERTY_GRAMMAR_PATH, fileName);
    const fullDest = path.join(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH, fileName);
    fs.copySync(fullSrc, fullDest);
  });

console.log('...Successfully created nearley grammars...');

// read each nearley grammar and use the nearley compiler to convert it into its js representation
const compilationQueue = async.queue((task, callback) => {
  console.log(task);
  exec(task, callback);
}, MAX_PARALLEL_PROCESSES);

const jsModules = [];
const compilationCommands = fs.readdirSync(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH)
  .map((fileName) => {
    const propName = fileName.replace(`.${GRAMMAR_CONSTANTS.GRAMMAR_FILE_EXTENSION}`, '');
    const safeFileName = propName.replace('*', 'STAR');
    const jsFileName = `${safeFileName}.${JAVASCRIPT_FILE_EXTENSION}`;
    const nearleyFilePath = JSON.stringify(path.join(PATHS.GENERATED_NEARLEY_GRAMMAR_PATH, fileName.replace('*', 'STAR')));
    const jsFilePath = JSON.stringify(
      path.join(PATHS.GENERATED_JS_GRAMMAR_PATH, jsFileName)
    );

    jsModules.push(`  '${propName}': require('./js/${jsFileName}')`);

    return `node ${path.join(PATHS.NEARLEY_BIN_ROOT, NEARLEY_COMPILER_FILE_NAME)} ${nearleyFilePath} > ${jsFilePath}`;
  });

const jsExportsFile = `module.exports = {\n${jsModules.join(',\n')}\n}`;

fs.writeFileSync(path.resolve(PATHS.GENERATED_JS_GRAMMAR_PATH, '..', 'index.js'), jsExportsFile);

compilationQueue.push(compilationCommands, (err) => {
  if (err) {
    console.error(err);
  }
});
