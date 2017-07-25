/**
 * Format each formal syntax into a json grammar
 */
const fs = require('fs-extra');
const nearley = require('nearley');
// const grammar = require('./grammars/formalSyntaxNearley');
const { css: { properties, syntaxes } } = require('mdn-data');
const { PATHS, SYNTAX_OVERRIDES } = require('./constants');
const JsonGrammarFormatter2 = require('./formatters/grammarFormatters/JsonGrammarFormatter2');
const make = require('nearley-make');
const grammar = fs.readFileSync('./grammars/formalSyntax2.ne', 'utf-8');


// array of syntax/property names that require manual generation.
// TODO: export this property and check that manual syntax jsons exist in pre commit
const manualSyntaxes = ['image()', 'offset', 'line-name-list'];


// combine properties and syntaxes into one object mapping property names to syntaxes
const syntaxesSyntaxMap = Object.entries(syntaxes)
  .reduce((syntaxMap, [name, { syntax }]) => Object.assign({ [name]: syntax }, syntaxMap), {});
const propertySyntaxMap = Object.entries(properties).reduce((syntaxMap, [propertyName, { syntax }]) => (
  Object.assign({ [propertyName]: syntax }, syntaxMap)
), syntaxesSyntaxMap);
const overridenPropertySyntaxMap = Object.assign(propertySyntaxMap, SYNTAX_OVERRIDES);

Object.entries(overridenPropertySyntaxMap)
// filter out any entries that we need to do manually
  .filter(([grammarName]) => !manualSyntaxes.includes(grammarName))
  .forEach(([grammarName, formalSyntax]) => {
    console.log(`creating ${PATHS.JSON_GRAMMAR_PATH}${grammarName}.json`);
    const jsonGrammar = JsonGrammarFormatter2.format(formalSyntax);
    fs.writeJson(`${PATHS.JSON_GRAMMAR_PATH}${grammarName}.json`, jsonGrammar, { spaces: 2 });
  });


// const parser = make(grammar, {});
// parser.feed('auto | <a>#');
// const json = JsonGrammarFormatter2.format('<a>#');
// console.log(json)


