/**
 * Format each formal syntax into a json grammar
 */
const fs = require('fs-extra');
const path = require('path');
const { css: { properties, syntaxes } } = require('mdn-data');
const { PATHS, SYNTAX_OVERRIDES } = require('../constants/index');
const JsonGrammarFormatter = require('../formatters/grammarFormatters/JsonGrammarFormatter');

// array of syntax/property names that require manual generation.
const manualSyntaxes = [
  'image()',
  'offset',
  'shape',
  'frames-timing-function',
  'feature-value-declaration',
  'cubic-bezier-timing-function',
  'rgb()',
  'rgba()',
  'hsl()',
  'hsla()',
  'color',
  'flex',
  'background',
  'final-bg-layer',
];

// combine properties and syntaxes into one object mapping property names to syntaxes
const syntaxesSyntaxMap = Object.entries(syntaxes)
  .reduce((syntaxMap, [name, { syntax }]) => Object.assign({ [name]: syntax }, syntaxMap), {});
const propertySyntaxMap = Object.entries(properties).reduce((syntaxMap, [propertyName, { syntax }]) => (
  Object.assign({ [propertyName]: syntax }, syntaxMap)
), syntaxesSyntaxMap);
const overriddenPropertySyntaxMap = Object.assign(propertySyntaxMap, SYNTAX_OVERRIDES);

// make the json grammar directory if needed
if (!fs.existsSync(PATHS.GENERATED_JSON_GRAMMAR_PATH)) {
  fs.mkdirSync(PATHS.GENERATED_JSON_GRAMMAR_PATH);
}

Object.entries(overriddenPropertySyntaxMap)
// filter out any entries that we need to do manually
  .filter(([grammarName]) => !manualSyntaxes.includes(grammarName))
  .forEach(([grammarName, formalSyntax]) => {
    const filename = path.join(PATHS.GENERATED_JSON_GRAMMAR_PATH, `${grammarName}.json`);
    console.log(`creating ${filename}`);
    const jsonGrammar = JsonGrammarFormatter.format(formalSyntax);
    fs.writeJson(filename, jsonGrammar, { spaces: 2 });
  });
