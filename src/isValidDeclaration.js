const ohm = require('ohm-js');
const fs = require('fs-extra');
// TODO: don't require mdn-data at runtime
const { css: { properties } } = require('mdn-data');
const { PATHS, CSS } = require('./constants');

module.exports = function isValidDeclaration(property, value) {
  if (!properties[property]) {
    return false;
  } else if (CSS.globalValues.includes(value)) {
    return true;
  }

  const propertyGrammarContents = fs.readFileSync(`${PATHS.OHM_GRAMMAR_PATH}${property}.ohm`);
  const propertyGrammar = ohm.grammar(propertyGrammarContents);

  return propertyGrammar.match(value).succeeded();
};
