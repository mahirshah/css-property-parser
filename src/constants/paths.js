const path = require('path');

module.exports = {
  JSON_GRAMMAR_PATH: path.join(__dirname, '..', 'grammars', 'json'),
  NEARLEY_PROPERTY_GRAMMAR_PATH: path.join(__dirname, '..', 'grammars', 'nearley', 'properties'),
  GENERATED_JSON_GRAMMAR_PATH: path.join(__dirname, '..', 'grammars', 'generated', 'json'),
  GENERATED_NEARLEY_GRAMMAR_PATH: path.join(__dirname, '..', 'grammars', 'generated', 'nearley'),
  GENERATED_JS_GRAMMAR_PATH: path.join(__dirname, '..', 'grammars', 'generated', 'js'),
  FORMATTED_DATA_PATH: path.join(__dirname, '..', 'formatted-data'),
  FORMAL_SYNTAX_GRAMMAR_PATH: path.join(__dirname, '..', 'grammars'),
  NEARLEY_BIN_ROOT: path.join(__dirname, '..', '..', 'node_modules', 'nearley', 'bin'),
};
