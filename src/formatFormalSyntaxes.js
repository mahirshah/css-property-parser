/**
 * Format each formal syntax into a json grammar
 */
const fs = require('fs-extra');
const ohm = require('ohm-js');
const { css: { properties, syntaxes } } = require('mdn-data');
const PATHS = require('./constants/paths');
const JsonGrammarFormatter = require('./formatters/JsonGrammarFormatter');

// array of syntax/property names that require manual generation.
// TODO: export this property and check that manual syntax jsons exist in pre commit
const manualSyntaxes = ['image()', 'offset'];

fs.readFile(`${PATHS.FORMAL_SYNTAX_GRAMMAR_PATH}formalSyntax.ohm`)
  .then(grammarContents => ohm.grammar(grammarContents))
  .then(formalSyntaxGrammar => new JsonGrammarFormatter(formalSyntaxGrammar))
  .then((jsonGrammarFormatter) => {
    // combine properties and syntaxes into one object mapping property names to syntaxes
    const propertySyntaxMap = Object.entries(properties).reduce((syntaxMap, [propertyName, { syntax }]) => (
      Object.assign({ [propertyName]: syntax }, syntaxMap)
    ), syntaxes);

    Object.entries(propertySyntaxMap)
      // filter out any entries that we need to do manually
      .filter(([grammarName]) => !manualSyntaxes.includes(grammarName))
      // format each formal syntax into a json grammar
      .map(([grammarName, formalSyntax]) => (
        [grammarName, jsonGrammarFormatter.formatFormalSyntax(grammarName, formalSyntax)]))
      // write each json grammar to a file
      .forEach(([grammarName, jsonGrammar]) => (
        fs.writeJson(`${PATHS.JSON_GRAMMAR_PATH}${grammarName}.json`, jsonGrammar, { spaces: 2 })
      ));
  })
  .catch(e => console.log(e));
